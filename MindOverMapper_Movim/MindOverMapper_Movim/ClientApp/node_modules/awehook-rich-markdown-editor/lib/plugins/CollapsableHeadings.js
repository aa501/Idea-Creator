"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = CollapsableHeadings;

var _slate = require("slate");

var _headingToSlug = require("../lib/headingToSlug");

var _headingToSlug2 = _interopRequireDefault(_headingToSlug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CollapsableHeadings() {
  var queries = {
    getPathForHeadingNode: function getPathForHeadingNode(editor, node) {
      var slugish = (0, _headingToSlug2.default)(editor.value.document, node);
      return (editor.props.id || window.location.pathname) + "#" + slugish;
    }
  };

  var commands = {
    showContentBelow: function showContentBelow(editor, node) {
      return editor.updateContentBelow(node, false);
    },
    hideContentBelow: function hideContentBelow(editor, node) {
      return editor.updateContentBelow(node, true);
    },
    toggleContentBelow: function toggleContentBelow(editor, node) {
      var collapsed = node.data.get("collapsed");
      var persistKey = editor.getPathForHeadingNode(node);

      if (collapsed) {
        localStorage.removeItem(persistKey);
        return editor.showContentBelow(node);
      } else {
        localStorage.setItem(persistKey, "collapsed");
        return editor.hideContentBelow(node);
      }
    },
    updateContentBelow: function updateContentBelow(editor, node, hidden) {
      var document = editor.value.document;


      editor.setNodeByKey(node.key, { data: { collapsed: hidden } });

      var headingLevel = parseInt(node.type.replace(/^heading/, ""), 10);
      var headingLevels = [];

      for (var level = headingLevel; level > 0; level--) {
        headingLevels.push("heading" + level);
      }

      var active = void 0;
      document.nodes.forEach(function (n) {
        if (active && headingLevels.includes(n.type)) {
          active = false;
          return;
        }
        if (active) {
          editor.setNodeByKey(n.key, { data: _extends({}, n.data.toJS(), { hidden: hidden }) });
        }
        if (n === node) active = true;
      });
    }
  };

  function onKeyDown(ev, editor, next) {
    var startBlock = editor.value.startBlock;

    if (!startBlock || !startBlock.type || !startBlock.type.match(/heading/) || !startBlock.data.get("collapsed")) return next();

    // editing a heading will always uncollapse the contents beneath as the persist
    // key is based on the slug which is based on the heading contents
    editor.toggleContentBelow(startBlock);
    return next();
  }

  function normalizeNode(node, editor, next) {
    if (node.object !== "block") return next();

    if (node.type.match(/heading/)) {
      var collapsed = node.data.get("collapsed");
      var persistKey = editor.getPathForHeadingNode(node);
      var persistedState = localStorage.getItem(persistKey);
      var shouldBeCollapsed = persistedState === "collapsed";

      // ensures that on load content under collapsed headings is correctly hidden
      if (shouldBeCollapsed && !collapsed) {
        return function (editor) {
          return editor.updateContentBelow(node, shouldBeCollapsed).setNodeByKey(node.key, {
            data: { collapsed: shouldBeCollapsed }
          });
        };
      }
    }

    return next();
  }

  return { queries: queries, commands: commands, normalizeNode: normalizeNode, onKeyDown: onKeyDown };
}