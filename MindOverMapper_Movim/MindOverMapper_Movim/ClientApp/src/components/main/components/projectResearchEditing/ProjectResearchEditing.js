import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, Label } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { Container, Row, Col, FormGroup, InputGroup, Form, Input} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropzone from 'react-dropzone'
import Snackbar from '@material-ui/core/Snackbar';
import Portal from '@material-ui/core/Portal';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import './ProjectResearchEditing.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class ProjectResearchEditing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: this.props.location.state.projectName,
            projectNumber: this.props.location.state.projectNumber,
            userData: this.props.location.state.userData || this.props.userData,
            projectDefinition: this.props.location.state.projectDefinition, //project mission
            projectExclusions: this.props.location.state.projectExclusions,
            projectConstraints: this.props.location.state.projectConstraints,
            projectDescription: this.props.location.state.projectDescription,
            projectExplorationAreas: this.props.location.state.projectExplorationAreas,
            projectResearch1: '',
            projectResearch2: '',
            projectResearch3: '',
            projectResearchLink3: '',
            projectResearchLink2: '',
            projectResearchLink1: '',
            projectNotes: '',
        }
    }

    componentDidMount = () => {
        if (this.props.location.state === undefined) {
            this.props.history.push({
                pathname: '/'
            });
        } else {
            this.setState({
                userData: this.props.location.state.userData,
                projectName: this.props.location.state.projectName,
            });
        }
        this.getProjectInfo(this.state.projectName.uid);
        console.log(this.state.projectName)
    }

    resetFields = () => {
        this.setState({
            projectResearch1: '',
            projectResearch2: '',
            projectResearch3: '',
            projectResearchLink3: '',
            projectResearchLink2: '',
            projectResearchLink1: '',
            projectNotes: '',
        })
    }

    handleProjectResearch1Change = (event) => {
        this.setState({
            projectResearch1: event.target.value
        });
    }
    handleProjectResearch2Change = (event) => {
        this.setState({
            projectResearch2: event.target.value
        });
    }
    handleProjectResearch3Change = (event) => {
        this.setState({
            projectResearch3: event.target.value
        });
    }
    handleProjectResearchLink3Change = (event) => {
        this.setState({
            projectResearchLink3: event.target.value
        });
    }
    handleProjectResearchLink2Change = (event) => {
        this.setState({
            projectResearchLink2: event.target.value
        });
    }
    handleProjectResearchLink1Change = (event) => {
        this.setState({
            projectResearchLink1: event.target.value
        });
    }
    handleProjectDescriptionChange = (event) => {
        this.setState({
            projectDescription: event.target.value
        });
    }
    handleProjectDefinitionChange = (event) => {
        this.setState({
            projectDefinition: event.target.value
        });
    }

    handleProjectExclusionsChange = (event) => {
        this.setState({
            projectExclusions: event.target.value
        });
    }

    handleProjectNotesChange = (event) => {
        this.setState({
            projectNotes: event.target.value
        });
    }

    submitProject = () =>
      {
          console.log(this.state.projectResearchLink1, "space" , this.state.projectResearchLink3)
          const response = axios.put(`/api/project/${this.state.projectName.uid}`,
              {
                  'title': this.state.projectName.title,
                  'description': this.state.projectName.description,
                  'definition': this.state.projectDefinition,
                  'exclusions': [{
                      'content': this.state.projectExclusions
                  }],
                  'areasOfResearch': [{
                      'content': this.state.projectResearch1,
                      'link': {
                          'href': this.state.projectResearchLink1,
                          'hrefName': this.state.projectResearchLink1
                      }
                  },
                  {
                      'content': this.state.projectResearch2,
                      'link': {
                          'href': this.state.projectResearchLink2,
                          'hrefName': this.state.projectResearchLink2
                      }
                  },
                  {
                      'content': this.state.projectResearch3,
                      'link': {
                          'href': this.state.projectResearchLink3,
                          'hrefName': this.state.projectResearchLink3
                      }
                  }
                  ],
              },
              {
                  headers: {
                      Authorization: 'Bearer ' + this.state.userData.token
                  }
              }
          ).then(() => {
              this.setState({ successMessage: "Research updated! "})
              this.openSuccessModal();
              console.log(response);
          }).catch(() => {
              this.setState({ errorMessage: "Research failed to update. "})
              this.openErrorModal();
          });
      }

    getProjectInfo = async (uid) => {
        let r1 = '';
        let r2 = '';
        let r3 = '';
        let r1l = '';
        let r2l = '';
        let r3l = '';
        let ex = '';

        const response = await axios.get(`/api/project/${uid}`, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
            }
        }).then(response => response.data);
        console.log(response)
        if (response.areasOfResearch.length === 1) {
            console.log("1");
            r1 = (response.areasOfResearch[0].content ? response.areasOfResearch[0].content : '')
            r1l = (response.areasOfResearch[0].link.hrefName !== 'undefined' ? response.areasOfResearch[0].link.hrefName : '')
        }

        if (response.areasOfResearch.length === 2) {
            console.log("2");
            r1 = (response.areasOfResearch[0].content ? response.areasOfResearch[0].content : '')
            r1l = (response.areasOfResearch[0].link.hrefName !== 'undefined' ? response.areasOfResearch[0].link.hrefName : '')
            r2 = (response.areasOfResearch[1].content ? response.areasOfResearch[1].content : '')
            r2l = (response.areasOfResearch[1].link.hrefName !== 'undefined' ? response.areasOfResearch[1].link.hrefName : '')
        }

        if (response.areasOfResearch.length === 3) {
            console.log("3");
            r1 = (response.areasOfResearch[0].content ? response.areasOfResearch[0].content : '')
            r1l = (response.areasOfResearch[0].link.hrefName !== 'undefined' ? response.areasOfResearch[0].link.hrefName : '')
            r2 = (response.areasOfResearch[1].content ? response.areasOfResearch[1].content : '')
            r2l = (response.areasOfResearch[1].link.hrefName !== 'undefined' ? response.areasOfResearch[1].link.hrefName : '')
            r3 = (response.areasOfResearch[2].content ? response.areasOfResearch[2].content : '')
            r3l = (response.areasOfResearch[2].link.hrefName !== 'undefined' ? response.areasOfResearch[2].link.hrefName : '')
        }

        if (response.exclusions.length === 1) {
            ex = response.exclusions[0].content
        }


        this.setState({
            projectResearch1: r1,
            projectResearch2: r2,
            projectResearch3: r3,
            projectResearchLink3: r3l,
            projectResearchLink2: r2l,
            projectResearchLink1: r1l,
            projectDefinition: '',
            projectExclusions: ex,
            projectDescription: response.description,
            projectDefinition: response.definition,
            projectTitle: response.title
        })

        console.log(response);
    }

    nextPage = () => {
        this.props.history.push({
            pathname: '/project-stimuli',
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

    pushToMindMap = () => {
        this.props.history.push({
            pathname: '/project-view',
            state: this.state  // need this for moving to different component
        });
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

    navProject = () => {
        this.props.history.push({
            pathname: '/project-landing-page',
            state: this.state  // need this for moving to different component
        });
    }

    nextPage = () => {
        this.props.history.push({
            pathname: '/project-landing-page',
            state: this.state  // need this for moving to different component
        });
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

    state = { showing: true };

    render() {
        const { showing } = this.state;

        return (

            <div id="research-container">

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
                                <NavText style={{ color: "#0283C4"}}id="subnav">
                                    Research
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToConcepts}>
                                <NavText id="subnav">
                                    Concepts
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToMindMap}>
                                <NavText id="subnav">
                                    Mind Map
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToPrototypes}>
                                <NavText id="subnav">
                                    Prototypes
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToSurveys}>
                                <NavText id="subnav">
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


                <div id='research-main-content'>
                    <div>
                        <h3 id="subtitle">Update Research</h3>
                        <hr style={{ width: "30%" }} id="hr-1" />
                    </div>

                        <Row id='r-and-d-col'>
                            <Col md={{ span: 5, offset: 0 }}>
                                <Row>
                                    <TextField id="projectLink-input"
                                        value={this.state.projectResearch1}
                                        onChange={this.handleProjectResearch1Change}
                                        placeholder="Area of Research 1"
                                        multiline
                                        rows="1"
                                        label="Area of Research 1"
                                        margin="normal"
                                        variant="outlined">
                                    </TextField>
                                </Row>
                                <Row>
                                    <TextField id="projectLink-input"
                                        value={this.state.projectResearchLink1}
                                        onChange={this.handleProjectResearchLink1Change}
                                        placeholder="Link"
                                        multiline
                                        rows="1"
                                        label="Link"
                                        margin="normal"
                                        variant="outlined">
                                    </TextField>
                                </Row>
                            </Col>
                            <Col md={{ span: 6, offset: 0 }}>
                                <Row>
                                    <TextField id="projectDescription-input"
                                        value={this.state.projectNotes}
                                        onChange={this.handleProjectNotesChange}
                                        placeholder="Enter Research Notes"
                                        multiline
                                        rows="4"
                                        label="Notes"
                                        margin="normal"
                                        variant="outlined">
                                    </TextField>
                                </Row>
                                </Col>
                        </Row>
                        <Row id='r-and-d-col'>
                            <Col md={{ span: 5, offset: 0 }}>
                                <Row>
                                    <TextField id="projectLink-input"
                                        value={this.state.projectResearch2}
                                        onChange={this.handleProjectResearch2Change}
                                        placeholder="Area of Research 2"
                                        multiline
                                        rows="1"
                                        label="Area of Research 2"
                                        margin="normal"
                                        variant="outlined">
                                    </TextField>
                                </Row>
                                <Row>
                                    <TextField id="projectLink-input"
                                        value={this.state.projectResearchLink2}
                                        onChange={this.handleProjectResearchLink2Change}
                                        placeholder="Link"
                                        multiline
                                        rows="1"
                                        label="Link"
                                        margin="normal"
                                        variant="outlined">
                                    </TextField>
                                </Row>
                            </Col>
                            <Col md={{ span: 6, offset: 0 }}>

                           </Col>
                        </Row>
                        <Row id='r-and-d-col'>
                            <Col md={{ span: 5, offset: 0 }}>
                                <Row>
                                    <TextField id="projectLink-input"
                                        value={this.state.projectResearch3}
                                        onChange={this.handleProjectResearch3Change}
                                        placeholder="Area of Research 3"
                                        multiline
                                        rows="1"
                                        label="Area of Research 3"
                                        margin="normal"
                                        variant="outlined">
                                    </TextField>
                                </Row>
                                <Row>
                                    <TextField id="projectLink-input"
                                        value={this.state.projectResearchLink3}
                                        onChange={this.handleProjectResearchLink3Change}
                                        placeholder="Link"
                                        multiline
                                        rows="1"
                                        label="Link"
                                        margin="normal"
                                        variant="outlined">
                                    </TextField>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 0 }}>
                                <div id='project-id-holder'>
                                    Project Owner: <input type="text" disabled='true' class="form-control" id="projectId-input" value={this.props.location.state.userData.firstName + ' ' + this.props.location.state.userData.lastName} />
                                </div>
                            </Col>
                            <Col md={{ span: 2, offset: 1 }}>
                                <div id='confirmation-button-holder'>
                                    <Button color='warning' id='reset-fields' onClick={this.resetFields}><FontAwesomeIcon icon="undo" /> Reset</Button>
                                    <Button color='primary' id='submit-project' disabled={this.state.projectName === ''} onClick={this.submitProject}><FontAwesomeIcon icon="check" /> Submit</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div>
                      <Dialog
                        open={this.state.errorModal}
                        TransitionComponent={Transition}
                        keepMounted
                        maxWidth='lg'
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                      >
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
                          <Button onClick={this.nextPage} color="primary">Return to Project</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
            </div>
        );
    }
}
