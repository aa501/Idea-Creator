import axios from 'axios';
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import { Container, Row, Col } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import Portal from '@material-ui/core/Portal';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import './Dashboard.css';
import { textAlign } from '@material-ui/system';
import noProjectImage from "../../../../static/NoProjectsFound.png";
import City from "../../../../static/City.jpg";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData || this.props.userData,
            projectList: [],
            shareModal: false,
            learnModal: false,
            projectName: '',
            projectResearch1: '',
            projectResearch2: '',
            projectResearch3: '',
            projectResearchLink3: '',
            projectResearchLink2: '',
            projectResearchLink1: '',
            projectDefinition: '',
            projectExclusions: '',
            projectDescription: '',
            projectUID: '',
            openSuccessSnackBar: false,
            openErrorSnackBar : false,
            //imageLinks : [require("../../../../static/Beach.jpg"), require(City), require("../../../../static/Coast.jpg"), 
              //              require("../../../../static/Field.jpg"), require("../../../../static/Mountain.jpg"), require("../../../../static/Underwater.jpg")]
        }
    }

    componentDidMount = () => {
        this.pullProjectsForUser();
    }

    componentWillMount = () => {
        this.pullProjectsForUser();
    }

    handleOpenSuccessSnackBar = () => {
        this.setState({openSuccessSnackBar : true
        })
    }
    
    handleCloseSuccessSnackBar = () =>  {
        this.setState({openSuccessSnackBar : false})
    }
    
    handleOpenErrorSnackBar = () => {
      this.setState({openErrorSnackBar : true})
    }

    handleCloseErrorSnackBar = () =>  {
      this.setState({openErrorSnackBar : false})
    }    

    handleProjectNameChange = (event) => {
        this.setState({
            projectName: event.target.value
        });
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

    copyToClipboard = () => {
        /* Get the text field */
        var copyText = document.getElementById("myInput");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
    }


    pullProjectsForUser = async () => {
        const response = await axios.get('/api/project', {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
            }
        }).then(response => response.data);
        this.setState({
            projectList: response
        });
    }

    setStateOnSaveChanges() {
        console.log(this.state.projectResearchLink1, "space" , this.state.projectResearchLink3)
        const response = axios.put(`/api/project/${this.state.projectUID}`,
            {
                'title': this.state.projectName,
                'description': this.state.projectDescription,
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
            this.handleOpenSuccessSnackBar();
            console.log(response);
        }).catch(() => {
            this.handleOpenErrorSnackBar();;
        });
    }

    viewProject = (projectTitle) => {
        this.props.history.push({
            pathname: '/project-view',
            state: { userData: this.state.userData, projectName: projectTitle } // need this for moving to different component
        });
    }

    addProject = () => {
        this.props.history.push({
            pathname: '/create-project',
            state: { userData: this.state.userData } // need this for moving to different component
        });
    }

    handleCloseShareModal = () => {
        this.setState({
            shareModal: false
        });
    }

    openShareModal = () => {
        this.setState({
            shareModal: true
        });
    }

    handleCloseLearnModal = () => {
        this.setState({
            learnModal: false
        });
    }

    handleOpenLearnModal = (uid) => {

        this.getProjectInfo(uid);
        this.setState({
            learnModal: true,
            projectUID: uid,
            projectName: '',
            projectResearch1: '',
            projectResearch2: '',
            projectResearch3: '',
            projectResearchLink3: '',
            projectResearchLink2: '',
            projectResearchLink1: '',
            projectDefinition: '',
            projectExclusions: '',
            projectDescription: '',
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
        if(response.areasOfResearch.length === 1)
        {
            console.log("1");
            r1 = (response.areasOfResearch[0].content ? response.areasOfResearch[0].content : '')
            r1l = (response.areasOfResearch[0].link.hrefName !== 'undefined' ? response.areasOfResearch[0].link.hrefName  : '')
        }

        if (response.areasOfResearch.length === 2) {
            console.log("2");
            r1 = (response.areasOfResearch[0].content ? response.areasOfResearch[0].content : '')
            r1l = (response.areasOfResearch[0].link.hrefName !== 'undefined' ? response.areasOfResearch[0].link.hrefName  : '')
            r2 = (response.areasOfResearch[1].content ? response.areasOfResearch[1].content : '')
            r2l = (response.areasOfResearch[1].link.hrefName !== 'undefined' ? response.areasOfResearch[1].link.hrefName  : '')
        }

        if (response.areasOfResearch.length === 3) {
            console.log("3");
            r1 = (response.areasOfResearch[0].content ? response.areasOfResearch[0].content : '')
            r1l = (response.areasOfResearch[0].link.hrefName !== 'undefined' ? response.areasOfResearch[0].link.hrefName  : '')
            r2 = (response.areasOfResearch[1].content ? response.areasOfResearch[1].content : '')
            r2l = (response.areasOfResearch[1].link.hrefName !== 'undefined' ? response.areasOfResearch[1].link.hrefName  : '')
            r3 = (response.areasOfResearch[2].content ? response.areasOfResearch[2].content : '')
            r3l = (response.areasOfResearch[2].link.hrefName !== 'undefined' ? response.areasOfResearch[2].link.hrefName  : '')
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
            projectName: response.title
        })

        console.log(response);
    }


    renderSwitch(param) {
        switch(param % 6) {
          case 1:
            return require("../../../../static/City.jpg");
          case 2:
            return require("../../../../static/Beach.jpg");
          case 3:
            return require("../../../../static/Coast.jpg");
          case 4:
            return require("../../../../static/Field.jpg");
            case 5:
            return require("../../../../static/Mountain.jpg");
          default:
            return require("../../../../static/Underwater.jpg");
        }
      }


    render() {


        return (
            <div className='dashboard-container'>

              
                <SideNav
                    onSelect={(selected) => {
                        // Add your code here
                    }}
                >

                 <SideNav.Toggle />
                 
                    <SideNav.Nav defaultSelected="">

                        
                        <NavItem role="menuitem" eventKey="home">
                            <NavIcon>
                                    <FontAwesomeIcon icon="home" id="dash-icon" style={{ fontSize: '1.75em' }} />
                            </NavIcon>

                            <NavText id="nav-text" style={{paddingTop: 13, paddingRight: 32, fontSize: 18}}>
                                Home
                            </NavText>
                            
                        </NavItem>

                        <NavItem eventKey="charts">
                            <NavIcon>
                                    <FontAwesomeIcon icon="plus" id="dash-icon" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText style={{ paddingTop: 13, paddingRight: 32, fontSize: 18 }}>
                                Add Project
                            </NavText>
                            <NavItem eventKey="charts/linechart">
                                <NavText>
                                    Line Chart
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="charts/barchart">
                                <NavText>
                                    Bar Chart
                                </NavText>
                            </NavItem>
                        </NavItem>

                        <NavItem role="menuitem" eventKey="settings">
                            <NavIcon>
                                <FontAwesomeIcon icon="cogs" id="dash-icon" style={{ fontSize: '1.75em' }} />
                            </NavIcon>

                            <NavText id="nav-text" style={{ paddingTop: 13, paddingRight: 32, fontSize: 18 }}>
                                Settings
                            </NavText>

                        </NavItem>

                        <NavItem role="menuitem" eventKey="logout">
                            <NavIcon>
                                <FontAwesomeIcon icon="sign-out-alt" id="dash-icon" style={{ fontSize: '1.75em' }} />
                            </NavIcon>

                            <NavText id="nav-text" style={{ paddingTop: 13, paddingRight: 32, fontSize: 18 }}>
                                Logout
                            </NavText>

                        </NavItem>


                    </SideNav.Nav>           
                  
               </SideNav>
              
          


                <div class="row" id="background-projects">
                    




                        <div className='dashboard-body'>
                            {this.state.projectList.length === 0 ? (
                                <img src={noProjectImage} id='no-projects-image' alt="No Projects Found" />

                            ) : (<div></div>)}




                            {/* TODO: Have to make this conditional render, render the project tiles */}
                            {this.state.projectList.map((project, index) => {
                                return (
                                    <div class='project-paper-holder'>
                                        <Card style={{ height: 400 }}>
                                            <Paper className='project-paper'>
                                                <CardActionArea onClick={() => this.viewProject(project)}>
                                                    <CardMedia

                                                        style={{ height: 0, paddingTop: '10em' }}
                                                        image={this.renderSwitch(index)}
                                                        title="Idea"

                                                    />
                                                    <CardContent id='project-card-content'>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {project.title}
                                                        </Typography>
                                                        <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                            <FontAwesomeIcon id='font-awesome-space-right' icon="stream" style={{ fontSize: '1.4em' }}/>
                                                            <strong>Description:</strong> {project.description.slice(0, 58)}...
                                                        </Typography>
                                                        <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                            <FontAwesomeIcon id='font-awesome-space-right' icon="project-diagram" style={{ fontSize: '1.1em' }}/>
                                                                <strong>Project ID:</strong> #{project.uid}
                                                        </Typography>
                                                        <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                            <FontAwesomeIcon id='font-awesome-space-right' icon="calendar" style={{ fontSize: '1.4em' }}/>
                                                            <strong>Date Created:  </strong>{project.dateCreated.slice(0, 10)}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                                <CardActions>
                                                    <div id='share-learn-container'>
                                                        <Button size="small" color="primary" onClick={this.openShareModal}>
                                                            Share
                                    <FontAwesomeIcon id='font-awesome-space' icon="share-square" />
                                                        </Button>

                                                        <Button id='learn-button' size="small" color="info" onClick={() => this.handleOpenLearnModal(project.uid)}>
                                                            Learn More
                                    <FontAwesomeIcon id='font-awesome-space' icon="info-circle" />
                                                        </Button>
                                                    </div>
                                                </CardActions>
                                            </Paper>
                                        </Card>
                                    </div>
                                );
                            })
                            }
                            {this.state.userData.type === 'admin' ? (
                                <div className='project-paper-holder'>
                                    <Card>
                                        <Paper className='project-paper' onClick={this.addProject}>
                                            <CardActionArea>
                                                <CardMedia
                                                    style={{ height: 0, paddingTop: '56.25%' }}
                                                    image={require("../../../../static/addProject.jpg")}
                                                    title="Add Project"
                                                />

                                                <CardContent>

                                                    <Typography variant="h5" component="h2">
                                                        <center>
                                                            Add Project +
                                        </center>
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>

                                        </Paper>
                                    </Card>
                                </div>
                            ) : (null)}
                        </div>


                   
                </div>







                <div>
                    <Dialog id="share-dialog"
                        open={this.state.shareModal}
                        TransitionComponent={Transition}
                        keepMounted
                        maxWidth='md'
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle >
                            {"Share Project"}
                        </DialogTitle>
                        <DialogContent>
                            <input type="text" value="https://www.idea-creator.com/" id="myInput"></input>
                            <DialogActions>
                                <Button color="danger" onClick={this.handleCloseShareModal}>Cancel</Button>
                                <Button color="primary" onClick={this.copyToClipboard}> Copy Link</Button>
                            </DialogActions>

                        </DialogContent>
                    </Dialog>
                </div>

                <div>
                    <Dialog id="learn-dialog"
                        open={this.state.learnModal}
                        TransitionComponent={Transition}
                        keepMounted
                        maxWidth='xl'
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle >
                            {"Learn More"}
                        </DialogTitle>
                        <DialogContent dividers>
                            <Container id='tainer'>
                                <div className='project-name-holder'>
                                    <TextField
                                        value={this.state.projectName}
                                        onChange={this.handleProjectNameChange}
                                        label="Title"
                                        margin="normal"
                                        placeholder="Enter Title..."
                                        variant="outlined"
                                        disabled={this.state.userData.type !== 'admin'}>
                                    </TextField>
                                </div>
                                <Row id='r-and-d-col'>
                                    <Col md={{ span: 6, offset: 0 }} >
                                        <TextField id="projectDescription-input"
                                            value={this.state.projectDescription}
                                            onChange={this.handleProjectDescriptionChange}
                                            label="Description"
                                            placeholder="Enter Project Description..."
                                            multiline
                                            rows="4"
                                            margin="normal"
                                            variant="outlined"
                                            disabled={this.state.userData.type !== 'admin'}>
                                        </TextField>
                                    </Col>
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
                                                variant="outlined"
                                                disabled={this.state.userData.type !== 'admin'}>
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
                                                variant="outlined"
                                                disabled={this.state.userData.type !== 'admin'}>
                                            </TextField>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row id='r-and-d-col'>
                                    <Col md={{ span: 6, offset: 0 }} >
                                        <TextField id="projectDescription-input"
                                            value={this.state.projectDefinition}
                                            onChange={this.handleProjectDefinitionChange}
                                            label="Definition"
                                            placeholder="Project Definition"
                                            multiline
                                            rows="4"
                                            margin="normal"
                                            variant="outlined"
                                            disabled={this.state.userData.type !== 'admin'}>
                                        </TextField>
                                    </Col>
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
                                                variant="outlined"
                                                disabled={this.state.userData.type !== 'admin'}>
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
                                                variant="outlined"
                                                disabled={this.state.userData.type !== 'admin'}>
                                            </TextField>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row id='r-and-d-col'>
                                    <Col md={{ span: 6, offset: 0 }} >
                                        <TextField id="projectDescription-input"
                                            value={this.state.projectExclusions}
                                            onChange={this.handleProjectExclusionsChange}
                                            label="Exclusions"
                                            placeholder="Exclusions"
                                            multiline
                                            rows="4"
                                            margin="normal"
                                            variant="outlined"
                                            disabled={this.state.userData.type !== 'admin'}>
                                        </TextField>
                                    </Col>
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
                                                variant="outlined"
                                                disabled={this.state.userData.type !== 'admin'}>
                                            </TextField>
                                        </Row>
                                        <Row>
                                            <TextField id="projectLink-input"
                                                value={this.state.projectResearchLink3}
                                                onChange={this.handleProjectResearchLink3Change}
                                                placeholder="Link 3"
                                                multiline
                                                rows="1"
                                                label="Link"
                                                margin="normal"
                                                variant="outlined"
                                                disabled={this.state.userData.type !== 'admin'}
                                            >
                                            </TextField>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={{ span: 5, offset: 0 }}>
                                        <div id='project-id-holder'>
                                            Project ID: <input type="text" disabled='true' class="form-control" id="projectId-input-ds" value={this.state.projectUID} />
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                            {/* <Typography gutterBottom variant="h5" component="h2">
                                Title
                            </Typography>
                            <Typography>
                                Project Description
                            </Typography>
                            <Typography>
                                Project Definition
                            </Typography>
                            <Typography>
                                Project ID: #
                            </Typography>
                            <Typography >
                                Date Created:
                            </Typography>
                            <Typography>
                                Exclusions
                            </Typography>
                            <Typography>
                                Area of Research 1:
                            </Typography>
                            <Typography>
                                Link 1:
                            </Typography>
                            <Typography>
                                Area of Research 2:
                            </Typography>
                            <Typography>
                                Link 2:
                            </Typography>
                            <Typography>
                                Area of Research 3:
                            </Typography>
                            <Typography>
                                Link 3:
                            </Typography> */}

                        </DialogContent>


                        <DialogActions>
                            <Button color="danger" onClick={this.handleCloseLearnModal}>Cancel</Button>
                            {this.state.userData.type === 'admin' ? (
                                <div>
                                    <Button color="primary" disabled={this.state.projectName.length <= 0} onClick={() => { this.setStateOnSaveChanges() }}>Submit</Button>
                                </div>
                            ) : (null)}
                        </DialogActions>
                    </Dialog>
                </div>
                <Portal>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={this.state.openSuccessSnackBar}
                        autoHideDuration={3000}
                        onClose={this.handleCloseSuccessSnackBar}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        variant="success"
                        message={<span id="message-id"><CheckCircleIcon /> Saved Successfully!</span>}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="red"

                                onClick={this.handleCloseSuccessSnackBar}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    />
                    <Snackbar
                        id='success-snack'
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={this.state.openErrorSnackBar}
                        autoHideDuration={6000}
                        onClose={this.handleCloseErrorSnackBar}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id"><CheckCircleIcon /> Error Saving</span>}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="red"

                                onClick={this.handleCloseErrorSnackBar}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    /></Portal>
            </div>


        );
    }

}