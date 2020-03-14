import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
            deathThreats: this.props.location.state.deathThreats,
            completedConcept: this.props.location.state.completedConcept,
            questions: [],
            answerQueue: '',
            answers: [],
            postAnswers: ''
        }
    }

    componentDidMount = () => {
        console.log(this.props)
        this.getQuestions();
    }

    componentWillMount = () => {
        this.getQuestions();
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

    handleAnswer = (event, i) => {
        console.log(event.target.value)
        this.setState({
            answerQueue: event.target.value
        });
        const answers = this.state.answers;
        answers[i] = event.target.value;
        this.setState({ answers });
    }


    submitConcept = () => {
        console.log(this.state.answers)

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
                'projectUid': this.state.projectName.uid,
                'answerList': this.state.answers
            },
          {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
        });
      }

    getQuestions = async () => {
        const response = await axios.get('/api/project/questions', {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
            }
        }).then(response => {
            response = response.data;
            this.setState({
                questions: response,
                test: response.length
            });
        });
    }

    nextPage = () => {
        this.props.history.push({
            pathname: '/concept',
            state: this.state  // need this for moving to different component
        });
    }

    render() {

        return (
            <div className='concept-question-container'>

                <Row>
                    <Col md={{ span: 3 }}>
                        <h3 className="page-title">Concept Question</h3>
                    </Col>
                    <Col md={{ span: 2, offset: 5 }}>
                        <div id="conceptButton" align="right">
                            <Button id="opt" onClick={this.nextPage}><FontAwesomeIcon icon="arrow-left" />  Concept Definition</Button>
                        </div>
                    </Col>
                </Row>
                <Container>
                    <h4>Answer all that may apply.</h4>
                    <div>
                        {
                            this.state.questions.map(qsn => (
                            <div>
                                    <div key={`qText${qsn.id}`}>{qsn.text}</div>
                                    <TextField key={`qsn${qsn.id}`}
                                        onChange={(event) => this.handleAnswer(event, `${qsn.id}`)}
                                        multiline
                                        rows="3"
                                        fullWidth
                                        variant="outlined">
                                    </TextField>
                            </div>
                        ))
                        }
                    </div>
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
                                <Button color='success' id='submit-concept' disabled={this.state.conceptName == undefined} onClick={this.submitConcept}><FontAwesomeIcon icon="angle-double-right" /> Submit</Button>

                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
