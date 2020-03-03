'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = map;
exports.createStatic = createStatic;

var _core = require('./core');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultBreakpoints = {
  mobile: 0, // targeting all devices
  tablet: 737, // targeting devices that are LARGER than the iPhone 6 Plus (which is 736px in landscape mode)
  desktop: 1025 // targeting devices that are LARGER than the iPad (which is 1024px in landscape mode)
};

function breakpoint(gte, lt) {
  return function (strings) {
    for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      interpolations[_key - 1] = arguments[_key];
    }

    return function (_ref) {
      var _ref$theme = _ref.theme,
          theme = _ref$theme === undefined ? {} : _ref$theme;

      return (0, _core._breakpoint)(theme.breakpoints || defaultBreakpoints, gte, lt).apply(undefined, [strings].concat(_toConsumableArray(interpolations)));
    };
  };
}

function map(value, mapValueToCSS) {
  return function (_ref2) {
    var _ref2$theme = _ref2.theme,
        theme = _ref2$theme === undefined ? {} : _ref2$theme;

    return (0, _core._map)(theme.breakpoints || defaultBreakpoints, value, mapValueToCSS);
  };
}

function createStatic() {
  var breakpoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultBreakpoints;

  return Object.keys(breakpoints).reduce(function (accum, name) {
    accum[name] = (0, _core._breakpoint)(breakpoints, name);
    return accum;
  }, {
    breakpoint: function breakpoint(gte, lt) {
      return (0, _core._breakpoint)(breakpoints, gte, lt);
    },
    map: function map(value, mapValueToCSS) {
      return (0, _core._map)(breakpoints, value, mapValueToCSS);
    }
  });
}

exports.default = breakpoint;