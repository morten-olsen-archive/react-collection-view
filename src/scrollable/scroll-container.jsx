import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const scrollContainer = WrappedComponent => class Scrollable extends Component {
  static get childContextTypes() {
    return {
      scroll: PropTypes.object,
    };
  }

  constructor() {
    super();
    this.listeners = {};
    this.isUnmounted = false;
    this.onDomEvent = this.onDomEvent.bind(this);
  }

  getChildContext() {
    return {
      scroll: {
        addEventListener: this.addEventListener.bind(this),
        removeEventListener: this.removeEventListener.bind(this),
        scrollTo: this.scrollTo.bind(this),
        getScrollContainer: this.getScrollContainer.bind(this),
      },
    };
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    const container = ReactDOM.findDOMNode(this);
    if (container) {
      Object.keys(this.listeners).forEach((event) => {
        container.removeEventListener(event, this.onDomEvent);
      });
    }
  }

  onDomEvent(event) {
    this.getListeners(event.type).forEach((listener) => {
      this.sendEvent(listener, event);
    });
  }

  addEventListener(event, callback) {
    if (this.isUnmounted) return;
    if (!this.listeners[event]) {
      const container = ReactDOM.findDOMNode(this);
      container.addEventListener(event, this.onDomEvent);
    }
    this.getListeners(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.isUnmounted) return;
    const index = this.getListeners(event).indexOf(callback);
    if (~index) {
      this.getListeners(event).splice(index, 1);
    }
  }

  getScrollContainer() {
    if (!this.isUnmounted) {
      return ReactDOM.findDOMNode(this);
    } else {
      return <div />;
    }
  }

  sendEvent(listener, evt) {
    listener(evt);
  }

  getListeners(name) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    return this.listeners[name];
  }

  scrollTo(x) {
    const container = ReactDOM.findDOMNode(this);
    container.scrollTop = x;
  }

  render() {
    return <WrappedComponent {...this.props} />;
  }
};

export default scrollContainer;
