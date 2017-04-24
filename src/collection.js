import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withScrollApi } from 'react-scroll-view';

class CollectionView extends Component {

  static get propTypes() {
    return {
      scroll: PropTypes.shape({
        getScrollContainer: PropTypes.func,
        addEventListener: PropTypes.func,
        removeEventListener: PropTypes.func,
      }).isRequired,
      prerender: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      items: PropTypes.arrayOf(PropTypes.object),
      getHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.func,
      ]).isRequired,
      getWidth: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.func,
      ]),
      renderItem: PropTypes.func.isRequired,
      itemStyle: PropTypes.object,
      delayFirstRender: PropTypes.bool,
      itemClassName: PropTypes.string,
      className: PropTypes.string,
      style: PropTypes.object,
    };
  }

  static get defaultProps() {
    return {
      prerender: 0,
      items: [],
      getWidth: '100%',
      itemStyle: undefined,
      delayFirstRender: false,
      itemClassName: undefined,
      className: undefined,
      style: undefined,
    };
  }

  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.sizeCache = {};
    this.maxItems = 0;
    this.state = {
      innerWidth: 0,
      offset: 0,
    };
  }

  componentDidMount() {
    const { scroll, prerender = 0 } = this.props;
    const node = scroll.getScrollContainer();
    this.setState({
      innerWidth: node.offsetWidth,
      innerHeight: node.offsetHeight,
      prerender: this.toPixels(prerender, node.offsetHeight),
    }, () => {
      this.calculatePositions(() => {
        this.handleScroll();
        global.addEventListener('resize', this.handleResize);
      });
    });
    scroll.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(next) {
    this.calculatePositions(() => {
      this.handleScroll();
    }, next);
  }

  componentWillUnmount() {
    const { scroll } = this.props;
    scroll.addEventListener('scroll', this.handleScroll);
    global.removeEventListener('resize', this.handleResize);
  }

  getScrollOffset(scrollTop) {
    const { scroll } = this.props;
    const ownDom = ReactDOM.findDOMNode(this);
    const parentDom = scroll.getScrollContainer();

    const ownClient = ownDom.getBoundingClientRect();
    const parentClient = parentDom.getBoundingClientRect();
    return (ownClient.top + scrollTop) - parentClient.top;
  }

  toPixels(value, relation = 'width') {
    if (!isNaN(value)) {
      return value;
    }
    if (!this.sizeCache[relation]) {
      this.sizeCache[relation] = {};
    }
    if (this.sizeCache[relation][value]) {
      return this.sizeCache[relation][value];
    }
    const matchGroups = value.replace(/ /g, '').split(/([0-9.]+[^+-]+[+-]?)/g).filter(a => !!a);
    let result = 0;
    let operator = '+';
    matchGroups.forEach((match, index) => {
      const currentOperator = operator;
      if (index < matchGroups.length - 1) {
        operator = match.slice(-1);
        match = match.slice(0, -1);
      }
      const [, number, unit = 'px'] = /([0-9.]+)(.*)/.exec(match);
      let parsed = parseFloat(number);
      switch (unit.trim()) {
        case '%': {
          const { innerWidth } = this.state;
          parsed = ((relation === 'width' ? innerWidth : relation) / 100) * parseFloat(number);
          break;
        }
        default: {
          break;
        }
      }
      if (currentOperator === '+') {
        result += parsed;
      } else if (currentOperator === '-') {
        result -= parsed;
      }
    });
    this.sizeCache[relation][value] = result;
    return result;
  }

  handleResize() {
    const { scroll, prerender } = this.props;
    this.sizeCache = {};
    this.maxItems = 0;
    const node = scroll.getScrollContainer();
    this.setState({
      innerWidth: node.offsetWidth,
      innerHeight: node.offsetHeight,
      prerender: this.toPixels(prerender, node.offsetHeight),
    }, () => {
      this.calculatePositions(() => {
        this.handleScroll({ target: { scrollTop: node.scrollTop } });
      });
    });
  }

  handleScroll(evt) {
    this.getScrollOffset();
    const { items } = this.props;
    const { tops, bottoms, innerHeight, prerender } = this.state;
    const scrollTop = evt
      ? evt.target.scrollTop - this.getScrollOffset(evt.target.scrollTop)
      : 0;
    const scrollBottom = scrollTop + innerHeight;
    let offset = false;
    let visibleCount = 0;
    items.forEach((item, index) => {
      if (
        bottoms[index] >= scrollTop - prerender
        && tops[index] <= scrollBottom + prerender
      ) {
        if (offset === false) {
          offset = index;
        }
        visibleCount++;
      }
    });
    if (offset !== this.state.offset || visibleCount !== this.state.visibleCount) {
      this.setState({
        offset,
        visibleCount,
      });
    }
  }

  calculatePositions(callback, next) {
    const {
      getHeight,
      getWidth,
      items,
    } = (next || this.props);
    const {
      innerWidth,
    } = this.state;
    const heights = new Array(items.length);
    const widths = new Array(items.length);
    const lefts = new Array(items.length);
    const tops = new Array(items.length);
    const bottoms = new Array(items.length);
    let currentWidth = 0;
    let currentHeight = 0;
    let maxRowHeight = 0;
    for (let index = 0; index < items.length; index++) {
      const height = typeof getHeight === 'function' ? getHeight(index) : getHeight;
      const width = typeof getWidth === 'function' ? getWidth(index) : getWidth;
      widths[index] = this.toPixels(width);
      heights[index] = this.toPixels(height, widths[index]);

      if (widths[index] + currentWidth > innerWidth) {
        currentWidth = 0;
        currentHeight += maxRowHeight;
        maxRowHeight = 0;
      }
      lefts[index] = currentWidth;
      tops[index] = currentHeight;
      bottoms[index] = currentHeight + heights[index];
      currentWidth += widths[index];
      if (heights[index] > maxRowHeight) {
        maxRowHeight = heights[index];
      }
    }
    this.setState({
      heights,
      widths,
      lefts,
      tops,
      bottoms,
      totalHeight: currentHeight + maxRowHeight,
    }, callback);
  }

  renderItem(item, index) {
    const { renderItem, itemStyle, itemClassName } = this.props;
    const { lefts, tops, heights, widths, offset, visibleCount } = this.state;
    if (visibleCount > this.maxItems) {
      this.maxItems = visibleCount;
    }
    if (!lefts) {
      return null;
    }
    if (index < offset || index > offset + this.maxItems) {
      return null;
    }
    const key = index - offset;
    const renderedItem = renderItem(item, index, {
      key,
      left: lefts[index],
      top: tops[index],
      width: widths[index],
      height: heights[index],
    });
    return (
      <div
        className={itemClassName}
        key={key}
        style={{
          ...itemStyle,
          left: `${lefts[index]}px`,
          top: `${tops[index]}px`,
          width: `${widths[index]}px`,
          height: `${heights[index]}px`,
          position: 'absolute',
        }}
      >
        {renderedItem}
      </div>
    );
  }

  render() {
    const { items, delayFirstRender, className, style } = this.props;
    const { totalHeight, visibleCount } = this.state;
    return (
      <div
        className={className}
        style={{
          ...style,
          position: 'relative',
          height: totalHeight,
        }}
      >
        {(!!visibleCount && delayFirstRender) && items.map(this.renderItem)}
      </div>
    );
  }
}

export default withScrollApi(CollectionView);
