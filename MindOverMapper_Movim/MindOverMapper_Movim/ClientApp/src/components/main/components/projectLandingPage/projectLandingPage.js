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
import ButtonBase from '@material-ui/core/ButtonBase'
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
import './projectLandingPage.css';
import { textAlign } from '@material-ui/system';
import noProjectImage from "../../../../static/NoProjectsFound.png";
import City from "../../../../static/City.jpg";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

function formatDate(newDate) {
    var splitDate = newDate.split("T");
    var adjustedDate = splitDate[0];
    return adjustedDate;
}

export default class ProjectLandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData,
            projectName: this.props.location.state.projectName,
            concepts: [],
        }
    }

    componentDidMount = () => {
      this.pullConcepts();
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
            pathname: '/survey-question',
            state: this.state  // need this for moving to different component
        });
    }

    pushToPrototypes = () => {
        this.props.history.push({
            pathname: '/add-prototype',
            state: this.state  // need this for moving to different component
        });
    }

    pullConcepts = async () => {
        const response = await axios.get('/api/project/' + this.state.projectName.uid + '/get-concepts', {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
              }//the token is a variable which holds the token
          }).then(response => response.data);
              this.setState({
              concepts: response
          });
        const test = await console.log(this.state.concepts);
    }

    render() {
        return (
            <div class="landing-page-container">
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

                            <NavText id="nav-text" style={{ paddingTop: 13, paddingRight: 32, fontSize: 18 }}>
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

                        <NavItem role="menuitem" eventKey="info">
                            <NavIcon>
                                <FontAwesomeIcon icon="info-circle" id="dash-icon" style={{ fontSize: '1.75em' }} />
                            </NavIcon>

                            <NavText id="nav-text" style={{ paddingTop: 13, paddingRight: 32, fontSize: 18 }}>
                                About
                            </NavText>

                        </NavItem>

                        <NavItem role="menuitem" eventKey="help">
                            <NavIcon>
                                <FontAwesomeIcon icon="question" id="dash-icon" style={{ fontSize: '1.75em' }} />
                            </NavIcon>

                            <NavText id="nav-text" style={{ paddingTop: 13, paddingRight: 32, fontSize: 18 }}>
                                Help
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

                <div id="landing-page-container">

                    <div class="landing-page-body">

                        <h2 id="project-name" >{this.state.projectName.title}</h2>
                        <hr id="hr-1" />

                        <div class="page-body-1 row">

                            <div class="col-sm project-details">
                                <ul>
                                    <li class="li">
                                        <FontAwesomeIcon id='font-awesome-space-right' icon="project-diagram" style={{ fontSize: '1.3em' }} />
                                        <strong>Project ID: </strong>{this.state.projectName.uid}
                                    </li>
                                    <li class="li">
                                        <FontAwesomeIcon id='font-awesome-space-right' icon="calendar" style={{ fontSize: '1.4em' }} />
                                        <strong>Date Created: </strong>{formatDate(this.state.projectName.dateCreated)}
                                    </li>
                                    <li class="li">
                                        <FontAwesomeIcon id='font-awesome-space-right' icon="stream" style={{ fontSize: '1.3em' }} />
                                        <strong>Description: </strong>{this.state.projectName.description}
                                    </li>
                                </ul>
                            </div>

                            <div class="col-sm card-holder align-self-center">
                                <Card class="card">
                                     <CardActionArea onClick={this.pushToMindMap}>
                                         <CardMedia
                                             style={{ height: 0, paddingTop: '56.25%' }}
                                             image={require("../../../../static/ideaPicture.jpg")}
                                             title="Add Project"
                                         />
                                         <CardContent>
                                             <Typography variant="h5" component="h2">
                                                 <center>
                                                     View Mind-Map
                                                 </center>
                                             </Typography>
                                         </CardContent>
                                     </CardActionArea>
                                </Card>
                            </div>

                        </div>

                        <h2 id="project-options" >Project Options</h2>
                        <hr id="hr-2" />

                        <div class="page-body-2 row">

                            <div class="col-sm-2">
                                <Card class="card-button">
                                    <CardActionArea onClick={this.pushToResearch}>
                                        <CardContent>
                                            <Typography id="options-label">
                                                <center>
                                                    Research
                                                 </center>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                            <div class="col-sm-2">
                                <Card class="card-button-2">
                                    <CardActionArea onClick={this.pushToConcepts}>
                                        <CardContent>
                                            <Typography id="options-label">
                                                <center>
                                                    Concepts
                                                 </center>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                            <div class="col-sm-2">
                                <Card class="card-button-3">
                                    <CardActionArea onClick={this.pushToPrototypes}>
                                        <CardContent>
                                            <Typography id="options-label">
                                                <center>
                                                    Prototypes
                                                 </center>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>
                            <div class="col-sm-2">
                                <Card class="card-button-4">
                                    <CardActionArea onClick={this.pushToSurveys}>
                                        <CardContent>
                                            <Typography id="options-label">
                                                <center>
                                                    Surveys
                                                 </center>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </div>


                        </div>


                    </div>

                </div>




            </div>
        );
    }



}
