import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Container, Row, Col, FormGroup, InputGroup, Form, Button, Card, Alert } from 'react-bootstrap';
import { Input } from 'reactstrap';
import { Chip, List, ListSubheader, ListItem, ListItemText, Select, MenuItem, Dialog, DialogContent, DialogActions, Checkbox, RadioGroup, FormControlLabel, Radio, TextareaAutosize, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import Slide from '@material-ui/core/Slide';
import './NewSurvey.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default class NewSurvey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData || this.props.userData,
            projectName: this.props.location.state.projectName,
            loading: false,
            surveyName: '',
            questions: [],
            pulledQuestions: [],
            chosenQuestions: [],
            finalQuestionSet: [],
            concepts: [],
            prototypes: [],
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
            ratingString: '',

            choices: '',
        }
    }

    componentDidMount = () => {
        console.log(this.props);
    }

    getQuestions = async () => {
        const response = await axios.get('/api/survey/get-survey-questions', {
        }).then(response => {
            response = response.data;
            this.setState({
                pulledQuestions: response,
                test: response.length
            });
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

    handleRatingMin = (event) => {
      this.setState({ ratingMinNote: event.target.value });
    }

    handleRatingMax = (event) => {
      this.setState({ ratingMaxNote: event.target.value });
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

    surveySample = () => {
      return this.props.history.push({
          pathname: '/survey'
      });
    }

    saveSurvey = (callback) => {
        this.validateSurvey();
        let survey = this.buildSurveyPayload();
        axios.post('/api/survey', {
             survey
            },
            {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
            }).then(response => {
                callback(response.data);
            }).catch(err => {

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

    buildSurveyPayload = () => {
        let survey = {
            surveyName: this.state.surveyName,
            concepts: this.state.concepts,
            prototypes: this.state.prototypes,
            idea: this.state.idea,
            package: this.state.package,
            product: this.state.product,
            name: this.state.name,
            purchaseFrequency: this.state.purchaseFrequency,
            qualitative: this.state.qualitative,
            demographics: this.state.demographics
        };
        return survey;
    }
    validateSurvey = () => {
        if (
            this.state.surveyName &&
            (this.state.prototypes.length > 0 || this.state.concepts.length > 0) &&
            this.state.pricingOptionId
        )
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
        this.setState({ demographics: !this.state.demographics });
    }

    openQuestionBank = async (event) => {
        await this.setLoading(true);
        await this.getQuestions();
        await this.setState({ questionDialog: true});
        await this.setLoading(false);
    }

    openQuestionEditorModal = (event) => {
        this.setState({ questionEditorModal: true })
    }

    closeQuestionEditorModal= () => {
        this.setState({ questionEditorModal: false });
    }

    handleSubQuestionChange = (event) => {
        this.setState({
           subQuestion: event.target.value
        });
    }

    bindChosen = (arr) => {
      this.setState({ chosenQuestions: arr }, () => (this.finalizeSurvey(arr)));
    }

    finalizeSurvey(arr) {
      console.log(this.state.pulledQuestions)
      var pulledQuestions = this.state.pulledQuestions;
      var finalArray = [];
          arr.forEach(function(id){
          console.log("Searching for: " + typeof(id) + " " + id)
          const found = pulledQuestions.filter(obj => {return obj.id === parseInt(id)})
          finalArray.push(found);
        });
      this.setState({ finalQuestionSet: finalArray}, () => (console.log(this.state.finalQuestionSet)));
    }


    checkChosenArray(id) {
      var result = this.state.chosenQuestions.includes(id.toString());
      if (result == true)
      {
        return true;
      }
      return false;
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

      this.bindChosen(chosenQuestions);
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
            <div class="mx-auto shadow my-5 p-3">
                <Container>
                    <div class="d-flex align-content-between flex-column">
                        <h3>Survey Builder</h3>

                        <FormGroup>
                            <TextField id="name" variant="outlined" onChange={this.handleSurveyNameChange} fullWidth value={this.state.surveyName} label="1. Survey Name (Respondents will not see this name)" />
                        </FormGroup>
                        <FormGroup>
                            <h5>2. Check to include Demographics and Categorization Questions</h5>
                            <FormControlLabel
                                control={<Checkbox checked={this.demographics} onChange={this.demographicsChanged} name="demographics" />}
                                label="Check here if your survey will NOT be utilizing Amazon MTurk."
                            />

                        </FormGroup>

                        <FormGroup>
                               <h5>3. Add Concepts</h5>
                                    <Alert variant="info">
                                        Please click the proper button below for the format you would like to test your idea as.
                                    </Alert>
                                    <div className="d-flex flex-wrap justify-content-around">
                                        <Button variant="success">
                                            Add a WRITTEN CONCEPT (Yellow Card)
                                        </Button>
                                        <Button variant="success">
                                            Add a CONCEPT PROTOTYPE IMAGE
                                        </Button>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <h5>4. Add Questions</h5>
                                    <Alert variant="info">
                                        Please click any button below to add questions to your survey.
                                    </Alert>
                                    <div className="d-flex flex-wrap justify-content-around">
                                      <Button variant="warning" onClick={this.openQuestionBank}><FontAwesomeIcon icon="upload" /> Load Existing Survey</Button>
                                      <Button variant="warning" onClick={this.openQuestionBank}><FontAwesomeIcon icon="cogs" /> Add Existing Questions</Button>
                                      <Button variant="warning" onClick={this.openQuestionEditorModal}><FontAwesomeIcon icon="plus" /> Create New Question</Button>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <h5>5. Survey Comments (Optional)</h5>
                                        <p>This space is here to record any notes you might have such as who will respond or how the data will be collected</p>
                                        <TextField variant="outlined" fullWidth label="Survey Comments" multiline rows={3} placeholder="Examples:
    How and/or where responses will be collected
    More information on the ideas and/or products tested." />
                                </FormGroup>
                                <FormGroup>
                                    <h2>Connect Research with Innovation Projects</h2>
                                    <p>Select Projects: The project team will have access to this test.</p>
                                    <p>Hold the control key(windows) or command key (mac) to select multiple</p>
                                </FormGroup>


                    <div class="d-flex justify-content-around flex-row">
                            <Button onClick={this.cancel} >Cancel</Button>
                            <span>
                                <Button>Save and Exit</Button>
                                <Button variant="success" onClick={this.finalizeSurvey}>Save and Preview Survey</Button>
                                <Button variant="success" onClick={this.saveAndEmail}>Save and Email</Button>
                                <Button variant="success" onClick={this.saveAndTurk}>Save and Collect Live</Button>
                            </span>
                        </div>
                    <Dialog
                    open={this.state.questionDialog}
                    maxWidth='xl' >
                            <DialogContent dividers>
                                <div><h5>Check all questions that you would like to include in your survey.</h5></div>
                                <div>
                                    {
                                        this.state.pulledQuestions.map(qsn => (
                                        <div>
                                          <Row>
                                              <Chip size="small" label={qsn.type} />
                                          </Row>
                                          <Row>
                                              <FormControlLabel control={<Checkbox name={qsn.id} color="primary" checked={this.checkChosenArray(qsn.id)} onChange={(event) => this.handleChecked(event, qsn)} />}
                                                label={qsn.text}/>
                                          </Row>
                                          <hr id="hr-3" />
                                        </div>
                                    ))
                                    }
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
                              <Col md={{ span: 5, offset: 0 }} >
                                <p> {this.renderResult()} </p>
                              </Col>
                                <p>
                                  <Button variant='warning' id='reset-fields' onClick={this.resetFields}><FontAwesomeIcon icon="undo" /> Reset</Button>
                                  {this.renderSubmitButton()}
                                </p>
                              </Row>
                                <div>
                                {"   "}
                                <p><b>Questions Submitted this Session:</b></p>
                                    {
                                        this.state.questions.map(qsn => (
                                          <p className="question-space">{this.state.numQs}. {qsn}</p>
                                    ))
                                    }
                                </div>
                        </Container>
                      </DialogContent>
                      <DialogActions>
                          <Button color="danger" onClick={this.closeQuestionEditorModal}>Don't Save</Button>
                      </DialogActions>
                  </Dialog>

                    <Dialog open={this.state.conceptDialog} >
                        <DialogContent dividers>
                            <h3>Concept List</h3>
                            <p>Select a concept from here</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.conceptDialogClose}>Close</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.prototypeDialog} >
                        <DialogContent dividers>
                            <h3>Prototype List</h3>
                            <p>Select a protype from the list</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.prototypeDialogClose}>Close</Button>
                        </DialogActions>
                        </Dialog>
                    </div>
                </Container>

                <Dialog open={this.state.loading}
                style={{backgroundColor: 'transparent'}}
                maxWidth="lg">
                {"   "}<CircularProgress/>{"   "}
                </Dialog>
            </div>

        );
    }
}
