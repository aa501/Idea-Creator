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
import './projectLandingPage.css';
import { textAlign } from '@material-ui/system';
import noProjectImage from "../../../../static/NoProjectsFound.png";
import City from "../../../../static/City.jpg";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class ProjectLandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData,
            projectName: this.props.location.state.projectName,
            projectConcept: ''
        }
    }


    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.props.history.push({
                pathname: '/'
            });
        } else {
            this.setState({
                userData: this.props.location.state.userData,
                projectName: this.props.location.state.projectName,
                projectConcept: this.props.location.state.projectConcept
            });
        }
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

                        <h2 id="project-name" >Project Name</h2>
                        <hr />

                        <div class="page-body-1 row">

                            <div class="col-sm project-details">
                                <ul>
                                    <li class="li">
                                        <FontAwesomeIcon id='font-awesome-space-right' icon="project-diagram" style={{ fontSize: '1.3em' }} />
                                        <strong>Project ID: </strong>00002901
                                    </li>
                                    <li class="li">
                                        <FontAwesomeIcon id='font-awesome-space-right' icon="calendar" style={{ fontSize: '1.4em' }} />
                                        <strong>Date Created: </strong>10/4/19
                                    </li>
                                    <li class="li">
                                        <FontAwesomeIcon id='font-awesome-space-right' icon="stream" style={{ fontSize: '1.3em' }} />
                                        <strong>Description: </strong>This is a test description of this project. Something something, filler text goes here. And then some more filler text goes here and here.
                                    </li>
                                </ul>
                            </div>

                            <div class="col-sm card-holder align-self-center">
                                <Card class="card">                                   
                                     <CardActionArea>
                                         <CardMedia
                                             style={{ height: 0, paddingTop: '56.25%' }}
                                             image={require("../../../../static/addProject.jpg")}
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
                        <hr />

                        <div class="page-body-2">

                            

                        </div>


                    </div>

                </div>




            </div>
        );
    }
    
    

}