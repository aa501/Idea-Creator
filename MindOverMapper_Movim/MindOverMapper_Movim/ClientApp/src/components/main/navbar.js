import React from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export function NavBar() {
    var navList = [
      {eventKey: 'project', icon: 'plus', label: 'Add Project', onClick:''},
    ]

    return (
        <div>
          <SideNav expanded="true" style={{
              backgroundColor: "#EBF2F2", marginTop: 60, borderRight: "solid", borderRightColor: "#028DCB"
          }}
              onSelect={(selected) => {
                  // Add your code here
              }}>

              <SideNav.Nav defaultSelected="">
              <div align="center">
              {
                    navList.map(obj => (
                    <div class="d-flex justify-content-around flex-row">
                      <NavItem style={{ marginTop: 40 }} role="menuitem" eventKey={obj.eventKey}>
                          <NavIcon>
                              <FontAwesomeIcon icon={obj.icon} id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, fontSize: 16 }}>
                              <div align="center"> {obj.label} </div>
                          </NavText>
                      </NavItem>
                    </div>
                    ))
              }
              </div>
              </SideNav.Nav>
          </SideNav>
      </div>
)}
