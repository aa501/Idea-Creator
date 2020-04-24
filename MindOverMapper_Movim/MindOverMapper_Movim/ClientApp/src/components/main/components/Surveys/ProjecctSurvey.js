import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { Button, Form, FormGroup, FormText, Label, Input, Alert } from 'reactstrap';
import { Container, Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './ProjectSurvey.css';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const surveyStates = {
  Written: 'Written',
  Deployed: 'Deployed',
  Closed: 'Closed'
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
        specificSurveys: [],
        analyzedSurvey: [],
        subjects: [],
        surveyTakers: [],
        validDate: false,
        closeCheck: false,
    }
    this.getResponseCount = this.getResponseCount.bind(this);
  }

    componentDidMount = async () => {
      console.log(this.props);
      await this.runDataRetrieval();
    }

    returnToDashboard = () => {
      this.props.history.push({
        pathname: '/home',
        state: { userData: this.state.userData } // need this for moving to different component
    });
    }

    runDataRetrieval = async () => {
      await this.getSurveys();
    }

    getSurveys = () => {
      this.setLoading(true);
      const responseGroups = this.state.responseGroups;
      axios.get('/api/survey/' + this.state.projectName.uid, {
          headers: {
              Authorization: 'Bearer ' + this.state.userData.token
          }
      }
      ).then(response => {
          this.setState({ specificSurveys: response.data });
          if (this.state.closeCheck == false)
          this.checkEndDates(response.data);
          this.getSubjects();
        });
        this.setLoading(false);
    }

    getSubjects = async () => {
      this.setLoading(true);
      const token = this.state.userData.token;

      const specificSurveys = this.state.specificSurveys;
      const subjects = [];

      specificSurveys.forEach(function (survey) {
        var uid = survey.uid
        if (uid != null) {
            const response = axios.get(`/api/survey/${uid}/takers`, {
                headers: {
                    Authorization: 'Bearer ' + token //the token is a variable which holds the token
                }
            }).then(response => {
                response = response.data;
                console.log(survey.uid);
                subjects.push(response);
            });
        }
      });
      this.setState({ subjects }, () => (this.setLoading(false)));
    }

    getResponseCount = (index) => {
      console.log(index)
      const subjects = this.state.subjects;
      var length = subjects[index].length;

      return 0;
    }

    checkEndDates = (surveys) => {
      this.setLoading(true);
      var date = Date.now();
      console.log("Current time: " + ' ' + date )
      const token = this.state.userData.token;
      surveys.forEach(function(survey) {
        var dateNumber = parseFloat(survey.endDate);
        if (date > dateNumber) {
          console.log("Closing survey" + " " + survey.uid + ' ' + survey.endDate)
          var convertedDate = date.toString();
          axios.put(`/api/survey/${survey.uid}/pass`,
              {
                  'status': surveyStates.Closed,
                  'endDate': survey.endDate
              },
            {
            headers: {
              Authorization: 'Bearer ' + token
            }
          }
        ).then(() => {
          console.log("Survey statuses updated")
        }).catch(() => {
          console.log("Survey statuses failed to update")
          });
        }
      });

      if (this.state.closeCheck == false) {
      this.getSurveys();
      this.setState({ closeCheck: true}, () => (this.setLoading(false)));
      }
    }

    changeSurveyStatus = (statusToSet) => {
      var successMessage, errorMessage, logMessage, stateToPass = ''

      if (statusToSet == "Deployed") {
        successMessage = "Survey Deployed!";
        errorMessage = 'Error: Survey could not be deployed!';
        logMessage = "Deploying Survey... ";
        stateToPass = surveyStates.Deployed;

        console.log( logMessage + this.state.currentUid)
        axios.put(`/api/survey/${this.state.currentUid}/pass`,
            {
                'status': stateToPass,
                'endDate': this.state.fullEndDate
            },
          {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
        }
      ).then(() => {
        this.openSuccessModal();
        this.setState({
          confirmationModal: false,
          successModal: true,
          deployDialog: false,
          successMessage
        }, () => (this.getSurveys()))
      }).catch(() => {
          this.openErrorModal();
          this.setState({
          confirmationModal: false,
          errorModal: true,
          deployDialog: true,
          errorMessage
          });
        });
      }

      if (statusToSet == "Closed") {
        var date = Date.now();
        var convertedDate = date.toString();
        successMessage = "Survey Ended!";
        errorMessage = 'Error: Survey could not be closed!';
        logMessage = "Closing Survey... ";
        stateToPass = surveyStates.Closed;

        console.log( logMessage + this.state.currentUid)
        axios.put(`/api/survey/${this.state.currentUid}/pass`,
            {
                'status': stateToPass,
                'endDate': convertedDate
            },
          {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
        }
      ).then(() => {
        this.openSuccessModal();
        this.setState({
          endConfirmationModal: false,
          successModal: true,
          successMessage
        }, () => (this.getSurveys()))
      }).catch(() => {
          this.openErrorModal();
          this.setState({
          endConfirmationModal: false,
          errorModal: true,
          errorMessage
          });
        });
      }
    }

    newSurvey = () => {
        this.props.history.push({
            pathname: '/new-survey',
            state: this.state
        })
    }

    analyzeSurvey = (survey) => {
       this.props.history.push({
          pathname: '/survey-analytics',
          state: {
            userData: this.props.location.state.userData || this.props.userData,
            projectName: this.props.location.state.projectName,
            analyzedSurvey: survey
          }
      });
    }

    backToSurveys = () => {
        this.props.history.push({
            pathname: '/surveys',
            state: this.state
        });
    }

    editSurvey = (survey) => {
        this.setState({
          template: survey
        }, () => (this.pushToEdit()));
    }

    pushToEdit = () => {
        this.props.history.push({
            pathname: '/edit-survey',
            state: this.state
        });
    }

    setEndDate = (event) => {
      var currentDate = Date.now();
      var endDate = Date.parse(event.target.value);
      this.setState({ endDate: event.target.value }, () => (this.setValidDate()));
    }

    setEndTime = async (event) => {
      await this.setState({ endTime: event.target.value });
      await console.log(this.state.endTime);
      await this.setValidDate();
    }

    handleCloseErrorModal = () => {
      this.setState({
          errorModal: false
      });
    }

    openErrorModal = () => {
      this.setState({
          errorModal: true
      });
    }

    handleCloseSuccessModal = () => {
      this.setState({
          successModal: false
      });
    }

    openSuccessModal = () => {
      this.setState({
          successModal: true
      });
    }

    openDeployDialog = (uid) => {
      this.setState({ deployDialog: true,
                      warning: false,
                      currentUid: uid,
                      settingStatus: surveyStates.Deployed
                    })
    }

    openOverrideDialog = (uid) => {
      this.setState({ deployDialog: true,
                      warning: true,
                      currentUid: uid,
                      settingStatus: surveyStates.Deployed
                    })
    }

    closeDeployDialog = () => {
      this.setState({ deployDialog: false })
    }

    handleOpenConfirmationModal = (uid) => {
      this.setState({ deployDialog: false,
        confirmationModal: true });
    }

    handleCloseConfirmationModal = () => {
      this.setState({ deployDialog: false,
        confirmationModal: false });
    }

    handleOpenEndConfirmationModal = (uid) => {
      this.setState({ endConfirmationModal: true,
      currentUid: uid,
      settingStatus: surveyStates.Closed })
    }

    handleCloseEndConfirmationModal = () => {
      this.setState({ endConfirmationModal: false })
    }

    setValidDate = () => {
      var parsedDate = Date.parse(this.state.endDate);
      console.log(parsedDate)
      var time = this.state.endTime
      if (time && parsedDate) {
        var parsedTime = Number(time.split(':')[0])*3600000+Number(time.split(':')[1])*1000;

        var sumTime = parsedDate + parsedTime;
        console.log(Date.now() + " " + sumTime)
        if (sumTime > Date.now() + 86400000) {
        this.setState({ validDate: true, fullEndDate: sumTime }, () => (console.log(sumTime)));
        } else { this.setState({ validDate: false }) }
      }
    }

    renderPrototypes = (survey) => {
        var parsedPrototypes = JSON.parse(survey.prototypes);

        return (
          <div id="proto-list">
          <ul> {
            parsedPrototypes.map((prototype) => (
                  <li>
                      - {prototype.prototypeName}
                  </li>
                ))
            }
          </ul>
          </div>
        )
    }

    stateColor (state) {
      if (state == "Written")
        return 'rgb(102, 178, 255)'

      if (state == "Deployed")
        return 'rgb(255, 205, 0)'

      if (state == "Closed")
        return 'rgb(20, 166, 0)'
    }

    pushToMindMap = () => {
      this.props.history.push({
          pathname: '/project-view',
          state: this.state  // need this for moving to different component
      });
  }

  setLoading = (value) => {
    this.setState({ loading: value })
  }

  pushToResearch = () => {
      this.props.history.push({
          pathname: '/project-research',
          state: this.state  // need this for moving to different component
      });
  }

  pushToConcepts = () => {
      this.props.history.push({
          pathname: '/concept-view',
          state: this.state  // need this for moving to different component
      });
  }

  pushToSurveys = () => {
      this.props.history.push({
          pathname: '/surveys',
          state: this.state  // need this for moving to different component
      });
  }

  pushToPrototypes = () => {
      this.props.history.push({
          pathname: '/add-prototype',
          state: this.state  // need this for moving to different component
      });
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

    navProject = () => {
        this.props.history.push({
            pathname: '/project-landing-page',
            state: this.state  // need this for moving to different component
        });
    }

    surveyStateManager = (surveyState, standard) => {

      if (this.state.userData.type != "admin")
      {
        return true;
      }

      else if (this.state.userData.type == "admin")
      {
        if (surveyState != standard)
        {
          return true;
        }
      }

      else {
        return false;
      }
    }

  render() {
      return (

      <div id="page-container">

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

                      <NavItem expanded="true" role="menuitem" eventKey="project">
                          <NavIcon>
                              <FontAwesomeIcon icon="cogs" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>
                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Project Options
                            </NavText>
                          <NavItem eventKey="options" onClick={() => this.navProject()}>
                              <NavText id="subnav">
                                  Project Home
                                </NavText>
                          </NavItem>
                          <NavItem eventKey="options" onClick={this.pushToResearch}>
                              <NavText id="subnav">
                                  Research
                                </NavText>
                          </NavItem>
                         
                          <NavItem eventKey="options" onClick={this.pushToMindMap}>
                              <NavText id="subnav">
                                  Mind Map
                                </NavText>
                          </NavItem>
                          <NavItem eventKey="options" onClick={this.pushToConcepts}>
                              <NavText id="subnav">
                                  Concepts
                                </NavText>
                          </NavItem>
                          <NavItem eventKey="options" onClick={this.pushToPrototypes}>
                              <NavText id="subnav">
                                  Prototypes
                                </NavText>
                          </NavItem>
                          <NavItem eventKey="options" onClick={this.pushToSurveys}>
                              <NavText style={{ color: "#0283C4" }} id="subnav">
                                  Surveys
                                </NavText>
                          </NavItem>
                      </NavItem>

                        <NavItem role="menuitem" eventKey="logout"  onClick={() => this.navLogout()}>
                            <NavIcon>
                                <FontAwesomeIcon icon="sign-out-alt" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                            </NavIcon>

                            <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                                Logout
                            </NavText>

                        </NavItem>


                  </SideNav.Nav>

              </SideNav>


              <div id="survey-main-content">
                  <div id="push" >
                      <h3>Surveys for {this.state.projectName.title}</h3>
                      <hr style={{ width: "30%" }} id="hr-1" />
                  </div>

                 <div class="row" id="survey-id">
                     <div className="d-flex flex-wrap justify-content-around">
                      <div hidden={this.state.userData.type != "admin"}>
                       <Button style={{ height: 60, backgroundColor: "#009941", borderColor: "#009941"}}onClick={this.newSurvey}>Create New Survey</Button>
                       </div>
                     </div>
                      <div className='survey-board-body'>
                          {this.state.specificSurveys.map((survey, index) => {
                              return (
                                  <div class='survey-paper-holder'>
                                      <Card style={{width: 400, borderTop: "solid", borderTopWidth: "6px", borderTopColor: this.stateColor(survey.status)}}>
                                          <Paper className='survey-paper'>
                                                  <CardContent>
                                                      <Typography gutterBottom variant="h5" component="h2">
                                                        <div className="d-flex flex-wrap justify-content-around">
                                                          {survey.surveyName}
                                                        </div>
                                                      </Typography>
                                                      <Typography gutterBottom component="h5">
                                                        <div hidden={survey.status == "Deployed"} align="center">
                                                          <b>{survey.uid}</b>
                                                        </div>
                                                        <div hidden={survey.status != "Deployed"} align="center">
                                                          <b>Sharing Info:</b>
                                                          <div>idea-creator.com/survey</div>
                                                          <div>Unique Survey Code:</div>
                                                          <b>{survey.uid}</b>
                                                        </div>
                                                      </Typography>
                                                      <hr />
                                                      <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                          <FontAwesomeIcon id='font-awesome-space-right' icon="info-circle" style={{ fontSize: '1.4em' }}/>
                                                          <strong style={{marginRight: "20px"}}>Status:</strong> {survey.status}
                                                      </Typography>
                                                      <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                          <FontAwesomeIcon id='font-awesome-space-right' icon="question" style={{ fontSize: '1.4em' }}/>
                                                          <strong>Questions:</strong> {JSON.parse(survey.questions).length}
                                                      </Typography>
                                                      <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                          <Row style={{marginLeft: "3px"}}><FontAwesomeIcon id='font-awesome-space-right' icon="comments" style={{ fontSize: '1.4em' }}/>
                                                          <strong>Turk:</strong> { survey.hitId ? <div class="offset">Yes</div> : <div class="offset">No</div>}</Row>
                                                      </Typography>
                                                      <hr />
                                                      <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                          <FontAwesomeIcon id='font-awesome-space-right' icon="scroll" style={{ fontSize: '1.4em' }}/>
                                                          <strong>Prototypes</strong>
                                                          {this.renderPrototypes(survey)}
                                                      </Typography>
                                                      <hr />
                                                      <Typography>
                                                        <div className="d-flex flex-wrap justify-content-around">
                                                          <div hidden={survey.status == "Written"}><Button color="success" onClick={() => this.analyzeSurvey(survey)}>View Data</Button></div>
                                                          <div hidden={this.surveyStateManager(survey.status, "Written")}><Button color="warning" onClick={() => this.editSurvey(survey)}>Edit</Button></div>
                                                          <div hidden={this.surveyStateManager(survey.status, "Written")}><Button color="primary" onClick={() => this.openDeployDialog(survey.uid)}>Deploy</Button></div>
                                                          <div hidden={this.surveyStateManager(survey.status, "Deployed")}><Button color="primary" onClick={() => this.openDeployDialog(survey.uid)}>Extend</Button></div>
                                                          <div hidden={this.surveyStateManager(survey.status, "Deployed")}><Button color="danger" onClick={() => this.handleOpenEndConfirmationModal(survey.uid)}>End Now</Button></div>
                                                          <div hidden={this.surveyStateManager(survey.status, "Closed")}><Button color="warning" onClick={() => this.openOverrideDialog(survey.uid)}>Re-open</Button></div>
                                                        </div>
                                                      </Typography>
                                                  </CardContent>
                                          </Paper>
                                      </Card>
                                  </div>
                              );
                          })
                          }
                          </div>
                      </div>

                          <Dialog
                          open={this.state.deployDialog}
                          maxWidth='xl' >
                                  <DialogContent dividers>
                                      <div hidden={!this.state.warning}>
                                      <Alert color="warning">WARNING: Re-opening surveys can negatively impact results.</Alert>
                                      </div>
                                      <div><h6>Enter an end date for your survey. <br />
                                               Your choice must be at least 24 hours from now.</h6></div>
                                      <div>
                                        <TextField
                                          id="date"
                                          label="End Date"
                                          value={this.state.endDate}
                                          onChange={this.setEndDate}
                                          type="date"
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                        />
                                        <TextField
                                          id="time"
                                          label="End Time"
                                          value={this.state.endTime}
                                          onChange={this.setEndTime}
                                          type="time"
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          inputProps={{
                                            step: 300, // 5 min
                                          }}
                                        />
                                        <hr />
                                      </div>
                                  </DialogContent>
                                  <DialogActions>
                                      <Button color="success" disabled={!this.state.validDate} onClick={this.handleOpenConfirmationModal}>Deploy</Button>
                                      <Button color="primary" onClick={this.handleCloseConfirmationModal}>Close</Button>
                                  </DialogActions>
                          </Dialog>

                        </div>
                    <div>
                      <Dialog
                        open={this.state.successModal}
                        TransitionComponent={Transition}
                        keepMounted
                        maxWidth='lg'
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                      >
                        <DialogTitle id="responsibe-alert-dialog-slide-title">
                          {this.state.successMessage}
                        </DialogTitle>
                        <DialogActions>
                          <Button onClick={this.handleCloseSuccessModal} color="primary">
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>

                    <div>
                      <Dialog
                        open={this.state.confirmationModal}
                        TransitionComponent={Transition}
                        keepMounted
                        maxWidth='lg'
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                      >
                        <DialogTitle id="responsibe-alert-dialog-slide-title">
                          Are you sure you're ready to deploy your survey?<br />
                          You won't be able to modify it once this is done.
                        </DialogTitle>
                        <DialogActions>
                          <Button onClick={() => this.changeSurveyStatus(this.state.settingStatus)} color="success">Confirm</Button>
                          <Button onClick={this.handleCloseConfirmationModal} color="primary">Cancel</Button>
                        </DialogActions>
                      </Dialog>
                    </div>

                    <div>
                      <Dialog
                        open={this.state.endConfirmationModal}
                        TransitionComponent={Transition}
                        keepMounted
                        maxWidth='lg'
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                      >
                        <DialogTitle id="responsibe-alert-dialog-slide-title">
                          Are you sure you want to close your survey early?<br />
                          You cannot undo this action.
                        </DialogTitle>
                        <DialogActions>
                          <Button onClick={() => this.changeSurveyStatus(this.state.settingStatus)} color="danger">End Survey</Button>
                          <Button onClick={this.handleCloseEndConfirmationModal} color="primary">Cancel</Button>
                        </DialogActions>
                      </Dialog>
                    </div>

                  <div>
                    <Dialog
                      open={this.state.errorModal}
                      TransitionComponent={Transition}
                      keepMounted
                      maxWidth='lg'
                      aria-labelledby="alert-dialog-slide-title"
                      aria-describedby="alert-dialog-slide-description">
                      <DialogTitle id="responsibe-alert-dialog-slide-title">
                        {this.state.errorMessage}
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={this.handleCloseErrorModal} color="primary">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                </div>

                <div>
                    <Dialog open={this.state.loading}
                    style={{backgroundColor: 'transparent'}}
                    maxWidth="lg">
                    <div style={{overflow: 'hidden'}}>{"   "}<CircularProgress/>{"   "}</div>
                    </Dialog>
                </div>

            </div>

    );
  }
}
