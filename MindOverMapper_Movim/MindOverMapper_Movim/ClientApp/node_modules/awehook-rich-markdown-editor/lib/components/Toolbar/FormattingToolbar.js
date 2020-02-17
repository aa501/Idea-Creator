"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _styledComponents = require("styled-components");

var _slateReact = require("slate-react");

var _outlineIcons = require("outline-icons");

var _ToolbarButton = require("./ToolbarButton");

var _ToolbarButton2 = _interopRequireDefault(_ToolbarButton);

var _Separator = require("./Separator");

var _Separator2 = _interopRequireDefault(_Separator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormattingToolbar = function (_React$Component) {
  _inherits(FormattingToolbar, _React$Component);

  function FormattingToolbar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FormattingToolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FormattingToolbar.__proto__ || Object.getPrototypeOf(FormattingToolbar)).call.apply(_ref, [this].concat(args))), _this), _this.hasMark = function (type) {
      try {
        return _this.props.editor.value.marks.some(function (mark) {
          return mark.type === type;
        });
      } catch (_err) {
        return false;
      }
    }, _this.isBlock = function (type) {
      var _this$props$editor$va = _this.props.editor.value,
          startBlock = _this$props$editor$va.startBlock,
          document = _this$props$editor$va.document;

      // accounts for blocks with an inner paragraph tag

      var parent = startBlock && document.getParent(startBlock.key);

      return startBlock && startBlock.type === type || parent && parent.type === type;
    }, _this.onClickMark = function (ev, type) {
      ev.preventDefault();
      ev.stopPropagation();

      var editor = _this.props.editor;

      editor.toggleMark(type);

      // ensure we remove any other marks on inline code
      // we don't allow bold / italic / strikethrough code.
      var isInlineCode = _this.hasMark("code") || type === "code";
      if (isInlineCode) {
        editor.value.marks.forEach(function (mark) {
          if (mark.type !== "code") editor.removeMark(mark);
        });
      }
    }, _this.onClickBlock = function (ev, type) {
      ev.preventDefault();
      ev.stopPropagation();
      var editor = _this.props.editor;
      var _editor$value = editor.value,
          startBlock = _editor$value.startBlock,
          document = _editor$value.document;

      var parent = document.getParent(startBlock.key);

      editor.setNodeByKey(startBlock.key, type);

      // accounts for blocks with an inner paragraph tag
      if (parent && parent.type && type === "paragraph") {
        editor.setNodeByKey(parent.key, type);
      }
    }, _this.handleCreateLink = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();

      var selection = window.getSelection().toString();
      selection = selection.trim();

      if (selection.length) {
        var data = { href: "" };
        _this.props.editor.wrapInline({ type: "link", data: data });
        _this.props.onCreateLink(ev);
      }
    }, _this.renderMarkButton = function (type, IconClass, tooltip) {
      var hiddenToolbarButtons = _this.props.theme.hiddenToolbarButtons;

      var Tooltip = _this.props.editor.props.tooltip;

      if (hiddenToolbarButtons && hiddenToolbarButtons.marks && hiddenToolbarButtons.marks.includes(type)) {
        return null;
      }

      var isActive = _this.hasMark(type);
      var onMouseDown = function onMouseDown(ev) {
        return _this.onClickMark(ev, type);
      };

      return React.createElement(
        _ToolbarButton2.default,
        { onMouseDown: onMouseDown, active: isActive },
        React.createElement(
          Tooltip,
          { tooltip: tooltip, placement: "top" },
          React.createElement(IconClass, { color: _this.props.theme.toolbarItem })
        )
      );
    }, _this.renderBlockButton = function (type, IconClass, tooltip) {
      var hiddenToolbarButtons = _this.props.theme.hiddenToolbarButtons;

      var Tooltip = _this.props.editor.props.tooltip;

      if (hiddenToolbarButtons && hiddenToolbarButtons.blocks && hiddenToolbarButtons.blocks.includes(type)) return null;

      var isActive = _this.isBlock(type);

      var onMouseDown = function onMouseDown(ev) {
        return _this.onClickBlock(ev, isActive ? "paragraph" : type);
      };

      return React.createElement(
        _ToolbarButton2.default,
        { onMouseDown: onMouseDown, active: isActive },
        React.createElement(
          Tooltip,
          { tooltip: tooltip, placement: "top" },
          React.createElement(IconClass, { color: _this.props.theme.toolbarItem })
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */


  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} ev
   * @param {String} type
   */


  _createClass(FormattingToolbar, [{
    key: "render",
    value: function render() {
      var isSelectionInTable = this.props.editor.isSelectionInTable();
      var Tooltip = this.props.editor.props.tooltip;

      return React.createElement(
        React.Fragment,
        null,
        this.renderMarkButton("bold", _outlineIcons.BoldIcon, "Bold"),
        this.renderMarkButton("italic", _outlineIcons.ItalicIcon, "Italic"),
        this.renderMarkButton("deleted", _outlineIcons.StrikethroughIcon, "Strikethrough"),
        this.renderMarkButton("code", _outlineIcons.CodeIcon, "Code"),
        !isSelectionInTable && React.createElement(
          React.Fragment,
          null,
          React.createElement(_Separator2.default, null),
          this.renderBlockButton("heading2", _outlineIcons.Heading1Icon, "Heading"),
          this.renderBlockButton("heading3", _outlineIcons.Heading2Icon, "Subheading"),
          this.renderBlockButton("block-quote", _outlineIcons.BlockQuoteIcon, "Quote")
        ),
        React.createElement(_Separator2.default, null),
        React.createElement(
          _ToolbarButton2.default,
          { onMouseDown: this.handleCreateLink },
          React.createElement(
            Tooltip,
            { tooltip: "Create link", placement: "top" },
            React.createElement(_outlineIcons.LinkIcon, { color: this.props.theme.toolbarItem })
          )
        )
      );
    }
  }]);

  return FormattingToolbar;
}(React.Component);

exports.default = (0, _styledComponents.withTheme)(FormattingToolbar);