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
import './ConceptView.css';
import { textAlign } from '@material-ui/system';
import noProjectImage from "../../../../static/NoProjectsFound.png";
import addProject from "../../../../static/addProject.jpg";
import City from "../../../../static/City.jpg";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class ConceptView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: this.props.location.state.projectName,
            userData: this.props.location.state.userData || this.props.userData,
            concepts: this.props.location.state.concepts,
            shareModal: false,
            learnModal: false,
            newsHeadline: '',
            customer: '',
            customerProblem: '',
            benefitPromise: '',
            proof: '',
            price: '',
            passion: '',
            deathThreats: '',
            openSuccessSnackBar: false,
            openErrorSnackBar : false,
            //imageLinks : [require("../../../../static/Beach.jpg"), require(City), require("../../../../static/Coast.jpg"),
              //              require("../../../../static/Field.jpg"), require("../../../../static/Mountain.jpg"), require("../../../../static/Underwater.jpg")]
        }
    }

    componentDidMount = () => {
        console.log(this.props);
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

    resetFields = () => {
        this.setState({
            conceptName: '',
            newsHeadline: '',
            customer: '',
            customerProblem: '',
            benefitPromise: '',
            proof: '',
            price: '',
            passion: '',
            deathThreats: '',
        })
    }

    handleConceptNameChange = (event) => {
        this.setState({
            conceptName: event.target.value
        });
    }
    handleNewsHeadlineChange = (event) => {
        this.setState({
            newsHeadline: event.target.value
        });
    }
    handleCustomerChange = (event) => {
        this.setState({
            customer: event.target.value
        });
    }
    handleCustomerProblemChange = (event) => {
        this.setState({
            customerProblem: event.target.value
        });
    }
    handleBenefitPromiseChange = (event) => {
        this.setState({
            benefitPromise: event.target.value
        });
    }
    handleProofChange = (event) => {
        this.setState({
            proof: event.target.value
        });
    }
    handlePriceChange = (event) => {
        this.setState({
            price: event.target.value
        });
    }
    handlePassionChange = (event) => {
        this.setState({
            passion: event.target.value
        });
    }
    handleDeathThreatsChange = (event) => {
        this.setState({
            deathThreats: event.target.value
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

    addConcept = () => {
            this.props.history.push({
                pathname: '/concept',
                state: this.state  // need this for moving to different component
            });
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




                <div class="row" id="background-concepts">
                        <h3 id="page-title">Concepts for {this.state.projectName.title}</h3>
                        <div className='concept-board-body'>
                            {this.state.concepts.length === 0 ? (
                                <img src={noProjectImage} id='no-projects-image' alt="No Concepts Found" />

                            ) : (<div></div>)}
                            {/* TODO: Have to make this conditional render, render the project tiles */}
                            {this.state.concepts.map((concept, index) => {
                                return (
                                    <div class='concept-paper-holder'>
                                        <Card style={{ height: 200 }}>
                                            <Paper className='concept-paper'>
                                                    <CardContent id='concept-card-content'>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {concept.conceptName}
                                                        </Typography>
                                                        <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                            <FontAwesomeIcon id='font-awesome-space-right' icon="stream" style={{ fontSize: '1.4em' }}/>
                                                            <strong>News Headline</strong> {concept.newsHeadline.slice(0, 58)}...
                                                        </Typography>
                                                        <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                            <FontAwesomeIcon id='font-awesome-space-right' icon="project-diagram" style={{ fontSize: '1.1em' }}/>
                                                                <strong>Concept ID:</strong> #{concept.uid}
                                                        </Typography>
                                                        <Typography id="description-logo" variant="body2" color="textSecondary" component="p">
                                                            <FontAwesomeIcon id='font-awesome-space-right' icon="heart" style={{ fontSize: '1.4em' }}/>
                                                            <strong>Concept Promise  </strong>{concept.promise}
                                                        </Typography>
                                                    </CardContent>
                                                <CardActions>
                                                    <div id='share-learn-container'>
                                                        <Button id='learn-button' size="small" color="info">
                                                            Edit
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
                                <div className='concept-paper-holder'>
                                    <Card>
                                        <Paper className='concept-paper' onClick={this.addConcept}>
                                            <CardActionArea>
                                                <CardMedia
                                                    style={{ height: 0, paddingTop: '56.25%' }}
                                                    image={addProject}
                                                    title="Add Concept"
                                                />

                                                <CardContent>

                                                    <Typography variant="h5" component="h2">
                                                        <center>
                                                            Add Concept +
                                        </center>
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>

                                        </Paper>
                                    </Card>
                                </div>
                        </div>
                </div>
            </div>


        );
    }

}
