import React, { Component } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { RadioGroup, FormControlLabel, Radio, Checkbox, FormControl, FormLabel, CircularProgress } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Grid from '@material-ui/core/Grid';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SurveyLandingPage.css';

const useStyles = makeStyles(theme => ({
  toggleContainer: {
    margin: theme.spacing(2, 0),
  },

  toggleStyles: {
    borderColor: 'rgb(51, 153, 255)',
    width: '50px'
  },

  root: {
  display: 'flex',
  },

  formControl: {
    margin: theme.spacing(3),
  },
}));

function getStringSection (str, d) {
  if (str !=  null) {
    var result = str.split(',');
    return result[d]
  }
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default class SurveyLandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subQuestion: '',
            qstType: '',
            survey: [],
            answers: [],
            ratings: [],
            questions: [],
            electedQuestions: [],
            checkedHold: [],
            surveyCode: '',
            retrieved: false,
            completed: false,
            length: 0,
            demographics: '',
        }
    }

    handleSurveyCode = (event) => {
      console.log(event.target.value);
      this.setState({ surveyCode: event.target.value });
    }

    /* Todo: Change controller to pull only relevant questions based on a unique survey code.
       Requirements: Change api link in both this file and the controller with {uid} */
    getSurvey = async () => {
        this.setLoading(true);
        const response = await axios.get(`/api/survey/${this.state.surveyCode}/retrieve`, {
        }).then(response => {
          response = response.data;
          if (response.length > 0) {
            this.setState({
                survey: response[0],
            }, () => (this.verifySurvey()));
          }
          else {
            this.openErrorModal();
            this.setState({
              errorMessage: 'No survey was found with that code.'
            }, () => (this.setLoading(false)));
          }
      }).catch(() => {
          this.openErrorModal();
          this.setState({
            errorMessage: 'Error loading survey. Please contact your system administrator.'
          });
        });
    }

    verifySurvey = async () => {
      console.log(this.state.survey)
      if (this.state.survey.status.includes("Deployed"))
      {
        this.getQuestions();
      }

      else if (!this.state.survey.status.includes("Deployed")) {
        console.log(this.state.survey.status);
        this.openErrorModal();
        this.setState({
          errorMessage: 'This survey is currently closed to responses.'
        });
      }
    }

    getQuestions = () => {
      console.log("running");
      const survey = this.state.survey;
      var questions = JSON.parse(survey.questions);
      var electedQuestions = questions.sort((a, b) => (a.demographic > b.demographic) ? -1 : 1)

      this.setState({ questions, electedQuestions, retrieved: true, length: electedQuestions.length }, () =>
      (console.log("Question length: " + this.state.electedQuestions.length)));
      this.setLoading(false);
    }

    getPrototypes = () => {

    }

    /* Submits answer list to the controller */
    submitAnswers = async () => {
        var completedAnswerCount = 0
        const answers = this.state.answers;
        answers.forEach(function(answer) {
          if (answer.replace(/\s/g, '').length && answer != null)
          completedAnswerCount += 1;
        })
        console.log(completedAnswerCount)

        if (completedAnswerCount == this.state.electedQuestions.length)
        {
            axios.post(`/api/survey/post-answers`,
                  {
                      'surveyUid': this.state.survey.uid,
                      'answerList': this.state.answers,
                      'turk': false,
                      'demographics': this.state.demographics
                  },
            ).then(() => {
                this.reset();
            }).catch(() => {
              this.openErrorModal();
              this.setState({
                errorMessage: 'Survey could not be submitted.'
              });
            });
        }

        else {
          this.openErrorModal();
          this.setState({
            errorMessage: 'Not all questions have been answered.'
          });
        }
      }

    /* Calls two functions to handle the rating React element and add the answer to the answers array */
    handleRatingMaster = (event, i) => {
      this.handleRating(event, i);
      this.handleAnswer(event, i);
    }

    /* Updates the values for all toggle buttons in a rating question group  */
    handleRating = (event, i) => {
      const ratings = this.state.ratings;
      ratings[i] = event.target.value;
      this.setState({ ratings });
    }

    /* Calls two functions to handle the MC React element and add the answer to the answers array */
    handleRadioMaster = (event, i) => {
      this.handleRadio(event);
      this.handleAnswer(event, i);
    }

    /* Updates the values for all radio buttons in a multiple choice answer group  */
    handleRadio = (event) => {
      this.setState({
        radio: event.target.value
      });
    }

    /* Updates the answers array with new answers (used for all except check questions)  */
    handleAnswer = (event, i) => {
        this.setState({
            answerQueue: event.target.value
        });
        const answers = this.state.answers;
        answers[i] = event.target.value;
        this.setState({ answers }, () =>
        (console.log(this.state.answers)));
    }

    handleCloseErrorModal = () => {
      this.setState({
          errorModal: false,
          learnModal: false,
          questionModal: false,
          oldQuestionModal: false,
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

    handleOpenConfirmationModal = () => {
      this.setState({
        confirmationModal: true
      });
    }

    handleCloseConfirmationModal = () => {
      this.setState({
        confirmationModal: false
      });
    }

    setLoading = (value) => {
      this.setState({ loading: value })
    }

    reset = () => {
      this.setState({
        subQuestion: '',
        qstType: '',
        answers: [],
        survey: [],
        ratings: [],
        questions: [],
        electedQuestions: [],
        checkedHold: [],
        surveyCode: '',
        successModal: false,
        retrieved: false,
        completed: true,
        length: 0,
        demographics: '',
      });
    }

    /* Updates the values for all check boxes in a check all answer group  */
    handleChecked(event, i) {
      const item = event.target.name;
      const isChecked = event.target.checked;
      var checkedArray;

      if (this.state.answers[i] == null) {
        checkedArray = this.state.checkedHold;
      }
      else {
        checkedArray = this.state.answers[i];
      }
      const finalArray = [];

      if (isChecked == true) {
        checkedArray.push(item)
        this.setState({ checkedHold: checkedArray }, () =>
        (this.addCheckedAnswer(checkedArray, i)));
      }

      else {
        var newArray = [];
        newArray = checkedArray.filter(el => el !== item)
        this.setState({ checkedHold: newArray }, () =>
        (this.addCheckedAnswer(newArray, i)));
      }

      this.setState({checkedHold: []});
    }

    /* Adds checked answers to the answers array  */
    addCheckedAnswer(arr, i) {
      const answers = this.state.answers;
      answers[i] = arr;
      this.setState({ answers }, () =>
      (console.log(this.state.answers)));
    }

    /* Renders the HTML for each question type  */
    renderQuestion(qsn) {

        const toggleStyles = {
          width: "50px",
          textColor: "rgb(51, 153, 255)",
          borderWidth: "2px",
          borderColor: "rgb(51, 153, 255)"
        };

      var type = qsn.type;
      if (type === "Text" || type === "Concept") {
        return(
          <Container>
            <Row>
              <TextField id="text-field"
                  onChange={(event) => this.handleAnswer(event, `${qsn.id}`)}
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="Your answer..."
                  variant="outlined">
                </TextField>
              </Row>
            </Container>
        )
      }
      if (type === "Multiple Choice") {
        return(
          <div>
            {this.createAnswerChoiceArray(qsn, "mc")}
          </div>
        )
      }
      if (type === "Check All") {
        return(
          <div>
            {this.createAnswerChoiceArray(qsn, "ca")}
          </div>

        )
      }
      if (type === "Rating") {
        return(
          <div class="rating-div">
          <Grid container direction="column" justify="center" alignItems="stretch" spacing={2}>
            <Grid item>
            </Grid>
            <Grid item>
              <div align="center">
                <ToggleButtonGroup
                  value={this.state.ratings[qsn.id]}
                  exclusive
                  onChange={(event) => this.handleRatingMaster(event, `${qsn.id}`)}
                  aria-label="text alignment">
                    <ToggleButton key={0} style={ toggleStyles } value="0"><b>0</b></ToggleButton>
                    <ToggleButton key={1} style={ toggleStyles } value="1"><b>1</b></ToggleButton>
                    <ToggleButton key={2} style={ toggleStyles } value="2"><b>2</b></ToggleButton>
                    <ToggleButton key={3} style={ toggleStyles } value="3"><b>3</b></ToggleButton>
                    <ToggleButton key={4} style={ toggleStyles } value="4"><b>4</b></ToggleButton>
                    <ToggleButton key={5} style={ toggleStyles } value="5"><b>5</b></ToggleButton>
                    <ToggleButton key={6} style={ toggleStyles } value="6"><b>6</b></ToggleButton>
                    <ToggleButton key={7} style={ toggleStyles } value="7"><b>7</b></ToggleButton>
                    <ToggleButton key={8} style={ toggleStyles } value="8"><b>8</b></ToggleButton>
                    <ToggleButton key={9} style={ toggleStyles } value="9"><b>9</b></ToggleButton>
                    <ToggleButton key={10} style={ toggleStyles } value="10"><b>10</b></ToggleButton>
                </ToggleButtonGroup>
              </div>
              </Grid>
                <Grid item>
                  <Row>
                    <Col xs="6"><div text-align="left">{this.getRatingParam(qsn.notes, 0)}</div></Col>
                    <Col xs="6"><div class="testing">{this.getRatingParam(qsn.notes, 1)}</div></Col>
                  </Row>
                </Grid>
              </Grid>
              </div>
        )
      }
    }

    getRatingParam(arr, end) {
      var choices = arr;
      var convertString = JSON.parse(choices);
      console.log(convertString);
      var i = 0;
      var newArray = [];

      while (convertString[i] != null) {
        newArray.push(convertString[i]);
        i++;
      }

      return (newArray[end])
    }

    /* Renders answer choices for either multiple choice or check all questions  */
    createAnswerChoiceArray(qsn, type) {
      var choices = qsn.notes;
      var convertString = JSON.parse(choices);
      console.log(convertString);
      var i = 0;
      var newArray = [];

      while (convertString[i] != null) {
        newArray.push(convertString[i]);
        i++;
      }

      if (type == "mc") {
        return (
          <div>
            <Row>
              <RadioGroup name="customized-radios" value={this.state.radio} style={{ marginLeft: "20px" }} onChange={(event) => this.handleRadioMaster(event, `${qsn.id}`)}>
              {
                  newArray.map(choice => (
                  <div>
                        <FormControlLabel value={choice} control={<Radio color="primary" />} label={choice} />
                  </div>
              ))
              }
              </RadioGroup>
            </Row>
          </div>
        )
      }

      if (type == "ca") {
        return (
          <div>
            {
                newArray.map(choice => (
                  <Row>
                      <FormControlLabel control={<Checkbox color="teal" name={choice}  style={{ marginLeft: "20px" }} checked={this.state.checked} onChange={(event) => this.handleChecked(event, `${qsn.id}`)}/>}
                              label={choice} labelPlacement="end"/>
                  </Row>
               ))
            }
          </div>
                )
      }
    }

    renderSurvey () {

      if (this.state.survey) {
          return (
          <div class="d-flex align-content-justify flex-column">
                  <div align="center"><h3>Survey Question View</h3></div>
                  <hr />
                  {this.state.survey.notes}
                <p></p>
                  <Container>
                  <div>
                      {
                          this.state.electedQuestions.map(qsn => (
                          <div>
                                  <div key={`q${qsn.type},${qsn.id}`}>{qsn.text}</div>
                                  {this.renderQuestion(qsn)}
                                  <p><hr id="hr-3" /></p>

                          </div>
                      ))
                      }
                  </div>
                  </Container>
                  <Container>
                    <div class="d-flex align-content-justify flex-column">
                      <div align="right">
                      <Button color='danger' id='submit-survey' onClick={this.handleOpenConfirmationModal}><FontAwesomeIcon icon="times" /> Cancel Response</Button>
                      <Button color='success' id='submit-survey' onClick={this.submitAnswers}><FontAwesomeIcon icon="angle-double-right" /> Submit Response</Button>
                      </div>
                    </div>
                  </Container>
            </div>
          )
        }
    }

    render() {

        return (
          <div style={{width: "100%"}}>
              <div hidden={this.state.retrieved || this.state.completed} class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>

                  <Container>
                      <div align="center" class="d-flex align-content-justify flex-column">
                          <h3>IP Creator Survey Hub</h3>
                          <hr />
                          <h5>Enter your unique Survey code here:</h5>

                          <div align="center"><TextField variant="outlined" placeholder='IP0000000' value={this.state.surveyCode} onChange={this.handleSurveyCode} inputProps={{ style: {textAlign: 'center', width: "300px"} }}/>
                          <Button id="submit-code" color="primary" onClick={this.getSurvey}>Take Survey</Button></div>

                      </div>
                  </Container>
              </div>

                <div hidden={this.state.completed || !this.state.retrieved} class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>
                  {this.renderSurvey()}
                </div>

                <div hidden={!this.state.completed} class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>
                    <Container>
                        <div align="center" class="d-flex align-content-justify flex-column">
                            <h3>Thank you for your response!</h3>
                            <hr />
                            <h5>Click here to take another survey:</h5>
                            <div width="100px"><Button id="submit-code" color="primary" onClick={() => window.location.reload(false)}>Take a New Survey</Button></div>
                        </div>
                    </Container>
                </div>

                  <div>
                    <Dialog
                      open={this.state.errorModal}
                      TransitionComponent={Transition}
                      keepMounted
                      maxWidth='lg'
                      aria-labelledby="alert-dialog-slide-title"
                      aria-describedby="alert-dialog-slide-description"
                    >
                      <DialogTitle id="responsibe-alert-dialog-slide-title">
                        {this.state.errorMessage}
                      </DialogTitle>
                      <DialogActions>
                      <Button onClick={this.handleCloseErrorModal} color="primary">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>

                  <div>
                    <Dialog
                      open={this.state.successModal}
                      TransitionComponent={Transition}
                      keepMounted
                      maxWidth='lg'
                      aria-labelledby="alert-dialog-slide-title"
                      aria-describedby="alert-dialog-slide-description"
                    >
                      <DialogTitle id="responsibe-alert-dialog-slide-title">
                        {this.state.successMessage}
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={this.reset} color="primary">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>

                  <div>
                    <Dialog
                      open={this.state.confirmationModal}
                      TransitionComponent={Transition}
                      keepMounted
                      maxWidth='lg'
                      aria-labelledby="alert-dialog-slide-title"
                      aria-describedby="alert-dialog-slide-description"
                    >
                      <DialogTitle id="responsibe-alert-dialog-slide-title">
                        Are you sure you want cancel your response?
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={this.handleCloseConfirmationModal} color="primary">Continue with Survey</Button>
                        <Button onClick={() => window.location.reload(false)} color="danger">Cancel Response</Button>
                      </DialogActions>
                    </Dialog>
                  </div>

                  <Dialog open={this.state.loading}
                      style={{backgroundColor: 'transparent'}}
                      maxWidth="lg">
                      <div style={{overflow: 'hidden'}}>{"   "}<CircularProgress/>{"   "}</div>
                  </Dialog>

              </div>


        );
    }
}
