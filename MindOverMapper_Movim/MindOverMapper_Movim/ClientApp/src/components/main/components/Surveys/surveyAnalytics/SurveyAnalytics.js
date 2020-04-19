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
    const responses = this.state.responses;
    const qualitatives = this.state.qualitatives;
    const quantitatives = this.state.quantitatives;
    const answerCorrelations = this.state.answerCorrelations;
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
      console.log("Total Frequency: " + frequencyCheck)
      this.setState({ uniqueAnswers, averages, answerCorrelations, numResponses }, () => (this.checkPopulations()));
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

                  <h3 id="survey-name" >"Survey-Name"</h3>
                  <hr id="hr-1" />
                  <div id="surveyID">
                          <h6>Unique ID: 123456</h6>
                  </div>
                  <div id="status" style={{marginTop: "25px", marginBottom: "35px"}}>
                          <h4 id="status-text">Status: <h4 style={{ color: "green" }}><strong>Complete</strong></h4></h4>
                  </div>

                  <div id="results">
                      <h3 id="results-header" >Survey Results</h3>
                      <hr id="hr-2" />
                  </div>

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
