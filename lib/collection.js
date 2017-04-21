'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _withScrollApi = require('./scrollable/with-scroll-api.jsx');

var _withScrollApi2 = _interopRequireDefault(_withScrollApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollectionView = function (_Component) {
  _inherits(CollectionView, _Component);

  _createClass(CollectionView, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        scroll: _propTypes2.default.shape({
          getScrollContainer: _propTypes2.default.func,
          addEventListener: _propTypes2.default.func,
          removeEventListener: _propTypes2.default.func
        }).isRequired,
        prerender: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
        items: _propTypes2.default.arrayOf(_propTypes2.default.object),
        getHeight: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.func]).isRequired,
        getWidth: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.func]),
        renderItem: _propTypes2.default.func.isRequired,
        itemStyle: _propTypes2.default.object,
        delayFirstRender: _propTypes2.default.bool,
        itemClassName: _propTypes2.default.string,
        className: _propTypes2.default.string,
        style: _propTypes2.default.object
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        prerender: 0,
        items: [],
        getWidth: '100%',
        itemStyle: undefined,
        delayFirstRender: false,
        itemClassName: undefined,
        className: undefined,
        style: undefined
      };
    }
  }]);

  function CollectionView() {
    _classCallCheck(this, CollectionView);

    var _this = _possibleConstructorReturn(this, (CollectionView.__proto__ || Object.getPrototypeOf(CollectionView)).call(this));

    _this.renderItem = _this.renderItem.bind(_this);
    _this.handleScroll = _this.handleScroll.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);
    _this.sizeCache = {};
    _this.maxItems = 0;
    _this.state = {
      innerWidth: 0,
      offset: 0
    };
    return _this;
  }

  _createClass(CollectionView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          scroll = _props.scroll,
          _props$prerender = _props.prerender,
          prerender = _props$prerender === undefined ? 0 : _props$prerender;

      var node = scroll.getScrollContainer();
      this.setState({
        innerWidth: node.offsetWidth,
        innerHeight: node.offsetHeight,
        prerender: this.toPixels(prerender, node.offsetHeight)
      }, function () {
        _this2.calculatePositions(function () {
          _this2.handleScroll();
          global.addEventListener('resize', _this2.handleResize);
        });
      });
      scroll.addEventListener('scroll', this.handleScroll);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var scroll = this.props.scroll;

      scroll.addEventListener('scroll', this.handleScroll);
      global.removeEventListener('resize', this.handleResize);
    }
  }, {
    key: 'getScrollOffset',
    value: function getScrollOffset(scrollTop) {
      var scroll = this.props.scroll;

      var ownDom = _reactDom2.default.findDOMNode(this);
      var parentDom = scroll.getScrollContainer();

      var ownClient = ownDom.getBoundingClientRect();
      var parentClient = parentDom.getBoundingClientRect();
      return ownClient.top + scrollTop - parentClient.top;
    }
  }, {
    key: 'toPixels',
    value: function toPixels(value) {
      var _this3 = this;

      var relation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'width';

      if (!isNaN(value)) {
        return value;
      }
      if (!this.sizeCache[relation]) {
        this.sizeCache[relation] = {};
      }
      if (this.sizeCache[relation][value]) {
        return this.sizeCache[relation][value];
      }
      var matchGroups = value.replace(/ /g, '').split(/([0-9.]+[^+-]+[+-]?)/g).filter(function (a) {
        return !!a;
      });
      var result = 0;
      var operator = '+';
      matchGroups.forEach(function (match, index) {
        var currentOperator = operator;
        if (index < matchGroups.length - 1) {
          operator = match.slice(-1);
          match = match.slice(0, -1);
        }

        var _$exec = /([0-9.]+)(.*)/.exec(match),
            _$exec2 = _slicedToArray(_$exec, 3),
            number = _$exec2[1],
            _$exec2$ = _$exec2[2],
            unit = _$exec2$ === undefined ? 'px' : _$exec2$;

        var parsed = parseFloat(number);
        switch (unit.trim()) {
          case '%':
            {
              var innerWidth = _this3.state.innerWidth;

              parsed = (relation == 'width' ? innerWidth : relation) / 100 * parseFloat(number);
            }
          default:
            {}
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
  }, {
    key: 'handleResize',
    value: function handleResize() {
      var _this4 = this;

      var _props2 = this.props,
          scroll = _props2.scroll,
          prerender = _props2.prerender;

      this.sizeCache = {};
      this.maxItems = 0;
      var node = scroll.getScrollContainer();
      this.setState({
        innerWidth: node.offsetWidth,
        innerHeight: node.offsetHeight,
        prerender: this.toPixels(prerender, node.offsetHeight)
      }, function () {
        _this4.calculatePositions(function () {
          _this4.handleScroll({ target: { scrollTop: node.scrollTop } });
        });
      });
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll(evt) {
      this.getScrollOffset();
      var items = this.props.items;
      var _state = this.state,
          tops = _state.tops,
          bottoms = _state.bottoms,
          innerHeight = _state.innerHeight,
          prerender = _state.prerender;

      var scrollTop = evt ? evt.target.scrollTop - this.getScrollOffset(evt.target.scrollTop) : 0;
      var scrollBottom = scrollTop + innerHeight;
      var offset = false;
      var visibleCount = 0;
      items.forEach(function (item, index) {
        if (bottoms[index] >= scrollTop - prerender && tops[index] <= scrollBottom + prerender) {
          if (offset === false) {
            offset = index;
          }
          visibleCount++;
        }
      });
      if (offset !== this.state.offset || visibleCount !== this.state.visibleCount) {
        this.setState({
          offset: offset,
          visibleCount: visibleCount
        });
      }
    }
  }, {
    key: 'calculatePositions',
    value: function calculatePositions(callback) {
      var _props3 = this.props,
          getHeight = _props3.getHeight,
          getWidth = _props3.getWidth,
          items = _props3.items;
      var innerWidth = this.state.innerWidth;

      var heights = new Array(items.length);
      var widths = new Array(items.length);
      var lefts = new Array(items.length);
      var tops = new Array(items.length);
      var bottoms = new Array(items.length);
      var currentWidth = 0;
      var currentHeight = 0;
      var maxRowHeight = 0;
      for (var index = 0; index < items.length; index++) {
        var height = typeof getHeight === 'function' ? getHeight(index) : getHeight;
        var width = typeof getWidth === 'function' ? getWidth(index) : getWidth;
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
        heights: heights,
        widths: widths,
        lefts: lefts,
        tops: tops,
        bottoms: bottoms,
        totalHeight: currentHeight + maxRowHeight
      }, callback);
    }
  }, {
    key: 'renderItem',
    value: function renderItem(item, index) {
      var _props4 = this.props,
          renderItem = _props4.renderItem,
          itemStyle = _props4.itemStyle,
          itemClassName = _props4.itemClassName;
      var _state2 = this.state,
          lefts = _state2.lefts,
          tops = _state2.tops,
          heights = _state2.heights,
          widths = _state2.widths,
          offset = _state2.offset,
          visibleCount = _state2.visibleCount;

      if (visibleCount > this.maxItems) {
        this.maxItems = visibleCount;
      }
      if (!lefts) {
        return null;
      }
      if (index < offset || index > offset + this.maxItems) {
        return null;
      }
      var key = index - offset;
      var renderedItem = renderItem(item, index, {
        key: key,
        left: lefts[index],
        top: tops[index],
        width: widths[index],
        height: heights[index]
      });
      return _react2.default.createElement(
        'div',
        {
          className: itemClassName,
          key: key,
          style: _extends({}, itemStyle, {
            left: lefts[index] + 'px',
            top: tops[index] + 'px',
            width: widths[index] + 'px',
            height: heights[index] + 'px',
            position: 'absolute'
          })
        },
        renderedItem
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          items = _props5.items,
          delayFirstRender = _props5.delayFirstRender,
          className = _props5.className,
          style = _props5.style;
      var _state3 = this.state,
          totalHeight = _state3.totalHeight,
          visibleCount = _state3.visibleCount;

      return _react2.default.createElement(
        'div',
        {
          className: className,
          style: _extends({}, style, {
            position: 'relative',
            height: totalHeight
          })
        },
        !!visibleCount && delayFirstRender && items.map(this.renderItem)
      );
    }
  }]);

  return CollectionView;
}(_react.Component);

exports.default = (0, _withScrollApi2.default)(CollectionView);