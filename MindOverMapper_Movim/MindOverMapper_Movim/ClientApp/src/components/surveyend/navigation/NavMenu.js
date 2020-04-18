import React, { Component } from 'react';
import { Collapse, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../../../static/new-logo-crop-wide.jpg';

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

      <Navbar className="navbar-expand-sm navbar-toggleable-sm box-shadow mb-3" dark expand="xl" >
          <div id='naviboi'>

              <NavbarBrand style={{marginLeft: "-15px"}} id='nav-text-accru' tag={Link} to={{ pathname: '/home', state: {userData: this.props.userData} }}>
                  <span id='title-image'>
                      <img src={logo} width="90" height="58" />
              </span>

          </NavbarBrand>

          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
        </div>
      </Navbar>

    );
  }
}
