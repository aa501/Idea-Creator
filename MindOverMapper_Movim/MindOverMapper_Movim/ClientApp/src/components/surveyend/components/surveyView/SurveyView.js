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
import { RadioGroup, FormControlLabel, Radio, Checkbox, FormControl, FormLabel } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Grid from '@material-ui/core/Grid';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SurveyView.css';

const useStyles = makeStyles(theme => ({
  toggleContainer: {
    margin: theme.spacing(2, 0),
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

export default class SurveyView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subQuestion: '',
            qstType: '',
            answers: [],
            ratings: [],
            questions: [],
            checkedHold: [],
        }
    }

    componentDidMount = () => {
        console.log(this.props);
        this.getQuestions();
    }

    getQuestions = async () => {
        const response = await axios.get('/api/project/retrieve-survey', {
        }).then(response => {
            response = response.data;
            this.setState({
                questions: response,
                test: response.length
            });
        });
    }

    submitAnswers = async () => {
        axios.post(`/api/project/post-survey-answer`,
              {
                  'answerList': this.state.newAnswers,
              },
        ).then(this.handleOpenOldQuestionModal).catch(() => {
          this.openErrorModal();
          this.setState({
            errorMessage: 'Before submitting we need to figure out our survey submission plans'
          });
        });
      }

    resetFields = () => {
        this.setState({
        })
    }

    handleChange = (event) => {
      this.setState({ qstType: event.target.value });
    }

    handleRatingMaster = (event, i) => {
      this.handleRating(event, i);
      this.handleAnswer(event, i);
    }

    handleRating = (event, i) => {
      console.log(event.target.value)
      this.setState({
          rating: event.target.value
      });
      const ratings = this.state.ratings;
      ratings[i] = event.target.value;
      this.setState({ ratings });
    }

    handleRadioMaster = (event, i) => {
      this.handleRadio(event);
      this.handleAnswer(event, i);
    }

    handleRadio = (event) => {
      this.setState({
        radio: event.target.value
      });
    }

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

    handleChecked(event, i) {
      const item = event.target.name;
      const isChecked = event.target.checked;
      const checkedArray = this.state.checkedHold;
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
    }

    addCheckedAnswer(arr, i) {
      const answers = this.state.answers;
      answers[i] = arr;
      this.setState({ answers }, () =>
      (console.log(this.state.answers)));
    }

    renderResult(qsn) {
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
                    <ToggleButton key={0} value="0">0</ToggleButton>
                    <ToggleButton key={1} value="1">1</ToggleButton>
                    <ToggleButton key={2} value="2">2</ToggleButton>
                    <ToggleButton key={3} value="3">3</ToggleButton>
                    <ToggleButton key={4} value="4">4</ToggleButton>
                    <ToggleButton key={5} value="5">5</ToggleButton>
                    <ToggleButton key={6} value="6">6</ToggleButton>
                    <ToggleButton key={7} value="7">7</ToggleButton>
                    <ToggleButton key={8} value="8">8</ToggleButton>
                    <ToggleButton key={9} value="9">9</ToggleButton>
                    <ToggleButton key={10} value="10">10</ToggleButton>
                </ToggleButtonGroup>
              </div>
              </Grid>
                <Grid item>
                  <Row>
                    <Col xs="6"><div text-align="left">{getStringSection(qsn.notes, 1)}</div></Col>
                    <Col xs="6"><div class="testing">{getStringSection(qsn.notes, 3)}</div></Col>
                  </Row>
                </Grid>
              </Grid>
              </div>
        )
      }
    }

    createAnswerChoiceArray(qsn, type) {
      var choices = qsn.notes;
      var i = 0;
      var splitStr = choices.split(',')
      var newArray = [];

      while (splitStr[i] != null) {
        newArray.push(splitStr[i]);
        i++;
      }

      if (type == "mc") {
        return (
          <div>
            <Row>
              <RadioGroup defaultValue="female" aria-label="gender" name="customized-radios" value={this.state.radio} onChange={(event) => this.handleRadioMaster(event, `${qsn.id}`)}>
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
                      <FormControlLabel control={<Checkbox color="teal" name={choice} checked={this.state.checked} onChange={(event) => this.handleChecked(event, `${qsn.id}`)}/>}
                              label={choice} labelPlacement="end"/>
                    </Row>
                ))
                }
                </div>
                )
              }
    }

    render() {

        return (
            <div className='survey-question-container'>
              <Row>
                <h3 className="page-title">Survey Question View</h3>
              </Row>
              <p></p>
                <Container>
                    <h4>Survey Question Test View</h4>
                </Container>
                <Container>
                <div>
                    {
                        this.state.questions.map(qsn => (
                        <div>
                                <div key={`q${qsn.type},${qsn.id}`}>{qsn.text}</div>
                                {this.renderResult(qsn)}
                                <p><hr id="hr-3" /></p>

                        </div>
                    ))
                    }
                </div>
                </Container>

                <Container>
                <Row>
                  <Col md={{ span: 7, offset: 0 }}></Col>
                  <Col md={{ span: 3, offset: 0 }}>
                    <div id='confirmation-button-holder'>
                        <Button color='success' id='submit-concept' onClick={this.submitAnswers}><FontAwesomeIcon icon="angle-double-right" /> Submit</Button>
                    </div>
                  </Col>
                </Row>
                </Container>

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
            </div>
        );
    }
}
