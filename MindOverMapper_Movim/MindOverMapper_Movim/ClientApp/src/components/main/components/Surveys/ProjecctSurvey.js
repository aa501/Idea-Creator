import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { Paper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Popover from '@material-ui/core/Popover';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './ProjectSurvey.css';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));


export default class ProjectSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.location.state.userData || this.props.userData,
        projectName: this.props.location.state.projectName,
        surveys: []
      
    }
  }

    componentDidMount() {
        axios.get('/api/survey/' + this.state.projectName.uid, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
        }
        ).then(response => {
            this.setState({ surveys: response.data });
        });
    }

  returnToDashboard = () => {
    this.props.history.push({
      pathname: '/home',
      state: { userData: this.state.userData } // need this for moving to different component
  });
  }

    newSurvey = () => {
        this.props.history.push({
            pathname: '/new-survey',
            state: this.props.location.state
        })
    }

  render() {
      return (

      <div id='page-container'>

              <SideNav expanded="true" style={{
                  backgroundColor: "#EBF2F2", marginTop: 60, borderRight: "solid", borderRightColor: "#028DCB"
              }}
                  onSelect={(selected) => {
                      // Add your code here
                  }}
              >

                  <SideNav.Nav defaultSelected="">


                      <NavItem style={{ marginTop: 40 }} role="menuitem" eventKey="home">
                          <NavIcon>
                              <FontAwesomeIcon icon="home" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 20, fontSize: 16 }}>
                              Home
                            </NavText>

                      </NavItem>

                      <NavItem role="menuitem" eventKey="project">
                          <NavIcon>
                              <FontAwesomeIcon icon="plus" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>
                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Add Project
                            </NavText>

                      </NavItem>

                      <NavItem role="menuitem" eventKey="settings">
                          <NavIcon>
                              <FontAwesomeIcon icon="cogs" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Settings
                            </NavText>

                      </NavItem>

                      <NavItem role="menuitem" eventKey="info">
                          <NavIcon>
                              <FontAwesomeIcon icon="info-circle" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              About
                            </NavText>

                      </NavItem>

                      <NavItem role="menuitem" eventKey="help">
                          <NavIcon>
                              <FontAwesomeIcon icon="question" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Help
                            </NavText>

                      </NavItem>

                      <NavItem role="menuitem" eventKey="logout">
                          <NavIcon>
                              <FontAwesomeIcon icon="sign-out-alt" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Logout
                            </NavText>

                      </NavItem>


                  </SideNav.Nav>

              </SideNav>


              <div id="main-content">

                    <div>
                      <h3 id="subtitle">Surveys</h3>
                      <hr style={{ width: "30%" }} id="hr-1" />
                    </div>
                    <div>
                      <Button style={{ height: 60, backgroundColor: "#009941", borderColor: "#009941"}}onClick={this.newSurvey}>Create New Survey +</Button>
                    </div>
                    <Row>
                        <List subheader={<ListSubheader>Surveys</ListSubheader>} >
                            {this.state.surveys.map((survey) => {
                                return <ListItem> 
                                    <ListItemText primary={survey.surveyName} />
                                </ListItem>
                            })
                            }
                            </List>
                  </Row>

              </div>
      </div>
    );
  }
}