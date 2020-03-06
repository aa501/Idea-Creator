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
import './ConceptQuestion.css';



export default class ConceptQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: this.props.location.state.projectName,
            userData: this.props.location.state.userData || this.props.userData,
            conceptName: this.props.location.state.conceptName,
            newsHeadline: this.props.location.state.newsHeadline,
            customer: this.props.location.state.customer,
            customerProblem: this.props.location.state.customerProblem,
            benefitPromise: this.props.location.state.benefitPromise,
            proof: this.props.location.state.proof,
            price: this.props.location.state.price,
            passion: this.props.location.state.passion,
            deathThreats: this.props.location.state.deathThreats
        }
    }

    componentDidMount = () => {
        console.log(this.props)
    }

    resetFields = () => {
        this.setState({
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
                'projectUid': this.state.projectName.uid
            },
          {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
        });
    }

    render() {
        const elements = ['one', 'two', 'three'];

        const items = []

        for (const [index, value] of elements.entries()) {
            items.push(<li key={index}>{value}</li>)
        }

        return (
            <div className='concept-question-container'>
                <div>
                    {items}
                </div>
                <h3 className="page-title">Concept Questions</h3>
                <Container>
                    <Row>
                        <Col md={{ span: 3, offset: 0 }}>
                            <div id='project-id-holder'>
                                Project: <input type="text" disabled='true' class="form-control" id="projectId-input" value={this.state.projectName.title} />
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
                                <Button color='primary' id='submit-concept' onClick={this.submitConcept}><FontAwesomeIcon icon="check" /> Submit</Button>

                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
