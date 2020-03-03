"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MarkdownShortcuts;

var _slate = require("slate");

var inlineShortcuts = [{ mark: "bold", shortcut: "**" }, { mark: "bold", shortcut: "__" }, { mark: "italic", shortcut: "*" }, { mark: "italic", shortcut: "_" }, { mark: "code", shortcut: "`" }, { mark: "inserted", shortcut: "++" }, { mark: "deleted", shortcut: "~~" }];
function MarkdownShortcuts() {
  function onKeyDown(ev, editor, next) {
    var value = editor.value;
    var startBlock = value.startBlock;

    if (!startBlock) return next();

    // markdown shortcuts should not be parsed in code
    if (startBlock.type.match(/code/)) return next();

    switch (ev.key) {
      case "-":
        return onDash(ev, editor, next);
      case "`":
        return onBacktick(ev, editor, next);
      case " ":
        return onSpace(ev, editor, next);
      default:
        return next();
    }
  }

  /**
   * On space, if it was after an auto-markdown shortcut, convert the current
   * node into the shortcut's corresponding type.
   */
  function onSpace(ev, editor, next) {
    var value = editor.value;
    var selection = value.selection,
        startBlock = value.startBlock;

    if (selection.isExpanded) return next();

    var chars = startBlock.text.slice(0, selection.start.offset).trim();
    var type = getType(chars);

    if (type && !editor.isSelectionInTable()) {
      // only shortcuts to change heading size should work in headings
      if (startBlock.type.match(/heading/) && !type.match(/heading/)) {
        return next();
      }

      // don't allow doubling up a list item
      if (type === "list-item" && startBlock.type === "list-item") {
        return next();
      }
      ev.preventDefault();

      var checked = void 0;
      if (chars === "[x]") checked = true;
      if (chars === "[ ]") checked = false;

      editor.withoutNormalizing(function (c) {
        c.moveFocusToStartOfNode(startBlock).delete().setBlocks({
          type: type,
          data: { checked: checked }
        });

        if (type === "list-item") {
          if (checked !== undefined) {
            return c.wrapBlock("todo-list");
          } else if (chars === "1.") {
            return c.wrapBlock("ordered-list");
          } else {
            return c.wrapBlock("bulleted-list");
          }
        }

        return next();
      });
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = inlineShortcuts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        // find all inline characters
        var mark = key.mark,
            shortcut = key.shortcut;

        var inlineTags = [];

        // only add tags if they have spaces around them or the tag is beginning
        // or the end of the block
        for (var i = 0; i < startBlock.text.length; i++) {
          var text = startBlock.text;

          var start = i;
          var end = i + shortcut.length;
          var beginningOfBlock = start === 0;
          var endOfBlock = end === text.length;
          var surroundedByWhitespaces = [text.slice(start - 1, start), text.slice(end, end + 1)].includes(" ");

          if (text.slice(start, end) === shortcut && (beginningOfBlock || endOfBlock || surroundedByWhitespaces)) {
            inlineTags.push(i);
          }
        }

        // if we have multiple tags then mark the text between
        if (inlineTags.length > 1) {
          var firstText = startBlock.getFirstText();
          var firstCodeTagIndex = inlineTags[0];
          var lastCodeTagIndex = inlineTags[inlineTags.length - 1];
          return editor.removeTextByKey(firstText.key, lastCodeTagIndex, shortcut.length).removeTextByKey(firstText.key, firstCodeTagIndex, shortcut.length).moveAnchorTo(firstCodeTagIndex, lastCodeTagIndex - shortcut.length).addMark(mark).moveToEnd().removeMark(mark);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return next();
  }

  function onDash(ev, editor, next) {
    var value = editor.value;
    var startBlock = value.startBlock,
        selection = value.selection;

    if (selection.isExpanded) return next();

    if (startBlock.type.match(/heading/)) return next();
    if (editor.isSelectionInTable()) return next();

    var chars = startBlock.text.slice(0, selection.start.offset).replace(/\s*/g, "");

    if (chars === "--") {
      ev.preventDefault();
      return editor.moveFocusToStartOfNode(startBlock).delete().setBlocks({
        type: "horizontal-rule",
        isVoid: true
      }, { normalize: false }).insertBlock("paragraph").moveToStart();
    }

    return next();
  }

  function onBacktick(ev, editor, next) {
    var value = editor.value;
    var startBlock = value.startBlock,
        selection = value.selection;

    if (selection.isExpanded) return next();
    if (startBlock.type.match(/heading/)) return next();

    var chars = startBlock.text.slice(0, selection.start.offset).replace(/\s*/g, "");

    if (chars === "``") {
      ev.preventDefault();
      return editor.moveFocusToStartOfNode(startBlock).delete().setBlocks({ type: "code" });
    }

    return next();
  }

  /**
   * Get the block type for a series of auto-markdown shortcut `chars`.
   */
  function getType(chars) {
    switch (chars) {
      case "*":
      case "-":
      case "+":
      case "1.":
      case "[ ]":
      case "[x]":
        return "list-item";
      case ">":
        return "block-quote";
      case "#":
        return "heading1";
      case "##":
        return "heading2";
      case "###":
        return "heading3";
      case "####":
        return "heading4";
      case "#####":
        return "heading5";
      case "######":
        return "heading6";
      default:
        return null;
    }
  }

  return { onKeyDown: onKeyDown };
}