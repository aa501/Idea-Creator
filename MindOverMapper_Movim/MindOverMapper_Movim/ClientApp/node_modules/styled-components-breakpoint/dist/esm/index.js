function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { _breakpoint, _map } from './core';

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

      return _breakpoint(theme.breakpoints || defaultBreakpoints, gte, lt).apply(undefined, [strings].concat(_toConsumableArray(interpolations)));
    };
  };
}

export function map(value, mapValueToCSS) {
  return function (_ref2) {
    var _ref2$theme = _ref2.theme,
        theme = _ref2$theme === undefined ? {} : _ref2$theme;

    return _map(theme.breakpoints || defaultBreakpoints, value, mapValueToCSS);
  };
}

export function createStatic() {
  var breakpoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultBreakpoints;

  return Object.keys(breakpoints).reduce(function (accum, name) {
    accum[name] = _breakpoint(breakpoints, name);
    return accum;
  }, {
    breakpoint: function breakpoint(gte, lt) {
      return _breakpoint(breakpoints, gte, lt);
    },
    map: function map(value, mapValueToCSS) {
      return _map(breakpoints, value, mapValueToCSS);
    }
  });
}

export default breakpoint;