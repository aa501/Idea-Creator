import React from "react";
import cx from "classnames";
import { Popover, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import "./Toolbar.css";
import { DiagramLayoutType } from "@blink-mind/core";
import { iconClassName, Icon } from "@blink-mind/renderer-react";
import defaultThemeImg from "../../../../../../static/default.jpg";
import theme1Img from "../../../../../../static/theme1.jpg";
import theme2Img from "../../../../../../static/theme2.jpg";
import theme3Img from "../../../../../../static/theme3.jpg";
import theme4Img from "../../../../../../static/theme4.jpg";
// import debug from "debug";
// const log = debug("app");

export class Toolbar extends React.PureComponent {
  renderExportItem() {
    const { onClickExportJson } = this.props;
    return (
      <div className={cx("bm-toolbar-item", iconClassName("export"))}>
        <Popover enforceFocus={false}>
          <div className="bm-toolbar-popover-target" />
          <Menu>
            <MenuItem text="JSON(.json)" onClick={onClickExportJson} />
            <MenuDivider />
          </Menu>
        </Popover>
      </div>
    );
  }

  renderThemeItem() {
    const { onClickChangeTheme } = this.props;
    const themes = [
      ["default", defaultThemeImg],
      ["theme1", theme1Img],
      ["theme2", theme2Img],
      ["theme3", theme3Img],
      ["theme4", theme4Img]
    ];

    return (
      <div className={cx("bm-toolbar-item", iconClassName("theme"))}>
        <Popover enforceFocus={false}>
          <div className="bm-toolbar-popover-target" />
          <div className='bm-popover-theme'>
            {themes.map(theme => (
              <div
                className="bm-theme-item"
                onClick={onClickChangeTheme(theme[0])}
              >
                <img className="bm-theme-img" src={theme[1]} alt={theme[0]} />
              </div>
            ))}
          </div>
        </Popover>
      </div>
    );
  }

  renderLayoutItem() {
    const { onClickSetLayout } = this.props;
    const layoutDirs = [
      [
        DiagramLayoutType.LEFT_AND_RIGHT,
        "Left And Right",
        "layout-left-and-right"
      ],
      [DiagramLayoutType.LEFT_TO_RIGHT, "Only Right", "layout-right"],
      [DiagramLayoutType.RIGHT_TO_LEFT, "Only Left", "layout-left"]
    ];

    return (
      <div
        className={cx(
          "bm-toolbar-item",
          iconClassName("layout-left-and-right")
        )}
      >
        <Popover enforceFocus={false}>
          <div className="bm-toolbar-popover-target" />
          <Menu>
            {layoutDirs.map(dir => (
              <MenuItem
                key={dir[1]}
                icon={Icon(dir[2])}
                text={dir[1]}
                onClick={onClickSetLayout(dir[0])}
              />
            ))}
          </Menu>
        </Popover>
      </div>
    );
  }

  render() {
    const {
      onClickOpenFile,
      onClickUndo,
      onClickRedo,
      canUndo,
      canRedo
    } = this.props;

    return (
      <div className="bm-toolbar">
        <div
          className={`bm-toolbar-item ${iconClassName("openfile")}`}
          onClick={onClickOpenFile}
        />

        {this.renderExportItem()}
        {this.renderThemeItem()}
        {this.renderLayoutItem()}

        <div
          className={cx("bm-toolbar-item", iconClassName("undo"), {
            "bm-toolbar-item-disabled": !canUndo
          })}
          onClick={onClickUndo}
        />

        <div
          className={cx("bm-toolbar-item", iconClassName("redo"), {
            "bm-toolbar-item-disabled": !canRedo
          })}
          onClick={onClickRedo}
        />
      </div>
    );
  }
}

/*import React from "react";
import { ToolbarItem } from "./ToolbarItem";
import "./Toolbar.css";
import { OpType } from "blink-mind-react";

import {
  PopupChangeTheme,
  PopupExportContent,
  PopupOpenFileContent
} from "./PopupContent";

import MindMap from './MindMap';

import Popup from "react-popup";

export class Toolbar extends React.Component {
  showPopupExport = diagramState => {
    Popup.create({
      title: "Please select export file format",
      content: <PopupExportContent diagramState={diagramState} />
    });
  };

  showPopupOpenFile = (diagramState, onChange) => {
    Popup.create({
      title: "Open File",
      content: (
        <PopupOpenFileContent diagramState={diagramState} onChange={onChange} />
      )
    });
  };

  showPopupChangeTheme = (diagramState, onChange) => {
    console.log('Change stuff:', diagramState);

    this.props.changeTheme();
    // Popup.create({
    //   title: "Change Theme",
    //   content: (
    //     <PopupChangeTheme diagramState={diagramState} onChange={onChange} />
    //   )
    // });
  };

  saveMindMap = () => {
    this.props.saveMindMap();
  }

  items = [
    {
      icon: "newfile",
      label: "save",
      clickHandler: this.saveMindMap
    },
    {
      icon: "openfile",
      label: "open file",
      clickHandler: this.showPopupOpenFile
    },
    {
      icon: "export",
      label: "export file",
      clickHandler: this.showPopupExport
    },
    {
      icon: "theme",
      label: "change theme",
      clickHandler: this.showPopupChangeTheme
    },
    {
      icon: "undo",
      label: "undo",
      opType: OpType.UNDO
    },
    {
      icon: "redo",
      label: "redo",
      opType: OpType.REDO
    },
    {
      icon: "add-sibling",
      label: "add sibling",
      opType: OpType.ADD_SIBLING
    },
    {
      icon: "add-child",
      label: "add child",
      opType: OpType.ADD_CHILD
    },
    {
      icon: "delete-node",
      label: "delete node",
      opType: OpType.DELETE_NODE
    }
  ];

  render() {
    let { diagramState, onChange, op } = this.props;
    let toolbarItems = this.items.map(item => (
      <ToolbarItem
        config={item}
        key={item.label}
        diagramState={diagramState}
        onChange={onChange}
        op={op}
      />
    ));
    return (
      <div>
        <div className="bm-toolbar">{toolbarItems}</div>
      </div>
    );
  }
}
*/