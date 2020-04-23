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

const chipColors = [
  'rgb(51, 153, 255)',
  'rgb(102, 178, 255)',
  'rgb(153, 204, 255)'
];

const chipTextColors = [
  'rgb(255, 255, 255)',
  'rgb(0, 0, 0)',
  'rgb(0, 0, 0)'
];

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
        quantGroups: [],
        qualGroups: []
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

    getSurveyResponses = async () => {
      var uid = this.state.analyzedSurvey.uid;
      if (uid != null) {
          const response = await axios.get(`/api/survey/${uid}/responses`, {
              headers: {
                  Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
              }
          }).then(response => {
              response = response.data;
              this.setState({
                  responses: response
              });
          });
      }
    }

    getSubjects = async () => {
      var uid = this.state.analyzedSurvey.uid;
      if (uid != null) {
          // console.log(uid);
          // console.log("Subjects")
          const response = await axios.get(`/api/survey/${uid}/takers`, {
              headers: {
                  Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
              }
          }).then(response => {
              response = response.data;
              this.setState({
                  subjects: response
              });
          });
      }
    }

  processResponses = () => {
    const responses = this.state.responses;
    const qualitatives = this.state.qualitatives;
    const quantitatives = this.state.quantitatives;
    var modeGroup = [];
    var frequencyCheck = 0;

    var qualGroups = [];
    var quantGroups = [];

    qualitatives.forEach(function(qual) {
      var qualObject = {
        id: qual.id,
        question: qual.text,
        answerGroup: []
      }
      qualGroups.push(qualObject)
    });

    quantitatives.forEach(function(quant) {
      var quantObject = {
        id: quant.id,
        question: quant.text,
        answerGroup: []
      }
      quantGroups.push(quantObject)
    });

    if (responses.length)
    {
      responses.forEach(function(response) {
        var found = qualGroups.find(qsn => qsn.id === response.qid)
        if (found) {
          var index = qualGroups.indexOf(found);
          // console.log("Pushing " + response.answer + " to group " + qualGroups[index]);
          var splitStr = response.answer.split("{%}")

          splitStr.forEach(function(str) {
            qualGroups[index].answerGroup.push(str);
          });
        }

        found = quantGroups.find(qsn => qsn.id === response.qid)
        if (found) {
          var index = quantGroups.indexOf(found);
          // console.log("Pushing " + response.answer + " to group " + quantGroups[index])
          quantGroups[index].answerGroup.push(parseInt(response.answer));
        }

        else {
          console.log("Error processing response")
        }
        frequencyCheck+=1
      });

      // console.log("Total Frequency: " + frequencyCheck)
      this.setState({ qualGroups, quantGroups }, () => (this.checkPopulations()));
    }
  }

  getMode = (array, limit) =>
  {
      var highest = [];
      var modes = [];
      var iter = 0

      if(array.length == 0)
          return null;
      var modeMap = {};

      var maxEl = array[0]
      var maxCount = 1;

      while (iter < limit) {

        if (array.length > 0) {

          for(var i = 0; i < array.length; i++)
          {
              var el = array[i];
              if(modeMap[el] == null)
                  modeMap[el] = 1;
              else
                  modeMap[el]++;
              if(modeMap[el] > maxCount)
              {
                  maxEl = el;
                  maxCount = modeMap[el];
              }
          }

          highest.push(maxEl);
          modes.push(maxCount);

          array = array.filter(el => el != maxEl)
        }
        iter+=1;
      }

      // console.log(highest);
      highest.reverse();

      return (
          <div>
            <b id="answer-container">Top 3 Answers</b>
            <div id="answer-container" class="row">
            {
              highest.map((ans, index) => {
                return (
                  <div>
                    <Chip style={{marginRight: "10px", marginTop: "10px", backgroundColor: chipColors[index], textColor: chipTextColors[index]}} size="medium" color="rgb(255, 0, 0)" label={ans}></Chip>
                  </div>
                )
              }
              )
            }
            </div>
          </div>
        )
  }

  checkPopulations = () => {
    // console.log("Quality Groups")
    // console.log(this.state.qualGroups)
    // console.log("Quantity Groups")
    // console.log(this.state.quantGroups)
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
      // console.log(filtered)
      {
        return (
          <div>
          {
            filtered.map((ans, index) => {
              if (index < 3) {
              return (
                <div>
                <b>{index +1}{") "}</b>{ans.answer}
                </div>
              )
            }
            })
          }
          </div>
        )
      }
    }

    renderUniqueAnswers = () => {
      const qualGroups = this.state.qualGroups;

      return (
        <div> {
        this.state.qualGroups.map((question, index) => {
          return (
            <div id="question-container">
              <h5>{question.question}</h5>
              <div class="row">{this.getMode(question.answerGroup, 3)}</div>
              <hr />
            </div>
          )
        })
      } </div>
    )}

    getAverage = (group) => {
      // console.log("running")
      var length = group.length;
      var sum = 0;
      group.forEach(function (ans) {
        sum += ans;
      })
      var average = sum/length;
      // console.log(sum)
      return average;
    }


    renderAverages = () => {
      const quantGroups = this.state.quantGroups;

      return (
        this.state.quantGroups.map((question, index) => {
          return (
            <div id="question-container">
              <h5>{question.question}</h5>
              <b>Average: {this.getAverage(question.answerGroup).toFixed(2)} / 10 </b>
              <ProgressBar style={{marginTop: "5px"}} now={this.getAverage(question.answerGroup)} max={10}/>
              <hr />
            </div>
          )
        }));
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

                  <h3 id="survey-name" >Results for Survey: <b>{this.state.analyzedSurvey.surveyName}</b></h3>
                  <div id="surveyID">
                        <h5>Unique ID: {this.state.analyzedSurvey.uid}</h5>
                  </div>
                  <div id="status" style={{marginTop: "25px", marginBottom: "35px"}}>
                  {this.renderStatus()}
                  </div>


                  <div id="results">
                      <h3 id="results-header">Results</h3>
                      <hr id="hr-2" />
                  </div>
              </div>
              <div id ="push-container">
                <div class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>
                <h4 id="question-container"><b>Total Responses: {this.state.subjects.length}</b></h4>
                <hr />
                {this.renderAverages()}
                {this.renderUniqueAnswers()}
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
