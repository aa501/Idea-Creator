"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Ellipsis;

var _slate = require("slate");

var _isModKey = require("../lib/isModKey");

var _isModKey2 = _interopRequireDefault(_isModKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Ellipsis() {
  return {
    onKeyDown: function onKeyDown(ev, editor, next) {
      if ((0, _isModKey2.default)(ev) || ev.key !== " ") return next();

      var value = editor.value;
      var startBlock = value.startBlock,
          selection = value.selection;

      if (selection.isExpanded) return next();
      if (!startBlock || startBlock.type.match(/code/)) return next();

      var startOffset = value.selection.start.offset - 3;
      var textNode = startBlock.getFirstText();
      if (!textNode) return next();

      var chars = textNode.text.slice(startOffset, startOffset + 3);

      // replaces three periods with a real ellipsis character
      if (chars === "...") {
        return editor.removeTextByKey(textNode.key, startOffset, 3).insertTextByKey(textNode.key, startOffset, "…");
      }

      return next();
    }
  };
}