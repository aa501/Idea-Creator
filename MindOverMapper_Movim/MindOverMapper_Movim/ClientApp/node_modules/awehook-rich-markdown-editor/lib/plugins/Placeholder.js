"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _slate = require("slate");

var _Placeholder = require("../components/Placeholder");

var _Placeholder2 = _interopRequireDefault(_Placeholder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function PlaceholderPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var placeholder = options.placeholder,
      when = options.when;


  (0, _invariant2.default)(placeholder, "You must pass `PlaceholderPlugin` an `options.placeholder` string.");

  (0, _invariant2.default)(when, "You must pass `PlaceholderPlugin` an `options.when` query.");

  /**
   * Decorate a match node with a placeholder mark when it fits the query.
   */
  function decorateNode(node, editor, next) {
    if (!editor.query(when, node)) {
      return next();
    }

    var others = next() || [];
    var first = node.getFirstText();
    if (!first) return next();

    var decoration = {
      anchor: { key: first.key, offset: 0 },
      focus: { key: first.key, offset: 0 },
      mark: { type: "placeholder", data: { placeholder: placeholder } }
    };

    return [].concat(_toConsumableArray(others), [decoration]);
  }

  /**
   * Render an inline placeholder for the placeholder mark.
   */
  function renderMark(props, editor, next) {
    var children = props.children,
        mark = props.mark;


    if (mark.type === "placeholder") {
      var content = mark.data.get("placeholder");

      return _react2.default.createElement(
        "span",
        null,
        _react2.default.createElement(
          _Placeholder2.default,
          null,
          content
        ),
        children
      );
    }

    return next();
  }

  return { decorateNode: decorateNode, renderMark: renderMark };
}

exports.default = PlaceholderPlugin;