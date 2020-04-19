import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Container, Row, Col, FormGroup, InputGroup, Form, Button, Card, Alert } from 'react-bootstrap';
import { Input } from 'reactstrap';
import { Chip, List, ListSubheader, ListItem, ListItemText, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Checkbox, RadioGroup, FormControlLabel, Radio, TextareaAutosize, CircularProgress } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import axios from 'axios';
import Slide from '@material-ui/core/Slide';
import './SurveyAnalytics.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class SurveyAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.location.state.userData || this.props.userData,
        projectName: this.props.location.state.projectName,
        analyzedSurvey: this.props.location.state.analyzedSurvey
    }
  }

    navHome = () => {
        this.props.history.push({
            pathname: '/home',
            state: this.state  // need this for moving to different component
        });
    }

    navLogout = () => {
        this.props.history.push({
            pathname: '/',
            state: this.state  // need this for moving to different component
        });
    }

    navBack = () => {
    this.props.history.push({
        pathname: '/surveys',
        state: this.state  // need this for moving to different component
         });
    }

    getSurveyResponses = () => {
      
    }



  render() {
      return (

          <div id="analytics-container">

              <SideNav expanded="true" style={{
                  backgroundColor: "#EBF2F2", marginTop: 60, borderRight: "solid", borderRightColor: "#028DCB"
              }}
                  onSelect={(selected) => {
                      // Add your code here
                  }}
              >
                  <SideNav.Nav defaultSelected="">

                      <NavItem style={{ marginTop: 40 }} role="menuitem" eventKey="home" onClick={() => this.navHome()}>
                          <NavIcon>
                              <FontAwesomeIcon icon="home" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>
                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 20, fontSize: 16 }}>
                              Home
                            </NavText>
                      </NavItem>
                      <NavItem role="menuitem" eventKey="add-question" onClick={() => this.navBack()}>
                          <NavIcon>
                              <FontAwesomeIcon icon="arrow-left" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Back to Surveys
                        </NavText>
                      </NavItem>
                      <NavItem role="menuitem" eventKey="logout" onClick={() => this.navLogout()}>
                          <NavIcon>
                              <FontAwesomeIcon icon="sign-out-alt" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Logout
                            </NavText>
                      </NavItem>
                  </SideNav.Nav>
              </SideNav>


              <div id="analytics-main-content">

                  <h3 id="survey-name" >"Survey-Name"</h3>
                  <hr id="hr-1" />
                  <div id="surveyID">
                          <h6>Unique ID: 123456</h6>
                  </div>
                  <div id="status" style={{marginTop: "25px", marginBottom: "35px"}}>
                          <h4 id="status-text">Status: <h4 style={{ color: "green" }}><strong>Complete</strong></h4></h4>
                  </div>

                  <div id="results">
                      <h3 id="results-header" >Survey Results</h3>
                      <hr id="hr-2" />
                  </div>

              </div>






         </div>)
    }

}
