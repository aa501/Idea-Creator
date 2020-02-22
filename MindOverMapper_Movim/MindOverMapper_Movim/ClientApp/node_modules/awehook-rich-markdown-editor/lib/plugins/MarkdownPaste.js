"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MarkdownPaste;

var _slate = require("slate");

var _slateReact = require("slate-react");

var _serializer = require("../serializer");

var _serializer2 = _interopRequireDefault(_serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MarkdownPaste() {
  return {
    onPaste: function onPaste(ev, editor, next) {
      var transfer = (0, _slateReact.getEventTransfer)(ev);
      var text = transfer.text;

      if (transfer.type !== "text" && transfer.type !== "html") return next();

      var fragment = _serializer2.default.deserialize(text || "");
      if (!fragment) return;

      return editor.insertFragment(fragment.document);
    }
  };
}