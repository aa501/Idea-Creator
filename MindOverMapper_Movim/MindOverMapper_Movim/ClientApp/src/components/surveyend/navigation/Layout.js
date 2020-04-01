import React, { Component } from 'react';
import { NavMenuS } from './NavMenu';

import './Layout.css';

export class LayoutS extends Component {
  static displayName = LayoutS.name;
    constructor(props) {
        super(props);
    }
    render() {
    return (
      <div>
        <NavMenuS/>
        <div id='page-holder'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
