import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Container, Row, Col, FormGroup, InputGroup, Form, Button, Card, Alert } from 'react-bootstrap';
import { Input } from 'reactstrap';
import { Chip, List, ListSubheader, ListItem, ListItemText, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Checkbox, RadioGroup, FormControlLabel, Radio, TextareaAutosize, CircularProgress } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import axios from 'axios';
import Slide from '@material-ui/core/Slide';
import './NewSurvey.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const useStyles = makeStyles({
  table: {
    minWidth: 1000,
  },
});

export default class NewSurvey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData || this.props.userData,
            projectName: this.props.location.state.projectName,
            uniqueId: 'IP' + Math.floor(Math.random() * 10000000).toString(),
            loading: false,
            surveyName: '',
            questions: [],
            pulledQuestions: [],
            chosenQuestions: [],
            finalQuestionSet: [],
            concepts: [],
            prototypes: [],
            warning: '',
            chosenPrototype: '',
            questionDialog: false,
            conceptDialog: false,
            prototypeDialog: false,
            pricingOptionId: null,
            idea: false,
            package: false,
            product: false,
            name: false,
            purchaseFrequency: false,
            purchasePrice: false,
            qualitative: false,
            demographics: false,

            numQs: 0,

            textSub: '',
            ratingSub: '',
            qstType: '',

            ratingMinNote: '',
            ratingMaxNote: '',
            ratingQuestion: '',
            ratingArray: [],

            choices: '',
            choiceArray: [],
        }
    }

    componentDidMount = () => {
        console.log(this.props);
    }

    getQuestions = async () => {
      const response = await axios.get('/api/survey/get-survey-questions', {
          headers: {
              Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
          }
      }).then(response => {
            response = response.data;
            this.setState({
                pulledQuestions: response,
                test: response.length
            });
        }).catch(() => {
          console.log("oops");
        });
    }

    getPrototypes = async () => {
      this.setLoading(true);
      await console.log(this.state.projectName.uid);
      var uid = await this.state.projectName.uid;
      const response = await axios.get(`/api/prototype/${uid}/`, {
          headers: {
              Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
          }
      }).then(response => {
            response = response.data;
            this.setState({
                prototypes: response,
                test: response.length
            }, () => (console.log(response)));
        }).catch((e) => {
          console.log(e);
        });
      await this.setLoading(false);
      await this.setState({
        prototypeDialog: true
      });
    }

    returnToDashboard = () => {
        this.props.history.push({
            pathname: '/surveys',
            state: this.props.location.state
        })
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
          ratingArray: [],
          numOptions: 0,
          choices: '',
          choiceArray: []

        })
    }

    submitNewQuestion = () => {
      var notes;

      if (this.state.qstType === "Text")
      {
        notes = "none"
      }
      if (this.state.qstType === "Multiple Choice" || this.state.qstType === "Check All")
      {
        notes = JSON.stringify(this.state.choiceArray)
      }
      if (this.state.qstType === "Rating")
      {
        notes = JSON.stringify(this.state.ratingArray)
      }

      axios.post('/api/project/submit-question',
      {
          'text': this.state.subQuestion,
          'type': this.state.qstType,
          'notes': notes,
          'archived': 'No'
      },
      {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
        }).then(() => {
            //this.openSuccessModal();
            this.handleQuestion(this.state.subQuestion, this.state.qstType);
            this.resetFields();
            this.getQuestions();
            this.addNewQuestions();
          }).catch(() => {
            this.openErrorModal();
            this.setState({
              errorMessage: 'Error: Question could not be created!'
            });
          });
    }

    saveSurvey = () => {
        var test = this.validateSurvey();
        if (test == false) {
          this.openErrorModal();
          this.setState({
            errorMessage: 'You are missing a parts of your survey!'
          });
        }

        if (test == true) {
        //let survey = this.buildSurveyPayload();
        axios.post('/api/survey', {
             'surveyName': this.state.surveyName,
             'uniqueId': this.state.uniqueId,
             'projectUid': this.state.projectName.uid,
             'prototypeUid': this.state.chosenPrototype.uid,
             'conceptUid': '',
             'notes': '',
             'qualifications': '',
             'questions': JSON.stringify(this.state.finalQuestionSet),
             'status': 'Written',
             'EndDate': '20200501'
            },
            {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
          }).then(() => {
              //this.openSuccessModal();
              this.openSuccessModal();
              this.setState({
                successMessage: 'Survey' + ' ' + this.state.surveyName + ' was saved!'
              }, () => (this.returnToDashboard()));
            }).catch(() => {
              this.openErrorModal();
              this.setState({
                errorMessage: 'Error: Survey could not be saved!'
              });
            });
        }
    }

    resetNewQuestions = () => {
      this.setState({ questions: [] })
    }

    handleRatingMin = (event) => {
      this.setState({ ratingMinNote: event.target.value });
      const ratingArray = this.state.ratingArray;
      ratingArray[0] = event.target.value;
      this.setState({ ratingArray });
    }

    handleRatingMax = (event) => {
      this.setState({ ratingMaxNote: event.target.value });
      const ratingArray = this.state.ratingArray;
      ratingArray[1] = event.target.value;
      this.setState({ ratingArray });
    }

    handleChoices = (event) => {
      this.setState({choices: event.target.value});
    }

    handleChange(e) {
      this.setState({ qstType: e.target.value });
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

    handleQuestion = (ques, type) => {
        this.getQuestions();
        console.log(ques)
        const questions = this.state.questions;
        var form = {
          question: ques,
          type: type
        }
        questions.push(form);
        this.setState({
          questions: questions,
        });
    }


    viewProject = () => {
      return this.props.history.push({
          pathname: '/project-landing-page',
          state: this.state
      });
    }

    surveySample = () => {
      return this.props.history.push({
          pathname: '/survey'
      });
    }

    save = () => {

    }

    saveAndPreview = () => {
        this.saveSurvey(this.preview);
    }

    preview = (survey) => {
        alert('Preview Code');
    }

    saveAndEmail = () => {
        this.saveSurvey(this.emailSurvey);
    }

    emailSurvey = (survey) => {
        axios.post('/api/survey/email', {
            surveyId: survey.id
        },
            {
                headers: {
                    Authorization: 'Bearer ' + this.state.userData.token
                }
            }).then(response => {

            }).catch(err => {

            });
    }

    turkSurvey = (survey) => {
        axios.post('/api/survey/turk', {
            surveyId: survey.id
        },
            {
                headers: {
                    Authorization: 'Bearer ' + this.state.userData.token
                }
            }).then(response => {

            }).catch(err => {

            });
    }

    saveAndTurk() {
        this.saveSurvey(this.turkSurvey);
    }

    validateSurvey = () => {
        if (this.state.surveyName && this.state.chosenPrototype)
            return true;

        return false;
    }

    handleSurveyNameChange = (event) => {
        this.setState({
            surveyName: event.target.value
        });
    }

    setLoading = (value) => {
      this.setState({ loading: value })
    }

    cancel = () => {
        this.props.history.push({
            pathname: '/surveys',
            state: { userData: this.state.userData }
        });
    }

    questionDialogClose = () => {
        this.setState({ questionDialog: false});
    }

    addConcept = () => {
        this.setState({ conceptDialog: true });
    }

    addPrototype = () => {
        this.setState({ prototypeDialog: true });
    }

    conceptDialogClose = () => {
        this.setState({ conceptDialog: false });
    }

    prototypeDialogClose = () => {
        this.setState({ prototypeDialog: false });
    }

    pricingOptionChanged = (evt) => {
        this.setState({ pricingOptionId: evt.value });
    }

    ideaChanged = (evt) => {
        this.setState({ idea: !this.state.ideaChanged });
    }

    packageChanged = (evt) => {
        this.setState({ package: !this.state.packageChanged });
    }

    productChanged = (evt) => {
        this.setState({ product: !this.state.productChanged });
    }

    nameChanged = (evt) => {
        this.setState({ name: !this.state.nameChanged });
    }

    purchaseFrequencyChanged = (evt) => {
        this.setState({ purchaseFrequency: !this.state.purchaseFrequency });
    }

    purchasePriceChanged = (evt) => {
        this.setState({ purchasePrice: !this.state.purchasePrice });
    }

    demographicsChanged = (evt) => {
        this.setState({ dedmographics: !this.state.demographics });
    }

    openQuestionBank = async (event) => {
        await this.setLoading(true);
        await this.getQuestions();
        await this.addNewQuestions();
        await this.setState({ questionDialog: true});
        await this.setLoading(false);
    }

    openQuestionEditorModal = (event) => {
        this.setState({ questionEditorModal: true })
    }

    closeQuestionEditorModal= () => {
        this.resetFields();
        this.setState({ questionEditorModal: false });
    }

    handleSubQuestionChange = (event) => {
        this.setState({
           subQuestion: event.target.value
        });
    }

    handleViewProgress = () => {
      this.setState({
        viewProgress: !this.state.viewProgress
      });
    }

    choosePrototype = (choice) => {
      this.setState({
        chosenPrototype: choice
      }, () => (console.log(this.state.chosenPrototype)));
    }

    resetPrototype = () => {
      this.setState({
        chosenPrototype: ''
      });
    }

    copyToClipboard = () => {
        /* Get the text field */
        var copyText = document.getElementById("surveyId");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
    }

    finalizeSurvey = () => {
      var chosenQuestions = this.state.chosenQuestions;
      var pulledQuestions = this.state.pulledQuestions;
      var finalArray = [];
      chosenQuestions.forEach(function(id){
          var tracker = 0;
          console.log("Searching for: " + typeof(id) + " " + id)
          const found = pulledQuestions.filter(obj => {return obj.id === parseInt(id)})
          finalArray.push(found[0]);
          tracker += 1;
        });
      if (chosenQuestions.length > 0) {
        this.setState({
             finalQuestionSet: finalArray
          }, () => (console.log(this.state.finalQuestionSet)));
      }
      else {
        this.setState({
             finalQuestionSet: []
          }, () => (console.log(this.state.finalQuestionSet)));
      }
    }

    addChoice = () => {
      console.log(this.state.choices)
      const choices = this.state.choices;
      const choiceArray = this.state.choiceArray;
      choiceArray.push(choices);
      this.setState({ choiceArray }, () => {console.log(this.state.choiceArray)});
    }

    checkChosenArray(id) {
      var result = this.state.chosenQuestions.includes(id.toString());
      if (result == true)
      {
        return true;
      }
      return false;
    }

    renderQuestions = () => {
      const finalQuestionSet = this.state.finalQuestionSet;
      if (finalQuestionSet.length > 0) {
        return (
          finalQuestionSet.map(obj => {
          return (
            <div>
              <p>
              <Row>
              <Col xs={2}><Chip size="sm" label={obj.type}/></Col>
              <Col>{"   "}{obj.text}</Col>
              </Row>
              </p>
            </div>
            )
          })
        )
      }
      else {
        return (
          <div>
          <h6>Your chosen questions will appear here.</h6>
          </div>
        )
      }
    }

    addNewQuestions = async () => {
      const pulledQuestions = this.state.pulledQuestions;
      const chosenQuestions = this.state.chosenQuestions;
      var questions = this.state.questions;
      var cutQuestions = [];

      questions.forEach(function(item) {
        console.log(item.question);
        cutQuestions.push(item.question);
      })

      pulledQuestions.forEach(function(qsn) {
        if (cutQuestions.includes(qsn.text) && !chosenQuestions.includes(qsn.id.toString()))
        {
          chosenQuestions.push(qsn.id.toString());
          console.log(chosenQuestions);
        }
      });

      await this.setState({ chosenQuestions }, () => (this.finalizeSurvey()));
      await this.finalizeSurvey();
    }

    handleChecked(event, i) {
      const item = event.target.name;
      const isChecked = event.target.checked;
      const checkedArray = this.state.chosenQuestions;
      var chosenQuestions = [];

      if (isChecked == true) {
        checkedArray.push(item)
        chosenQuestions = checkedArray;
      }

      else {
        var newArray = [];
        newArray = checkedArray.filter(el => el !== item)
        chosenQuestions = newArray;
      }

      this.setState({ chosenQuestions }, () => this.finalizeSurvey());
    }

    renderQstDropdown() {
      return(
          <Select id="select" label="Type" className="col-md-8 col-offset-4" value={this.state.qstType} onChange={(e) => this.handleChange(e)}>
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
            disabled={this.state.subQuestion == ''}
            onClick={this.submitNewQuestion}>
          <FontAwesomeIcon icon="check" /> Submit Question</Button>
        )
      }
      if (this.state.qstType === "Multiple Choice" || this.state.qstType === "Check All") {
          return(
          <Button color='primary'
            disabled={this.state.choices == '' || this.state.subQuestion == ''}
            onClick={this.submitNewQuestion}>
          <FontAwesomeIcon icon="check" /> Submit Question</Button>
        )
      }
      if (this.state.qstType === "Rating") {
          return(
          <Button color='primary'
            disabled={this.state.ratingMinNote == '' || this.state.ratingMaxNote == '' || this.state.subQuestion == ''}
            onClick={this.submitNewQuestion}>
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
            <Col>
            <FormGroup>
              <TextField id="text-field"
                  value={this.state.subQuestion}
                  onChange={this.handleSubQuestionChange}
                  label="Multiple Choice Question"
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="Enter multiple choice question here..."
                  variant="outlined">
              </TextField>
            </FormGroup>
            </Col>
            <Col>
              <TextField
                  value={this.state.choices}
                  onChange={this.handleChoices}
                  label="Add Answer Choice"
                  width="375px"
                  margin="normal"
                  placeholder="Add Answer Choice"
                  variant="outlined">
              </TextField>
              <Button id ="add-button" variant="success" onClick={() => this.addChoice()}><FontAwesomeIcon icon="plus" /></Button>
            </Col>
            </Row>
            <FormGroup>
              <p><b> Your Answers: </b></p>
              {
                  this.state.choiceArray.map(c => (
                    <p className="question-space">{c}</p>
              ))
              }
            </FormGroup>
          </div>
        )
      }
      if (this.state.qstType === "Check All") {
        return(
          <div>
            <FormGroup>
              <TextField id="text-field"
                  value={this.state.subQuestion}
                  onChange={this.handleSubQuestionChange}
                  label="Multiple Choice Question"
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="Enter check all that apply question here..."
                  variant="outlined">
              </TextField>
            </FormGroup>
            <FormGroup>
              <TextField
                  value={this.state.choices}
                  onChange={this.handleChoices}
                  label="Add Answer Choice"
                  width="375px"
                  margin="normal"
                  placeholder="Add Answer Choice"
                  variant="outlined">
              </TextField>
              <Button id ="add-button" variant="success" onClick={() => this.addChoice()}><FontAwesomeIcon icon="plus" /></Button>
            </FormGroup>
            <FormGroup>
              <p><b> Your Answers: </b></p>
              {
                  this.state.choiceArray.map(c => (
                    <p className="question-space">{c}</p>
              ))
              }
            </FormGroup>
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
            <div class="mx-auto shadow my-5 p-3">
                <Container>
                    <div class="d-flex align-content-between flex-column">
                        <h3>Survey Builder</h3>
                        <hr id="hr-3" />
                        <FormGroup>
                            Unique Survey ID: <h5>{this.state.uniqueId}</h5>
                          {/*  <Button variant="primary" onClick={this.copyToClipboard}><FontAwesomeIcon icon="share-square" /> Share Link</Button> */}
                        </FormGroup>
                        <FormGroup>
                            <h5>1. Name Your Survey</h5>
                            <TextField id="name" variant="outlined" onChange={this.handleSurveyNameChange} fullWidth value={this.state.surveyName} label="Survey Name (Respondents will not see this name)" />
                        </FormGroup>
                        <FormGroup>
                            <h5>2. If using MTurk, add demographics here.</h5>
                            <TextField variant="outlined" fullWidth label="Survey Demographics" multiline rows={3} placeholder="Survey comments" />

                        </FormGroup>

                        <FormGroup>
                               <h5>3. Add Concept</h5>
                                {/*    <Alert variant="info">
                                        Please click the proper button below for the format you would like to test your idea as.
                                    </Alert> */}
                                    <div className="d-flex flex-wrap justify-content-around">
                                      {/*  <Button variant="success">
                                            Add a WRITTEN CONCEPT (Yellow Card)
                                        </Button> */}
                                        <Button onClick={this.getPrototypes} variant="primary">
                                            Add Concept Prototype Image
                                        </Button>
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-around">
                                      <div hidden={!this.state.chosenPrototype}><b><i>Prototype chosen!</i></b></div>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <h5>4. Add Questions</h5>
                                    <Alert variant="info">
                                        Please click any button below to add questions to your survey.
                                    </Alert>
                                    <div className="d-flex flex-wrap justify-content-around">
                                      <Button variant="warning" onClick={this.openQuestionBank}><FontAwesomeIcon icon="upload" /> Load Survey</Button>
                                      <Button variant="warning" onClick={this.openQuestionBank}><FontAwesomeIcon icon="wrench" /> Choose Questions</Button>
                                      <Button variant="warning" onClick={this.openQuestionEditorModal}><FontAwesomeIcon icon="pen" /> Create Question</Button>
                                      <Button variant="primary" onClick={this.handleViewProgress}><FontAwesomeIcon icon="list" /> View Current </Button>
                                    </div>
                                </FormGroup>
                                <div hidden={this.state.viewProgress}>
                                  <Container>
                                    <hr />
                                    {this.renderQuestions()}
                                    <hr />
                                  </Container>
                                </div>
                                <FormGroup>
                                    <h5>5. Survey Comments (Optional)</h5>
                                        <p>This space is here to preface your survey to users before they take it.</p>
                                        <TextField variant="outlined" fullWidth label="Survey Comments" multiline rows={3} placeholder="Survey comments" />
                                </FormGroup>
                                <FormGroup>
                                    <h2>Connect Research with Innovation Projects</h2>
                                    <p>Select Projects: The project team will have access to this test.</p>
                                    <p>Hold the control key(windows) or command key (mac) to select multiple</p>
                                </FormGroup>
                    <div class="d-flex justify-content-around flex-row">
                            <Button variant="danger" onClick={this.cancel} >Cancel</Button>
                            <span>
                                <Button variant="success" onClick={this.saveSurvey}>Save and Exit</Button>
                              {/*  <Button variant="success" onClick={this.finalizeSurvey}>Save and Preview Survey</Button>
                                <Button variant="success" onClick={this.saveAndTurk}>Save and Collect Live</Button> */}
                            </span>
                        </div>
                    <Dialog
                    open={this.state.questionDialog}
                    maxWidth='xl' >
                            <DialogContent dividers>
                                <div><h5>Check all questions that you would like to include in your survey.</h5></div>
                                <div>
                                      <TableContainer component={Paper}>
                                        <Table size="small" aria-label="a dense table">
                                          <TableHead>
                                            <TableRow>
                                              <TableCell></TableCell>
                                              <TableCell>Type</TableCell>
                                              <TableCell>Content</TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {this.state.pulledQuestions.map((qsn) => (
                                              <TableRow hover key={qsn.uid}>
                                                <TableCell style={{maxWidth:"50px"}}>
                                                  <Checkbox name={qsn.id} color="primary" checked={this.checkChosenArray(qsn.id)} onChange={(event) => this.handleChecked(event, qsn)} />
                                                </TableCell>
                                                <TableCell component="th" scope="row" style={{maxWidth:"120px", wordWrap: 'break-word'}}>
                                                  <Chip size="sm" label={qsn.type}></Chip>
                                                </TableCell>
                                                <TableCell style={{maxWidth:"500px", wordWrap: 'break-word'}}>{qsn.text}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button color="warning" onClick={() => (console.log("Chosen Questions: " + this.state.chosenQuestions))}>Check</Button>
                                <Button onClick={this.questionDialogClose}>Close</Button>
                            </DialogActions>
                    </Dialog>

                    <Dialog id="question-editor-modal"
                          open={this.state.questionEditorModal}
                          TransitionComponent={Transition}
                          maxWidth='xl'
                          fullWidth
                          keepMounted
                          aria-labelledby="alert-dialog-slide-title"
                          aria-describedby="alert-dialog-slide-description">
                      <DialogContent>
                        <Container>
                            <h4>Submit new questions for surveys.</h4>
                            <Row>
                              <Col md={{ span: 3, offset: 0 }} >
                                <div> Choose Question Type: {this.renderQstDropdown()} </div>
                              </Col>
                              <Col md={{ span: 8, offset: 0 }} >
                                <p> {this.renderResult()} </p>
                              </Col>
                              </Row>
                              < hr />
                                <div>
                                {"   "}
                                <p><b>Questions Submitted this Session:</b></p>
                                    {
                                        this.state.questions.map((qsn, i) => (
                                          <p className="question-space">{i+1}. {qsn.question}</p>
                                    ))
                                    }
                                </div>
                        </Container>
                      </DialogContent>
                      <DialogActions>
                          {this.renderSubmitButton()}
                          <Button variant='warning' onClick={this.resetFields}><FontAwesomeIcon icon="undo" /> Reset</Button>
                          <Button variant="danger" onClick={this.closeQuestionEditorModal}>Exit</Button>
                      </DialogActions>
                  </Dialog>

                    <Dialog open={this.state.conceptDialog} >
                        <DialogContent dividers>
                            <h3>Concept List</h3>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.conceptDialogClose}>Close</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={this.state.prototypeDialog}
                        maxWidth='xl'>
                        <DialogContent dividers>
                            <h6>Click on the prototype to include in your survey.</h6>
                            <TableContainer component={Paper}>
                              <Table size="small" aria-label="a dense table">
                                <TableHead>
                                  <TableRow>
                                  {/*  <TableCell></TableCell> */}
                                    <TableCell >Prototype Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell >Type</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {this.state.prototypes.map((file) => (
                                    <TableRow hover onClick={() => this.choosePrototype(file)} key={file.prototypeName}>
                                      {/* <TableCell style={{maxWidth:"50px"}}><Checkbox name={file.id} color="primary" checked={this.checkChosenArray(qsn.id)} onChange={(event) => this.handleChecked(event, qsn)/></TableCell> */}
                                      <TableCell component="th" scope="row" style={{maxWidth:"120px", wordWrap: 'break-word'}}>
                                        {file.prototypeName}
                                      </TableCell>
                                      <TableCell style={{maxWidth:"500px", wordWrap: 'break-word'}}>{file.prototypeDescription}</TableCell>
                                      <TableCell style={{maxWidth:"120px", wordWrap: 'break-word'}}>type</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <hr />
                          <div hidden={this.state.chosenPrototype==''}><p>Chosen Prototype: {this.state.chosenPrototype.prototypeName}</p></div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='warning' onClick={this.resetPrototype}><FontAwesomeIcon icon="undo" /> Reset</Button>
                            <Button variant='success' onClick={this.prototypeDialogClose}>Save</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                </Container>

                <Dialog open={this.state.loading}
                style={{backgroundColor: 'transparent'}}
                maxWidth="lg">
                <div style={{overflow: 'hidden'}}>{"   "}<CircularProgress/>{"   "}</div>
                </Dialog>

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
                      <Button onClick={this.handleCloseSuccessModal} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
            </div>

        );
    }
}
