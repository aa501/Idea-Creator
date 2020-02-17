"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = Embeds;

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _slate = require("slate");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function findTopParent(document, node) {
  var parent = void 0;
  while (node !== document) {
    parent = document.getParent(node.key);
    if (parent === document) return node;
    node = parent;
  }
}

function Embeds(_ref) {
  var getComponent = _ref.getComponent;

  return {
    normalizeNode: function normalizeNode(node, editor, next) {
      if (!getComponent || node.type === "block" || node.type !== "link" || node.text !== node.data.get("href")) return next();

      var component = getComponent(node);
      if (!component) return next();

      var parent = findTopParent(editor.value.document, node);
      if (!parent) return next();

      if (parent.type !== "paragraph" || parent.text !== node.text) return next();

      return function (editor) {
        return editor.replaceNodeByKey(parent.key, {
          object: "block",
          type: "link",
          isVoid: true,
          nodes: [{
            object: "text",
            leaves: [{ text: "" }]
          }],
          data: _extends({}, node.data.toJS(), { embed: true, component: component })
        });
      };
    }
  };
}