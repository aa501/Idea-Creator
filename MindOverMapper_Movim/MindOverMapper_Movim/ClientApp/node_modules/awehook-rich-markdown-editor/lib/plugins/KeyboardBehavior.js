"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = KeyboardBehavior;

var _slate = require("slate");

var _isModKey = require("../lib/isModKey");

var _isModKey2 = _interopRequireDefault(_isModKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function KeyboardBehavior() {
  function onKeyDown(ev, editor, next) {
    if ((0, _isModKey2.default)(ev)) return next();

    switch (ev.key) {
      case "Enter":
        return onEnter(ev, editor, next);
      case "Tab":
        return onTab(ev, editor, next);
      case "Backspace":
        return onBackspace(ev, editor, next);
      default:
        return next();
    }
  }

  function onEnter(ev, editor, next) {
    var value = editor.value;
    var startBlock = value.startBlock,
        selection = value.selection;

    if (selection.isExpanded) return next();
    if (!startBlock) return next();

    var endOffset = selection.end.offset;

    // Hitting enter while an image is selected should jump caret below and
    // insert a new paragraph
    if (startBlock.type === "image") {
      ev.preventDefault();
      return editor.splitBlock(10).setBlocks({
        type: "paragraph",
        text: "",
        isVoid: false
      });
    }

    if (startBlock.type.match(/(heading|block-quote)/)) {
      ev.preventDefault();

      // if the heading is collapsed then show everything now so the user
      // isn't editing in a weird state with some content hidden
      editor.showContentBelow(startBlock);

      // Hitting enter in a heading or blockquote will split the node at that
      // point and make the new node a paragraph
      if (endOffset > 0) {
        return editor.splitBlock().setBlocks("paragraph");
      } else {
        return editor.splitBlock().moveToStartOfPreviousBlock().setBlocks("paragraph");
      }
    }

    return next();
  }

  function onTab(ev, editor, next) {
    var value = editor.value;
    var startBlock = value.startBlock;

    if (!startBlock) return next();

    // On tab, if at the end of the heading jump to the main body content
    // as if it is another input field (act the same as enter).
    if (startBlock.type === "heading1") {
      ev.preventDefault();
      return editor.splitBlock().setBlocks("paragraph");
    }

    return next();
  }

  function onBackspace(ev, editor, next) {
    var value = editor.value;
    var startBlock = value.startBlock,
        selection = value.selection;

    if (!startBlock) return next();

    // If image or embed is selected go ahead and delete the whole block
    if (startBlock.type === "image" || startBlock.type === "link") {
      ev.preventDefault();
      return editor.removeNodeByKey(startBlock.key).moveToStartOfNextBlock();
    }

    if (selection.isExpanded) {
      // If we're about to remove a heading then ensure that its not collapsed
      if (selection.start.offset === 0 && selection.end.offset === startBlock.text.length && startBlock.type.match(/heading/)) {
        editor.showContentBelow(startBlock);
      }

      return next();
    }

    // If at the start of a non-paragraph, convert it back into a paragraph
    if (selection.start.offset === 0) {
      if (startBlock.type === "paragraph" || startBlock.type === "code-line") return next();
      ev.preventDefault();

      // If we're about to remove a heading then ensure that its not collapsed
      if (startBlock.type.match(/heading/)) {
        editor.showContentBelow(startBlock);
      }
      editor.setBlocks("paragraph");

      if (startBlock.type === "list-item") {
        editor.unwrapBlock("bulleted-list");
      }

      return;
    }

    if (selection.isCollapsed) {
      var marksAtCursor = startBlock.getMarksAtRange(selection);
      var codeMarksAtCursor = marksAtCursor.filter(function (mark) {
        return mark.type === "code";
      });

      // If at the end of a code mark hitting backspace should remove the mark
      if (codeMarksAtCursor.size > 0) {
        ev.preventDefault();

        var iterationOffset = 0;
        var startOffset = selection.start.offset;
        var textNode = startBlock.getTextAtOffset(startOffset);
        var leavesUntilCode = textNode.leaves.takeUntil(function (v) {
          iterationOffset += v.text.length;
          return iterationOffset > startOffset;
        });

        var textUntilCode = leavesUntilCode.map(function (l) {
          return l.text;
        }).join("");
        var codeLeaf = leavesUntilCode.reverse().first();

        if (!codeLeaf) return next();
        if (startOffset !== textUntilCode.length) return next();

        return editor.removeMarkByKey(textNode.key, startOffset - codeLeaf.text.length, startOffset, "code");
      }
    }
    return next();
  }

  return { onKeyDown: onKeyDown };
}