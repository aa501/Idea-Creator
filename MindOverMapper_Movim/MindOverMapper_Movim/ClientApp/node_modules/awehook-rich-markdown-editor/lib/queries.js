"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slate = require("slate");

var queries = {
  isLinkActive: function isLinkActive(editor) {
    var value = editor.value;
    var inlines = value.inlines;

    return inlines.some(function (i) {
      return i.type === "link";
    });
  },
  getLinkInSelection: function getLinkInSelection(editor) {
    try {
      var value = editor.value;

      var selectedLinks = value.document.getLeafInlinesAtRange(value.selection).filter(function (node) {
        return node.type === "link";
      });

      if (selectedLinks.size) {
        var link = selectedLinks.first();
        var selection = value.selection;


        if (selection.anchor.isInNode(link) || selection.focus.isInNode(link)) {
          return link;
        }
      }
    } catch (err) {
      // It's okay.
      console.error(err);
    }
  }
};
exports.default = queries;