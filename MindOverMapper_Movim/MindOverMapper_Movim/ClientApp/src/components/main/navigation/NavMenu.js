import React, { Component } from 'react';
import { Collapse, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../../../static/new-logo-crop-wide.jpg';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  componentDidMount = () => {
      if(this.props.userData === undefined){
        this.props.history.push({
            pathname: '/'
        });
    } else {
        this.setState({
            userData: this.props.userData
        });
    }
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
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                    <UncontrolledDropdown nav inNavbar >
                      <DropdownToggle nav caret className="text-light">
                          Hello, {this.props.userData.firstName}! <FontAwesomeIcon icon="user-circle" />
                      </DropdownToggle>
                          <DropdownMenu right>
                                <DropdownItem>
                                    <NavLink className="text-dark" tag ={Link} to="/" >Logout <FontAwesomeIcon icon="sign-out-alt"/></NavLink>
                                    </DropdownItem>
                                    {this.props.userData.type === 'admin' ? (
                                      <DropdownItem>
                                        <NavLink className="text-dark" tag={Link} to={{pathname: '/admin-panel', state: { userData: this.props.userData }}} >Admin Panel <FontAwesomeIcon icon="user-lock" /></NavLink>
                                      </DropdownItem>
                                    ) : (null)}
                          </DropdownMenu>
                    </UncontrolledDropdown>
                </NavItem>
              </ul>
            </Collapse>
          </div>
        </Navbar>

    );
  }
}
