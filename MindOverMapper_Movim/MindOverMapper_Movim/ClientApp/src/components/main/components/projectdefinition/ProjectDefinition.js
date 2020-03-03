import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, Form, FormGroup, FormText } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './ProjectDefinition.css';



export default class ProjectDefinition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: '',
            projectNumber: Math.floor(Math.random() * 1000000),
            userData: this.props.location.state.userData || this.props.userData,
            projectDefinition: '', //project mission
            projectExclusions: '',
            projectConstraints: '',
            projectDescription: '',
            projectExplorationAreas: '',
        }
    }

    componentDidMount = () => {
        console.log(this.props)
    }

    resetFields = () => {
        this.setState({
            projectName: '',
            projectMission: '',
            projectDefinition: '',
            projectExclusions: '',
            projectConstraints: '',
            projectDescription: '',
            projectExplorationAreas: '',
        })
    }

    handleProjectNameChange = (event) => {
        this.setState({
            projectName: event.target.value
        });
    }
    handleProjectDefinitionChange = (event) => {
        this.setState({
            projectDefinition: event.target.value
        });
    }
    handleProjectExplorationAreasChange = (event) => {
        this.setState({
            projectExplorationAreas: event.target.value
        });
    }

    handleProjectDescriptionChange = (event) => {
        this.setState({
            projectDescription: event.target.value
        });
    }

    handleProjectExclusionsChange = (event) => {
        this.setState({
            projectExclusions: event.target.value
        });
    }

    handleProjectConstraintsChange = (event) => {
        this.setState({
            projectConstraints: event.target.value
        });
    }


    submitProject = () => {
        axios.post('/api/project', {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
              },
            data: {
                'title': this.state.projectName,
                'description':this.state.projectDescription,
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
            pathname: '/project-research',
            state: this.state  // need this for moving to different component
        });
    }

    render() {
        return (
            <div className='blue-card-container'>
                <h3 className="page-title">Create New Project</h3>
                <Container>
                    <div className='project-name-holder'>
                        <TextField
                            value={this.state.projectName}
                            onChange={this.handleProjectNameChange}
                            label="Name"
                            margin="normal"
                            placeholder="Enter Project Name..."
                            variant="outlined">
                        </TextField>
                    </div>
                    <Row id='r-and-d-col'>
                        <Col md={{ span: 6, offset: 0 }} >
                            <TextField id="projectDescription-input"
                                value={this.state.projectDescription}
                                onChange={this.handleProjectDescriptionChange}
                                label="Description"
                                placeholder="Tell the story of why this is IMPORTANT..."
                                multiline
                                rows="4"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                        </Col>
                    <Col md={{ span: 5, offset: 0 }} >
                        <TextField id="projectDescription-input"
                            value={this.state.projectDefinition}
                            onChange={this.handleProjectDefinitionChange}
                            label="Mission"
                            placeholder="Generate ideas for..."
                            multiline
                            rows="4"
                            margin="normal"
                            variant="outlined">
                        </TextField>
                        </Col>    
                    </Row>
                    <Row>
                        <Col md={{ span: 6, offset: 0 }} >
                            <TextField id="projectDescription-input"
                                value={this.state.projectExclusions}
                                onChange={this.handleProjectExclusionsChange}
                                label="Exclsuions"
                                placeholder="Ideas or types of ideas we are NOT interested in..."
                                multiline
                                rows="4"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                        </Col>
                        <Col md={{ span: 6, offset: 0 }} >
                            <TextField id="projectDescription-input"
                                value={this.state.projectConstraints}
                                onChange={this.handleProjectConstraintsChange}
                                label="Constraints"
                                placeholder="Time, resources, costs, regulation, people etc...."
                                multiline
                                rows="4"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                                </Col>
                            </Row>
                        <Row>
                        <Col md={{ span: 5, offset: 0 }} >
                            <TextField id="projectDescription-input"
                                value={this.state.projectExplorationAreas}
                                onChange={this.handleProjectExplorationAreasChange}
                                label="Exploration Areas"
                                multiline
                                rows="4"
                                margin="normal"
                                placeholder="Places to start and things to consider for ideas..."
                                variant="outlined">
                            </TextField>
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
                                <Button color='warning' id='reset-fields' onClick={this.resetFields}><FontAwesomeIcon icon="undo" /> Reset</Button>
                                <Button color='primary' id='submit-project' disabled={this.state.projectName === ''} onClick={this.nextPage}><FontAwesomeIcon icon="check" /> Submit</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}