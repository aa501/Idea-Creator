import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Slider, Select, MenuItem } from '@material-ui/core/';
import Grid from '@material-ui/core/Grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup } from '@material-ui/core/';
import { Button, Form, FormGroup, FormText, Label, Input, RadioButton } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import './SurveyQuestion.css';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default class SurveyQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData,
            projectName: this.props.location.state.projectName,
            questions: [],
            numQs: 0,

            textSub: '',
            ratingSub: '',
            checkSub: [],
            qstType: '',

            ratingMinNote: '',
            ratingMaxNote: '',
            ratingQuestion: '',
            ratingString: '',

            choices: ''
        }


        this.handleChange = this.handleChange.bind(this);
        this.renderResult = this.renderResult.bind(this);
        this.renderSubmitButton = this.renderSubmitButton.bind(this);
    }

    componentDidMount = () => {
        console.log(this.props)
    }

    checker = () => {
        console.log(this.props)
    }

    handleSubQuestionChange = (event) => {
        this.setState({
           subQuestion: event.target.value
        });
    }

    handleQstTypeChange = (event) => {
        this.setState({
           qstType: event.target.value
        });
    }

    handleRatingMin = (event) => {
        this.setState({
           ratingMinNote: event.target.value
        });
    }

    handleRatingMax = (event) => {
        this.setState({
           ratingMaxNote: event.target.value
        });
    }

    handleChoices = (event) =>
    {
        this.setState({
           choices: event.target.value
        });
    }

    resetFields = () => {
        this.setState({

          textSub: '',
          ratingSub: '',
          subQuestion: '',
          checkSub: [],

          ratingMinNote: '',
          ratingMaxNote: '',
          ratingQuestion: '',
          ratingString: '',

          choices: ''

        })
    }

    handleCloseErrorModal = () => {
      this.setState({
          errorModal: false
      });
    }

    openErrorModal = () => {
      this.setState({
          errorModal: true
      });
    }

    handleCloseSuccessModal = () => {
      this.setState({
          successModal: false
      });
    }

    openSuccessModal = () => {
      this.setState({
          successModal: true
      });
    }

    handleQuestion = (ques, type, i) => {
        console.log(ques)
        const questions = this.state.questions;
        questions[i] = ques + ' (' + type + ')';
        this.setState({
          questions: questions,
          numQs: this.state.numQs + 1
        });
    }


    viewProject = () => {
      return this.props.history.push({
          pathname: '/project-landing-page',
          state: this.state
      });
    }

    submitRatingQuestion = () => {
      axios.post('/api/project/submit-question',
      {
          'text': this.state.subQuestion,
          'type': this.state.qstType,
          'notes': this.state.ratingString.concat('min,', this.state.ratingMinNote, ',max,', this.state.ratingMaxNote),
          'archived': 'No'
      },
      {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
      }).then(() => {
          //this.openSuccessModal();
          this.handleQuestion(this.state.subQuestion, this.state.qstType, this.state.numQs);
          this.resetFields();
        }).catch(() => {
          this.openErrorModal();
          this.setState({
            errorMessage: 'Error: Question could not be created!'
          });
        });
      }

    submitTextQuestion = () => {
      axios.post('/api/project/submit-question',
      {
          'text': this.state.subQuestion,
          'type': this.state.qstType,
          'notes': 'none',
          'archived': 'No'
      },
      {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
        }).then(() => {
            //this.openSuccessModal();
            this.handleQuestion(this.state.subQuestion, this.state.qstType, this.state.numQs);
            this.resetFields();
          }).catch(() => {
            this.openErrorModal();
            this.setState({
              errorMessage: 'Error: Question could not be created!'
            });
          });
        }

    submitChoicesQuestion = () => {
      axios.post('/api/project/submit-question',
      {
          'text': this.state.subQuestion,
          'type': this.state.qstType,
          'notes': this.state.choices,
          'archived': 'No'
      },
      {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
        }).then(() => {
            //this.openSuccessModal();
            this.handleQuestion(this.state.subQuestion, this.state.qstType, this.state.numQs);
            this.resetFields();
          }).catch(() => {
            this.openErrorModal();
            this.setState({
              errorMessage: 'Error: Question could not be created!'
            });
          });
        }

    handleChange(e) {
      this.setState({ qstType: e.target.value });
    }

    renderQstDropdown() {
      return(
          <Select id="select" label="Type" className="col-md-8 col-offset-4" value={this.state.qstType} onChange={this.handleChange}>
                   <MenuItem value="Rating">Rating</MenuItem>
                   <MenuItem value="Text">Text</MenuItem>
                   <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                   <MenuItem value="Check All">Check All That Apply</MenuItem>
         </Select>
       )
    }

    renderSubmitButton() {
      if (this.state.qstType === "Text") {
          return(
          <Button color='primary'
            id='submit-question'
            disabled={this.state.subQuestion == ''}
            onClick={this.submitTextQuestion}>
          <FontAwesomeIcon icon="check" /> Submit Question</Button>
        )
      }
      if (this.state.qstType === "Multiple Choice" || this.state.qstType === "Check All") {
          return(
          <Button color='primary'
            id='submit-question'
            disabled={this.state.choices == '' || this.state.subQuestion == ''}
            onClick={this.submitChoicesQuestion}>
          <FontAwesomeIcon icon="check" /> Submit Question</Button>
        )
      }
      if (this.state.qstType === "Rating") {
          return(
          <Button color='primary'
            id='submit-question'
            disabled={this.state.ratingMinNote == '' || this.state.ratingMaxNote == '' || this.state.subQuestion == ''}
            onClick={this.submitRatingQuestion}>
          <FontAwesomeIcon icon="check" /> Submit Question</Button>
        )
      }
    }

    renderResult() {
      if (this.state.qstType === "Text") {
        return(
          <Container>
            <Row>
              <TextField id="text-field"
                  value={this.state.subQuestion}
                  onChange={this.handleSubQuestionChange}
                  label="Free Response Question"
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="Enter free response question here..."
                  variant="outlined">
                </TextField>
              </Row>
            </Container>
        )
      }
      if (this.state.qstType === "Multiple Choice") {
        return(
          <div>
            <Row>
              <TextField id="text-field"
                  value={this.state.subQuestion}
                  onChange={this.handleSubQuestionChange}
                  label="Multiple Choice Question"
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="Enter multiple choice question only here..."
                  variant="outlined">
              </TextField>
              <TextField id="text-field"
                  value={this.state.choices}
                  onChange={this.handleChoices}
                  label="Answer Choices (separate with commas)"
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="Answer Choices (separate with commas)"
                  variant="outlined">
              </TextField>
            </Row>
          </div>
        )
      }
      if (this.state.qstType === "Check All") {
        return(
          <div>
            <Row>
              <TextField id="text-field"
                  value={this.state.subQuestion}
                  onChange={this.handleSubQuestionChange}
                  label="Check All That Apply Question"
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="Enter check all question only here..."
                  variant="outlined">
              </TextField>
              <TextField id="text-field"
                  value={this.state.choices}
                  onChange={this.handleChoices}
                  label="Answer Choices (separate with commas)"
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="Answer Choices (separate with commas)"
                  variant="outlined">
              </TextField>
            </Row>
          </div>
        )
      }
      if (this.state.qstType === "Rating") {
        return(
          <div>
          <Row>
            <TextField id="text-field"
                value={this.state.subQuestion}
                onChange={this.handleSubQuestionChange}
                label="Question to Answer on a Scale"
                multiline
                rows="3"
                width="400px"
                height="100px"
                margin="normal"
                placeholder="Enter question here..."
                variant="outlined">
            </TextField>
          </Row>
          <Row>
            <TextField id="text-field2"
                  value={this.state.ratingMinNote}
                  onChange={this.handleRatingMin}
                  label="Label for Minimum (0)"
                  width="400px"
                  margin="normal"
                  placeholder="check"
                  variant="outlined">
            </TextField>
          </Row>
          <Row>
            <TextField id="text-field2"
                  value={this.state.ratingMaxNote}
                  onChange={this.handleRatingMax}
                  label="Label for Maximum (10)"
                  width="400px"
                  margin="normal"
                  placeholder="check"
                  variant="outlined">
            </TextField>
          </Row>
          </div>
        )
      }
    }

    render() {

        return (
            <div className='survey-question-container'>
              <Row>
                  <Col md={{ span: 3 }}>
                      <h3 className="page-title">Survey Question Editor</h3>
                  </Col>
                  <Col md={{ span: 2, offset: 5 }}>
                      <div id="conceptButton" align="right">
                          <Button id="opt" onClick={this.viewProject}><FontAwesomeIcon icon="arrow-left" />  Back to Project</Button>
                      </div>
                  </Col>
              </Row>
              <p></p>
                <Container>
                    <h4>Submit new questions for surveys.</h4>
                    <Row>
                    <Col md={{ span: 3, offset: 0 }} >
                    Choose Question Type: {this.renderQstDropdown()}
                    </Col>
                    <Col md={{ span: 5, offset: 0 }} >
                    <p>
                    {this.renderResult()}
                    </p>
                    </Col>
                    <p>
                      <Button color='warning' id='reset-fields' onClick={this.resetFields}><FontAwesomeIcon icon="undo" /> Reset</Button>
                      {this.renderSubmitButton()}
                    </p>
                    </Row>

                    <div>
                    <p><b>Questions Submitted this Session:</b></p>
                        {
                            this.state.questions.map(qsn => (
                              <p className="question-space">{this.state.numQs}. {qsn}</p>
                        ))
                        }
                    </div>
                </Container>
            </div>
        );
    }
}
