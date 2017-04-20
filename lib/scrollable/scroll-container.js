'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scrollContainer = function scrollContainer(WrappedComponent) {
  return function (_Component) {
    _inherits(Scrollable, _Component);

    _createClass(Scrollable, null, [{
      key: 'childContextTypes',
      get: function get() {
        return {
          scroll: _propTypes2.default.object
        };
      }
    }]);

    function Scrollable() {
      _classCallCheck(this, Scrollable);

      var _this = _possibleConstructorReturn(this, (Scrollable.__proto__ || Object.getPrototypeOf(Scrollable)).call(this));

      _this.listeners = {};
      _this.isUnmounted = false;
      _this.onDomEvent = _this.onDomEvent.bind(_this);
      return _this;
    }

    _createClass(Scrollable, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          scroll: {
            addEventListener: this.addEventListener.bind(this),
            removeEventListener: this.removeEventListener.bind(this),
            scrollTo: this.scrollTo.bind(this),
            getScrollContainer: this.getScrollContainer.bind(this)
          }
        };
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _this2 = this;

        this.isUnmounted = true;
        var container = _reactDom2.default.findDOMNode(this);
        if (container) {
          Object.keys(this.listeners).forEach(function (event) {
            container.removeEventListener(event, _this2.onDomEvent);
          });
        }
      }
    }, {
      key: 'onDomEvent',
      value: function onDomEvent(event) {
        var _this3 = this;

        this.getListeners(event.type).forEach(function (listener) {
          _this3.sendEvent(listener, event);
        });
      }
    }, {
      key: 'addEventListener',
      value: function addEventListener(event, callback) {
        if (this.isUnmounted) return;
        if (!this.listeners[event]) {
          var container = _reactDom2.default.findDOMNode(this);
          container.addEventListener(event, this.onDomEvent);
        }
        this.getListeners(event).push(callback);
      }
    }, {
      key: 'removeEventListener',
      value: function removeEventListener(event, callback) {
        if (this.isUnmounted) return;
        var index = this.getListeners(event).indexOf(callback);
        if (~index) {
          this.getListeners(event).splice(index, 1);
        }
      }
    }, {
      key: 'getScrollContainer',
      value: function getScrollContainer() {
        if (!this.isUnmounted) {
          return _reactDom2.default.findDOMNode(this);
        } else {
          return _react2.default.createElement('div', null);
        }
      }
    }, {
      key: 'sendEvent',
      value: function sendEvent(listener, evt) {
        listener(evt);
      }
    }, {
      key: 'getListeners',
      value: function getListeners(name) {
        if (!this.listeners[name]) {
          this.listeners[name] = [];
        }
        return this.listeners[name];
      }
    }, {
      key: 'scrollTo',
      value: function scrollTo(x) {
        var container = _reactDom2.default.findDOMNode(this);
        container.scrollTop = x;
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(WrappedComponent, this.props);
      }
    }]);

    return Scrollable;
  }(_react.Component);
};

exports.default = scrollContainer;