'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ErrorApi = function () {
  function ErrorApi() {
    _classCallCheck(this, ErrorApi);
  }

  _createClass(ErrorApi, [{
    key: 'logError',
    value: function logError() {
      global.console.error(new Error('Using scroll API on element without scroll wrapper'));
    }
  }, {
    key: 'getScrollContainer',
    value: function getScrollContainer() {
      this.logError();
      return _react2.default.createElement('div', null);
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener() {
      this.logError();
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener() {
      this.logError();
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo() {
      this.logError();
    }
  }]);

  return ErrorApi;
}();

exports.default = new ErrorApi();