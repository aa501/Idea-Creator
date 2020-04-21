import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
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
import './SurveyAnalytics.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class SurveyAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.location.state.userData || this.props.userData,
        projectName: this.props.location.state.projectName,
        analyzedSurvey: this.props.location.state.analyzedSurvey,
        loading: '',
        numResponses: 0,
        responses: [],
        subjects: [],
        answerCorrelations: [],
        qualitatives: [],
        quantitatives: [],
        uniqueAnswers: [],
        averages: [],
        compiledAverages: [],
        combinedUniques: [],
    }
  }

  componentDidMount = async () => {
    console.log(this.props);
    this.setLoading(true);
    await this.getSurveyResponses();
    await this.getSubjects();
    await this.assembleQuestions();
    this.setLoading(false);
  }

  assembleQuestions = () => {
    const survey = this.state.analyzedSurvey;
    const questions = JSON.parse(survey.questions);
    var qualitatives = [];
    var quantitatives = [];

    this.setState({ questions });

    questions.forEach(function(qsn) {
      if (qsn.type == "Rating") {
        quantitatives.push(qsn);
      }
      else {
        qualitatives.push(qsn);
      }
    });

    this.setState({ qualitatives, quantitatives }, () => this.processResponses());
  }

  processResponses = () => {
    var uniqueAnswers = [];
    var averages = [];
    var uniqueResponseIds = [];
    var compiledAverages = [];
    const responses = this.state.responses;
    const qualitatives = this.state.qualitatives;
    const quantitatives = this.state.quantitatives;
    var answerCorrelations = this.state.answerCorrelations;
    var frequencyCheck = 0;
    var numResponses = this.state.numResponses;

    var qualIds = [];
    var quantIds = [];

    qualitatives.forEach(function(qual) {
      qualIds.push(qual.id);
    });

    quantitatives.forEach(function(quant) {
      quantIds.push(quant.id);
    });

    if (responses.length)
    {
      responses.forEach(function(response) {

        if (qualIds.includes(response.qid)) {
            var aCAnswer = {
              takerUid: response.surveyTakerUid,
              question: response.qid,
              answer: response.answer
            };
            answerCorrelations.push(aCAnswer);
            var found = uniqueAnswers.find(ans => ans.answer === response.answer);
            if (found) {
              console.log(response);
              var foundId = uniqueAnswers.indexOf(found);
              uniqueAnswers[foundId].frequency += 1
              }
            else {
              var newAnswer = {
                  question: response.qid,
                  answer: response.answer,
                  frequency: 1
                };
              uniqueAnswers.push(newAnswer);
            }
            frequencyCheck += 1;
        }

        else if (quantIds.includes(response.qid)) {
            var aCAnswer = {
              takerUid: response.surveyTakerUid,
              question: response.qid,
              answer: parseInt(response.answer)
            };
            answerCorrelations.push(aCAnswer);
            var found = averages.find(ans => ans.answer === parseInt(response.answer));
            if (found) {
              console.log(response);
              var foundId = averages.indexOf(found);
              averages[foundId].frequency += 1
              }
            else {
              var newAnswer = {
                  question: response.qid,
                  answer: parseInt(response.answer),
                  frequency: 1
                };
              averages.push(newAnswer);
            }
            frequencyCheck += 1;
        }

        else {
          console.log("Question could not be organized.")
        }

      });

      responses.forEach(function(res) {
         if (!uniqueResponseIds.includes(res.surveyTakerUid)) {
           uniqueResponseIds.push(res.surveyTakerUid);
           numResponses+=1;
         }
      });

      answerCorrelations = answerCorrelations.sort((a, b) => (a.question < b.question) ? -1 : 1)
      averages = averages.sort((a, b) => (a.question < b.question) ? -1 : 1);
      uniqueAnswers = uniqueAnswers.sort((a, b) => (a.question - b.question) || b.frequency - a.frequency);

      averages.forEach(function(ans) {
        var search = compiledAverages.find(aws => aws.question === ans.question)
        if (!search) {
          var avgObj =
          {
            question: ans.question,
            average: ans.answer,
            frequency: ans.frequency
          }
          compiledAverages.push(avgObj);
        }

        else {
          var index = compiledAverages.indexOf(search)
          console.log(compiledAverages[index])

          compiledAverages[index].average = (compiledAverages[index].average * compiledAverages[index].frequency) + (ans.answer * ans.frequency)
          compiledAverages[index].frequency += ans.frequency
          compiledAverages[index].average =  compiledAverages[index].average /  compiledAverages[index].frequency

          console.log(compiledAverages[index].frequency)
        }

      });

      console.log("Total Frequency: " + frequencyCheck)
      this.setState({ uniqueAnswers, averages, answerCorrelations, numResponses, compiledAverages }, () => (this.checkPopulations()));
    }
  }

  checkPopulations = () => {
    console.log("Unique Answers");
    console.log(this.state.uniqueAnswers);
    console.log("Averages");
    console.log(this.state.averages);
    console.log("Total Correlations");
    console.log(this.state.answerCorrelations);
    console.log("Number of Responses");
    console.log(this.state.numResponses);
    console.log("Compiled Averages");
    console.log(this.state.compiledAverages);
  }

  getSurveyResponses = async () => {
    var uid = this.state.analyzedSurvey.uid;
    if (uid != null) {
        console.log(uid);
        const response = await axios.get(`/api/survey/${uid}/responses`, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
            }
        }).then(response => {
            response = response.data;
            this.setState({
                responses: response
            }, () => (console.log(this.state.responses)));
        });
    }
  }

  getSubjects = async () => {
    var uid = this.state.analyzedSurvey.uid;
    if (uid != null) {
        console.log(uid);
        const response = await axios.get(`/api/survey/${uid}/takers`, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
            }
        }).then(response => {
            response = response.data;
            this.setState({
                subjects: response
            }, () => (console.log(this.state.subjects)));
        });
    }
  }

    renderStatus = () => {
      if (this.state.analyzedSurvey.status == "Deployed")
      {
        return (
          <h4 id="status-text">Status: <h4 style={{ color: "orange" }}><strong>Deployed</strong></h4></h4>
        )
      }
      else if (this.state.analyzedSurvey.status == "Closed")
      {
        return (
          <h4 id="status-text">Status: <h4 style={{ color: "green" }}><strong>Closed</strong></h4></h4>
        )
      }
      else
      {
        return (
          <h4 id="status-text">Status: <h4 style={{ color: "red" }}><strong>Not Deployed</strong></h4></h4>
        )
      }
    }

    renderQuestion = (id) => {
      var found = this.state.questions.find(qsn => qsn.id == id);
      if (found)
      return found.text
    }

    renderSpecificAnswers = (id, idx) => {
      var filtered = this.state.uniqueAnswers.filter(ans => ans.question == id);
      if (filtered.length && idx < 1)
      {
        return (
          <div>
          {
            filtered.map((ans, index) => {
              return (
                <div>
                {ans.answer}
                </div>
              )
            })
          }
          </div>
        )
      }
    }

    renderUniqueAnswers = () => {
      const questions = JSON.parse(this.state.analyzedSurvey.questions)
      const filtered = [];
      questions.forEach(function(qsn) {
        if (!filtered.includes(qsn.text))
        filtered.push(qsn.text)
      });
      const uniqueAnswers = this.state.uniqueAnswers
      return (
        <div>
          {filtered.map((qsn, index) => {
              return (
                <div>
                    <h5><b>Question:</b></h5>
                    <div>
                    {qsn}
                    </div>
                    <p></p>
                    <h6><b>Top 3 Answers:</b></h6>
                    {
                      this.renderSpecificAnswers(qsn.id, index)
                    }
                    <div>

                    </div>
                    <hr />
                </div>
              )
          })
          }
        </div>
      )
    }


    renderAverages = () => {
      const questions = JSON.parse(this.state.analyzedSurvey.questions);
      console.log(questions)
      return (
        <div id ="question-container">
              {this.state.compiledAverages.map((average, index) => {
                  return (
                    <div>
                      <h5><b>Question:</b></h5>
                      <div>
                      {this.renderQuestion(average.question)}
                      </div>
                      <p></p>
                      <h6><b>Average: {average.average.toFixed(2)} / 10 </b></h6>
                      <div>
                      <ProgressBar now={average.average} max={10} />

                      </div>
                      <hr />
                    </div>
                  )
              })
              }
          </div>
    )}

    navHome = () => {
        this.props.history.push({
            pathname: '/home',
            state: this.state  // need this for moving to different component
        });
    }

    navLogout = () => {
        this.props.history.push({
            pathname: '/',
            state: this.state  // need this for moving to different component
        });
    }

    navBack = () => {
      this.props.history.push({
          pathname: '/surveys',
          state: this.state  // need this for moving to different component
           });
    }

    setLoading = (value) => {
      this.setState({ loading: value })
    }

  render() {
      return (

          <div id="analytics-container">

              <SideNav expanded="true" style={{
                  backgroundColor: "#EBF2F2", marginTop: 60, borderRight: "solid", borderRightColor: "#028DCB"
              }}
                  onSelect={(selected) => {
                      // Add your code here
                  }}
              >
                  <SideNav.Nav defaultSelected="">

                      <NavItem style={{ marginTop: 40 }} role="menuitem" eventKey="home" onClick={() => this.navHome()}>
                          <NavIcon>
                              <FontAwesomeIcon icon="home" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>
                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 20, fontSize: 16 }}>
                              Home
                            </NavText>
                      </NavItem>
                      <NavItem role="menuitem" eventKey="add-question" onClick={() => this.navBack()}>
                          <NavIcon>
                              <FontAwesomeIcon icon="arrow-left" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Back to Surveys
                        </NavText>
                      </NavItem>
                      <NavItem role="menuitem" eventKey="logout" onClick={() => this.navLogout()}>
                          <NavIcon>
                              <FontAwesomeIcon icon="sign-out-alt" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                          </NavIcon>

                          <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                              Logout
                            </NavText>
                      </NavItem>
                  </SideNav.Nav>
              </SideNav>


              <div id="analytics-main-content">

                  <h3 id="survey-name" >Results for Survey: <b>{this.state.analyzedSurvey.surveyName}</b></h3>
                  <div id="surveyID">
                          <h5>Unique ID: {this.state.analyzedSurvey.uid}</h5>
                  </div>
                  <div id="status" style={{marginTop: "25px", marginBottom: "35px"}}>
                  {this.renderStatus()}
                  </div>


                  <div id="results">
                      <h3 id="results-header" >Survey Results</h3>
                      <hr id="hr-2" />
                  </div>
              </div>
              <div class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>
              {this.renderAverages()}
              </div>

              <Dialog open={this.state.loading}
                style={{backgroundColor: 'transparent'}}
                maxWidth="lg">
                <div style={{overflow: 'hidden'}}>{"   "}<CircularProgress/>{"   "}</div>
              </Dialog>
         </div>
       )
    }

}
