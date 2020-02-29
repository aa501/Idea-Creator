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

    submitConcept = () => {
        axios.post('/api/project/concept',
            {
                'conceptName': this.state.conceptName,
                'newsHeadline': this.state.newsHeadline,
                'customer': this.state.customer,
                'customerProblem': this.state.customerProblem,
                'promise': this.state.benefitPromise,
                'proof': this.state.proof,
                'price': this.state.price,
                'passion': this.state.passion,
                'deathThreats': this.state.deathThreats,
            },
          {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
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
                                placeholder="Enter the big idea for this concept..."
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
                                placeholder="Enter your customer for this concept..."
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
                                placeholder="Enter the customer problem you're trying to solve..."
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
                                placeholder="Enter what you're promising as a benefit to your customer..."
                                multiline
                                rows="2"
                                margin="normal"
                                variant="outlined">
                            </TextField>
                        </Col>
                        <Col md={{ span: 5, offset: 0 }} >
                          <TextField id="concept-field"
                              value={this.state.proof}
                              onChange={this.handleProofChange}
                              label="Proof"
                              multiline
                              rows="3"
                              margin="normal"
                              placeholder="Enter proof that your concept can work..."
                              variant="outlined">
                          </TextField>
                        </Col>                      </Row>
                      <Row>
                        <Col md={{ span: 6, offset: 0 }} >
                          <TextField id="concept-field"
                              value={this.state.price}
                              onChange={this.handlePriceChange}
                              label="Price"
                              placeholder="Enter your price for this concept..."
                              multiline
                              rows="2"
                              margin="normal"
                              variant="outlined">
                          </TextField>
                        </Col>
                      <Col md={{ span: 5, offset: 0 }} >
                        <TextField id="concept-field"
                            value={this.state.passion}
                            onChange={this.handlePassionChange}
                            label="Passion"
                            multiline
                            rows="3"
                            margin="normal"
                            placeholder="Enter your passion for this concept..."
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
                            placeholder="Enter any potential threats to the success of this project..."
                            variant="outlined">
                          </TextField>
                      </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 3, offset: 1 }}>
                            <div id='confirmation-button-holder'>
                                <Button color = 'warning' id='reset-fields' onClick={this.resetFields}><FontAwesomeIcon icon="undo" /> Reset</Button>
                                <Button color = 'primary' id='submit-concept' disabled = {this.state.projectName === ''} onClick={this.submitConcept}><FontAwesomeIcon icon="check" /> Submit</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
