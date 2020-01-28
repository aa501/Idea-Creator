import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

import './Layout.css';

export class Layout extends Component {
  static displayName = Layout.name;
    constructor(props) {
        super(props);
    }
    render() {
    return (
      <div>
        <NavMenu userData={this.props.props}/>
        <div id='page-holder'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
