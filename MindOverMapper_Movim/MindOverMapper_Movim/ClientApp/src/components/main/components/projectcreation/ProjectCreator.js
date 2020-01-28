import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './ProjectCreator.css';



export default class ProjectCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: '',
            projectNumber: Math.floor(Math.random() * 1000000),
            userData: this.props.location.state.userData || this.props.userData,
            projectResearch1: '', 
            projectResearch2: '',
            projectResearch3: '',
            projectResearchLink3: '',
            projectResearchLink2: '',
            projectResearchLink1: '',
            projectDefinition: '',
            projectExclusions: '',
            projectDescription: '',
        }
    }

    componentDidMount = () => {
        console.log(this.props)
    }

    resetFields = () => {
        this.setState({
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
        })
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

    submitProject = () => {
        axios.post('/api/project', {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
              },
            data: {
                'title': this.state.projectName,
                'description': this.state.projectDescription,
                'problemStatement': {
                    'title': this.state.projectName,
                    'description': this.state.projectDescription,
                    'link*': {
                        'href': this.state.projectResearchLink1,
                        'hrefName': this.state.projectResearchLink1
                    }
                },
                'exclusion': [{
                    'content': this.state.projectExclusions,
                    'link*': {
                        'href': this.state.projectResearchLink3,
                        'hrefName': this.state.projectResearchLink3
                    }
                }],
                'constraints': [{
                    'content': this.state.projectDefinition,
                    'link*': {
                        'href': this.state.projectResearchLink3,
                        'hrefName': this.state.projectResearchLink3
                    }
                }],
                'areasOfResearch': [{
                    'content': this.state.projectResearch1,
                    'link*': {
                        'href': this.state.projectResearchLink1,
                        'hrefName': this.state.projectResearchLink1
                    }
                }],
                'stimulus': []
            }
        });
    }
    
    
    nextPage = () => {
        this.props.history.push({
            pathname: '/project-stimuli',
            state: this.state  // need this for moving to different component
        });
    }

    render() {
        return (
            <div className='blue-card-container'>
                <h3 className="page-title">Blue Card Page</h3>
                <Container>
                    <div className='project-name-holder'>
                        <TextField
                            value={this.state.projectName}
                            onChange={this.handleProjectNameChange}
                            label="Title"
                            margin="normal"
                            placeholder="Enter Title..."
                            variant="outlined">
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
                                variant="outlined">
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
                                variant="outlined">
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
                                variant="outlined">
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
                        <Col md={{ span: 3, offset: 0 }}>
                            <div id='project-id-holder'>
                                Project ID: <input type="text" disabled='true' class="form-control" id="projectId-input" value={'#' + this.state.projectNumber} />
                            </div>
                        </Col>
                        <Col md={{ span: 3, offset: 0 }}>
                            <div id='project-id-holder'>
                                Project Owner: <input type="text" disabled='true' class="form-control" id="projectId-input" value={this.props.location.state.userData.firstName + ' ' + this.props.location.state.userData.lastName} />
                            </div>
                        </Col>
                        <Col md={{ span: 2, offset: 1 }}>
                            <div id='confirmation-button-holder'>
                                <Button color = 'warning' id='reset-fields' onClick={this.resetFields}><FontAwesomeIcon icon="undo" /> Reset</Button>
                                <Button color = 'primary' id='submit-project' disabled = {this.state.projectName === ''} onClick={this.nextPage}><FontAwesomeIcon icon="check" /> Submit</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}