"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _slate = require("slate");

var _slateTrailingBlock = require("@wikifactory/slate-trailing-block");

var _slateTrailingBlock2 = _interopRequireDefault(_slateTrailingBlock);

var _slateEditCode = require("@wikifactory/slate-edit-code");

var _slateEditCode2 = _interopRequireDefault(_slateEditCode);

var _slateEditBlockquote = require("@wikifactory/slate-edit-blockquote");

var _slateEditBlockquote2 = _interopRequireDefault(_slateEditBlockquote);

var _slateEditTable = require("@domoinc/slate-edit-table");

var _slateEditTable2 = _interopRequireDefault(_slateEditTable);

var _slateDropOrPasteImages = require("slate-drop-or-paste-images");

var _slateDropOrPasteImages2 = _interopRequireDefault(_slateDropOrPasteImages);

var _slatePasteLinkify = require("slate-paste-linkify");

var _slatePasteLinkify2 = _interopRequireDefault(_slatePasteLinkify);

var _slateCollapseOnEscape = require("slate-collapse-on-escape");

var _slateCollapseOnEscape2 = _interopRequireDefault(_slateCollapseOnEscape);

var _golerySlatePrism = require("golery-slate-prism");

var _golerySlatePrism2 = _interopRequireDefault(_golerySlatePrism);

var _Placeholder = require("./plugins/Placeholder");

var _Placeholder2 = _interopRequireDefault(_Placeholder);

var _EditList = require("./plugins/EditList");

var _EditList2 = _interopRequireDefault(_EditList);

var _CollapsableHeadings = require("./plugins/CollapsableHeadings");

var _CollapsableHeadings2 = _interopRequireDefault(_CollapsableHeadings);

var _KeyboardBehavior = require("./plugins/KeyboardBehavior");

var _KeyboardBehavior2 = _interopRequireDefault(_KeyboardBehavior);

var _KeyboardShortcuts = require("./plugins/KeyboardShortcuts");

var _KeyboardShortcuts2 = _interopRequireDefault(_KeyboardShortcuts);

var _MarkdownShortcuts = require("./plugins/MarkdownShortcuts");

var _MarkdownShortcuts2 = _interopRequireDefault(_MarkdownShortcuts);

var _MarkdownPaste = require("./plugins/MarkdownPaste");

var _MarkdownPaste2 = _interopRequireDefault(_MarkdownPaste);

var _Ellipsis = require("./plugins/Ellipsis");

var _Ellipsis2 = _interopRequireDefault(_Ellipsis);

var _Embeds = require("./plugins/Embeds");

var _Embeds2 = _interopRequireDefault(_Embeds);

var _Chrome = require("./plugins/Chrome");

var _Chrome2 = _interopRequireDefault(_Chrome);

var _Table = require("./plugins/Table");

var _Table2 = _interopRequireDefault(_Table);

var _nodes = require("./nodes.js");

var _nodes2 = _interopRequireDefault(_nodes);

var _marks = require("./marks.js");

var _marks2 = _interopRequireDefault(_marks);

require("prismjs/components/prism-ruby");

require("prismjs/components/prism-typescript");

require("prismjs/components/prism-csharp");

require("prismjs/components/prism-powershell");

require("prismjs/components/prism-php");

require("prismjs/components/prism-python");

require("prismjs/components/prism-java");

require("prismjs/components/prism-bash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// additional language support based on the most popular programming languages
var createPlugins = function createPlugins(_ref) {
  var placeholder = _ref.placeholder,
      getLinkComponent = _ref.getLinkComponent;

  return [_nodes2.default, _marks2.default, (0, _slatePasteLinkify2.default)({
    type: "link",
    collapseTo: "end"
  }), (0, _Placeholder2.default)({
    placeholder: placeholder,
    when: function when(editor, node) {
      if (editor.readOnly) return false;
      if (node.object !== "block") return false;
      if (node.type !== "paragraph") return false;
      if (node.text !== "") return false;
      if (editor.value.document.getBlocks().size > 1) return false;
      return true;
    }
  }), (0, _slateDropOrPasteImages2.default)({
    extensions: ["png", "jpg", "jpeg", "gif", "webp"],
    insertImage: function insertImage(editor, file) {
      return editor.insertImageFile(file);
    }
  }), (0, _slateEditCode2.default)({
    containerType: "code",
    lineType: "code-line",
    exitBlocktype: "paragraph",
    allowMarks: false,
    selectAll: true
  }), (0, _slateEditBlockquote2.default)({
    type: "block-quote",
    typeDefault: "paragraph"
  }), (0, _slateEditTable2.default)({
    typeTable: "table",
    typeRow: "table-row",
    typeCell: "table-cell",
    typeContent: "paragraph"
  }), (0, _Table2.default)(), (0, _golerySlatePrism2.default)({
    onlyIn: function onlyIn(node) {
      return node.type === "code";
    },
    getSyntax: function getSyntax(node) {
      return node.data.get("language") || "javascript";
    }
  }), (0, _Embeds2.default)({ getComponent: getLinkComponent }), (0, _slateCollapseOnEscape2.default)({ toEdge: "end" }), (0, _CollapsableHeadings2.default)(), _EditList2.default, (0, _KeyboardBehavior2.default)(), (0, _KeyboardShortcuts2.default)(), (0, _MarkdownShortcuts2.default)(), (0, _MarkdownPaste2.default)(), (0, _Ellipsis2.default)(), (0, _slateTrailingBlock2.default)({ type: "paragraph" }), (0, _Chrome2.default)()];
};
exports.default = createPlugins;