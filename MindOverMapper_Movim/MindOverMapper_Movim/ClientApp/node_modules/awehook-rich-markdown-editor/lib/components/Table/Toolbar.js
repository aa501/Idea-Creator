"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _slate = require("slate");

var _reactPortal = require("react-portal");

var _reactDom = require("react-dom");

var _TableToolbar = require("../Toolbar/TableToolbar");

var _TableToolbar2 = _interopRequireDefault(_TableToolbar);

var _Toolbar = require("../Toolbar");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// These widths should be updated whenever the toolbar styles change
var MENU_WIDTHS = {
  row: 148,
  column: 248,
  table: 68
};

var MENU_ALIGN = {
  row: "left",
  column: "center",
  table: "left"
};

var Toolbar = function (_React$Component) {
  _inherits(Toolbar, _React$Component);

  function Toolbar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Toolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      top: 0,
      left: 0
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Toolbar, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      if (!this.props.cell) return;

      var element = (0, _reactDom.findDOMNode)(this.props.cell);
      if (!(element instanceof HTMLElement)) return;

      var rect = element.getBoundingClientRect();
      var menuWidth = MENU_WIDTHS[this.props.type];
      var menuHeight = 40;

      // Position the menu correctly depending on the type, cell and scroll position
      var left = MENU_ALIGN[this.props.type] === "center" ? Math.round(rect.left + window.scrollX + rect.width / 2 - menuWidth / 2) : Math.round(rect.left + window.scrollX - menuWidth / 2);
      var top = Math.round(rect.top + window.scrollY - menuHeight - 12);

      this.setState(function (state) {
        if (state.left !== left || state.top !== top) {
          return { left: left, top: top };
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          editor = _props.editor,
          type = _props.type,
          active = _props.active;

      if (!this.state.top && !this.state.left) return null;

      return React.createElement(
        _reactPortal.Portal,
        null,
        React.createElement(
          _Toolbar.Menu,
          { active: active, style: this.state },
          React.createElement(_TableToolbar2.default, {
            editor: editor,
            isTableSelected: type === "table",
            isRowSelected: type === "row",
            isColumnSelected: type === "column"
          })
        )
      );
    }
  }]);

  return Toolbar;
}(React.Component);

exports.default = Toolbar;