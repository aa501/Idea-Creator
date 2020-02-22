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

import './Concept.css';



export default class Concept extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: this.props.location.state.projectName,
            projectNumber: Math.floor(Math.random() * 1000000),
            userData: this.props.location.state.userData || this.props.userData,
            conceptName: '',
            newsHeadline: '',
            customer: '',
            customerProblem: '',
            benefitPromise: '',
            proof: '',
            price: '',
            passion: '',
            deathThreats: '',
        }
    }

    componentDidMount = () => {
        console.log(this.props)
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
             <div className='concept-container'>
                <h3 className="page-title">Concept Definition</h3>
                <Container>
                    <div className='concept-name-holder'>
                        <TextField
                            value={this.state.conceptName}
                            onChange={this.handleConceptNameChange}
                            label="Name"
                            margin="normal"
                            placeholder="Enter Concept Name..."
                            variant="outlined">
                        </TextField>
                    </div>
                    <Row id='r-and-d-col'>
                        <Col>
                            <TextField id="full-concept-field"
                                value={this.state.newsHeadline}
                                onChange={this.handleNewsHeadlineChange}
                                label="News Headline"
                                placeholder="Enter News Headline..."
                                multiline
                                rows="2"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 6, offset: 0 }} >
                            <TextField id="concept-field"
                                value={this.state.customer}
                                onChange={this.handleCustomerChange}
                                label="Customer"
                                placeholder="Enter Customer..."
                                multiline
                                rows="2"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                        </Col>
                        <Col md={{ span: 5, offset: 0 }} >
                            <TextField id="concept-field"
                                value={this.state.customerProblem}
                                onChange={this.handleCustomerProblemChange}
                                label="Customer Problem"
                                placeholder="Enter Customer Problem..."
                                multiline
                                rows="2"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 6, offset: 0 }} >
                            <TextField id="concept-field"
                                value={this.state.benefitPromise}
                                onChange={this.handleBenefitPromiseChange}
                                label="Benefit Promise"
                                placeholder="Enter Benefit Promise..."
                                multiline
                                rows="2"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                        </Col>
                        <Col md={{ span: 5, offset: 0 }} >
                            <TextField id="concept-field"
                                value={this.state.price}
                                onChange={this.handlePriceChange}
                                label="Price"
                                placeholder="Enter Price..."
                                multiline
                                rows="2"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                        </Col>
                    </Row>
                    <Row>
                      <Col md={{ span: 6, offset: 0 }} >
                        <TextField id="concept-field"
                            value={this.state.passion}
                            onChange={this.handlePassionChange}
                            label="Passion"
                            multiline
                            rows="3"
                            margin="normal"
                            placeholder="Enter Passion..."
                            variant="outlined">
                        </TextField>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={{ span: 6, offset: 0 }} >
                        <TextField id="concept-field"
                            value={this.state.deathThreats}
                            onChange={this.handleDeathThreatsChange}
                            label="Death Threats"
                            multiline
                            rows="3"
                            margin="normal"
                            placeholder="Enter Death Threats..."
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
