"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function Icon(_ref) {
  var children = _ref.children,
      className = _ref.className,
      onClick = _ref.onClick,
      theme = _ref.theme,
      rest = _objectWithoutProperties(_ref, ["children", "className", "onClick", "theme"]);

  var size = rest.size ? rest.size + "px" : "24px";

  var fill = "#4E5C6E";
  if (rest.color) fill = rest.color;
  if (rest.light) fill = "#FFF";
  if (rest.black) fill = "#000";

  return React.createElement(
    "svg",
    {
      fill: fill,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      className: className,
      onClick: onClick
    },
    children
  );
}

exports.default = Icon;