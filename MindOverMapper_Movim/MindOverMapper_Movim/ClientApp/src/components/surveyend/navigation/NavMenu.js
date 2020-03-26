import React, { Component } from 'react';
import { Collapse, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../../../static/Logo.png';

export class NavMenuS extends Component {
  static displayName = NavMenuS.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  componentDidMount = () => {
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

    render() {
    return (

        <Navbar className="navbar-expand-sm navbar-toggleable-sm box-shadow mb-3" dark expand="xl">
          <div id='naviboi'>
            <NavbarBrand id='nav-text-accru' tag={Link} to={{ pathname: '/survey-view', state: {}}}>
                <span id ='title-image'>
                    <img src={logo} width = "50"/>
                </span>
                <span id='name-span'>
                <h id='app-name'>Idea Creator</h>
                </span>
            </NavbarBrand>

            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
              </ul>
            </Collapse>
          </div>
        </Navbar>

    );
  }
}
