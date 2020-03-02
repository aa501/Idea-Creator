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

var TableToolbar = function (_React$Component) {
  _inherits(TableToolbar, _React$Component);

  function TableToolbar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TableToolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TableToolbar.__proto__ || Object.getPrototypeOf(TableToolbar)).call.apply(_ref, [this].concat(args))), _this), _this.hasAlign = function (align) {
      try {
        var _editor = _this.props.editor;
        var _editor$value = _editor.value,
            startBlock = _editor$value.startBlock,
            document = _editor$value.document;

        var position = _editor.getPositionByKey(document, startBlock.key);

        return position.cell.data.get("align") === align || startBlock.data.get("align") === align;
      } catch (_err) {
        return false;
      }
    }, _this.onClickAlign = function (ev, align) {
      ev.preventDefault();
      ev.stopPropagation();

      var editor = _this.props.editor;
      var _editor$value2 = editor.value,
          startBlock = _editor$value2.startBlock,
          document = _editor$value2.document;

      var position = editor.getPositionByKey(document, startBlock.key);
      editor.moveSelection(position.getColumnIndex(), position.getRowIndex());
      editor.setColumnAlign(align);
    }, _this.renderAlignButton = function (align, IconClass) {
      var isActive = _this.hasAlign(align);
      var Tooltip = _this.props.editor.props.tooltip;
      var onMouseDown = function onMouseDown(ev) {
        return _this.onClickAlign(ev, align);
      };

      return React.createElement(
        _ToolbarButton2.default,
        { onMouseDown: onMouseDown, active: isActive },
        React.createElement(
          Tooltip,
          { tooltip: "Align " + align, placement: "top" },
          React.createElement(IconClass, { color: _this.props.theme.toolbarItem })
        )
      );
    }, _this.removeTable = function (ev) {
      ev.preventDefault();
      _this.props.editor.removeTable().blur();
    }, _this.addRowBelow = function (ev) {
      ev.preventDefault();

      var editor = _this.props.editor;
      var _editor$value3 = editor.value,
          startBlock = _editor$value3.startBlock,
          document = _editor$value3.document;

      var position = editor.getPositionByKey(document, startBlock.key);
      editor.clearSelected(position.table).insertRow(position.getRowIndex() + 1).resetAlign(position.table, position.getRowIndex() + 1).blur();
    }, _this.addRowAbove = function (ev) {
      ev.preventDefault();

      var editor = _this.props.editor;
      var _editor$value4 = editor.value,
          startBlock = _editor$value4.startBlock,
          document = _editor$value4.document;

      var position = editor.getPositionByKey(document, startBlock.key);
      editor.clearSelected(position.table).insertRow(position.getRowIndex()).resetAlign(position.table, position.getRowIndex()).blur();
    }, _this.removeRow = function (ev) {
      ev.preventDefault();
      _this.props.editor.removeRow().blur();
    }, _this.addColumnRight = function (ev) {
      ev.preventDefault();
      var editor = _this.props.editor;
      var _editor$value5 = editor.value,
          startBlock = _editor$value5.startBlock,
          document = _editor$value5.document;

      var position = editor.getPositionByKey(document, startBlock.key);

      _this.props.editor.clearSelected(position.table).insertColumn();
    }, _this.addColumnLeft = function (ev) {
      ev.preventDefault();
      var editor = _this.props.editor;
      var _editor$value6 = editor.value,
          startBlock = _editor$value6.startBlock,
          document = _editor$value6.document;

      var position = editor.getPositionByKey(document, startBlock.key);

      editor.insertColumn(position.getColumnIndex()).clearSelected(position.table).moveSelectionBy(-1, 0);
    }, _this.removeColumn = function (ev) {
      ev.preventDefault();
      _this.props.editor.removeColumn().blur();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TableToolbar, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          isRowSelected = _props.isRowSelected,
          isColumnSelected = _props.isColumnSelected,
          isTableSelected = _props.isTableSelected;

      var Tooltip = this.props.editor.props.tooltip;

      return React.createElement(
        React.Fragment,
        null,
        isTableSelected && React.createElement(
          _ToolbarButton2.default,
          { onMouseDown: this.removeTable },
          React.createElement(
            Tooltip,
            { tooltip: "Delete table", placement: "top" },
            React.createElement(_outlineIcons.TrashIcon, { color: this.props.theme.toolbarItem })
          )
        ),
        isColumnSelected && React.createElement(
          React.Fragment,
          null,
          this.renderAlignButton("left", _outlineIcons.AlignLeftIcon),
          this.renderAlignButton("center", _outlineIcons.AlignCenterIcon),
          this.renderAlignButton("right", _outlineIcons.AlignRightIcon),
          React.createElement(_Separator2.default, null),
          React.createElement(
            _ToolbarButton2.default,
            { onMouseDown: this.removeColumn },
            React.createElement(
              Tooltip,
              { tooltip: "Delete column", placement: "top" },
              React.createElement(_outlineIcons.TrashIcon, { color: this.props.theme.toolbarItem })
            )
          ),
          React.createElement(_Separator2.default, null),
          React.createElement(
            _ToolbarButton2.default,
            { onMouseDown: this.addColumnLeft },
            React.createElement(
              Tooltip,
              { tooltip: "Insert column left", placement: "top" },
              React.createElement(_outlineIcons.InsertLeftIcon, { color: this.props.theme.toolbarItem })
            )
          ),
          React.createElement(
            _ToolbarButton2.default,
            { onMouseDown: this.addColumnRight },
            React.createElement(
              Tooltip,
              { tooltip: "Insert column right", placement: "top" },
              React.createElement(_outlineIcons.InsertRightIcon, { color: this.props.theme.toolbarItem })
            )
          )
        ),
        isRowSelected && React.createElement(
          React.Fragment,
          null,
          React.createElement(
            _ToolbarButton2.default,
            { onMouseDown: this.removeRow },
            React.createElement(
              Tooltip,
              { tooltip: "Delete row", placement: "top" },
              React.createElement(_outlineIcons.TrashIcon, { color: this.props.theme.toolbarItem })
            )
          ),
          React.createElement(_Separator2.default, null),
          React.createElement(
            _ToolbarButton2.default,
            { onMouseDown: this.addRowAbove },
            React.createElement(
              Tooltip,
              { tooltip: "Insert row above", placement: "top" },
              React.createElement(_outlineIcons.InsertAboveIcon, { color: this.props.theme.toolbarItem })
            )
          ),
          React.createElement(
            _ToolbarButton2.default,
            { onMouseDown: this.addRowBelow },
            React.createElement(
              Tooltip,
              { tooltip: "Insert row below", placement: "top" },
              React.createElement(_outlineIcons.InsertBelowIcon, { color: this.props.theme.toolbarItem })
            )
          )
        )
      );
    }
  }]);

  return TableToolbar;
}(React.Component);

exports.default = (0, _styledComponents.withTheme)(TableToolbar);