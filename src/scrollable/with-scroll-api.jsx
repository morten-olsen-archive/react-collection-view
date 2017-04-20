import React, { Component } from 'react';
import PropTypes from 'prop-types';
import errorApi from './error-api.jsx';

const scrollable = WrappedComponent => class ScrollableComponet extends Component {
  static get contextTypes() {
    return {
      scroll: PropTypes.object,
    };
  }

  render() {
    return <WrappedComponent {...this.props} scroll={this.context.scroll || errorApi} />;
  }
};

export default scrollable;
