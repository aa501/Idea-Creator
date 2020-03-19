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


export default class SurveyQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData,
            projectName: this.props.location.state.projectName,

            textSub: '',
            ratingSub: '',
            checkSub: [],
            qstType: '',

            ratingQuestion: '',
            ratingMinimum: '',
            ratingMaximum: '',
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


    handleRating = (event) => {
        this.setState({
           ratingQuestion: event.target.value
        });
    }

    resetFields = () => {
        this.setState({
            subQuestion: '',
            qstType: '',
        })
    }

    viewProject = () => {
      return this.props.history.push({
          pathname: '/project-landing-page',
          state: this.state
      });
    }

    submitTextQuestion = () => {
      axios.post('/api/project/submit-question',
      {
          'text': this.state.subQuestion,
          'type': this.state.qstType,
          'archived': 'No'
      },
      {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
      });
    }

    handleChange(e) {
      this.setState({ qstType: e.target.value });
    }

    renderQstDropdown() {
      return(
          <Select id="select" label="Type" className="col-md-8 col-offset-4" value={this.state.qstType} onChange={this.handleChange}>
                   <MenuItem value="Text">Text</MenuItem>
                  {/* <MenuItem value="Multiple Choice">Multiple Choice</MenuItem> */}
                   <MenuItem value="Rating">Rating</MenuItem>
         </Select>
       )
    }

    renderSubmitButton() {
      if (this.state.qstType === "Text") {
          return(
          <Button color='primary' id='submit-question' onClick={this.submitTextQuestion}><FontAwesomeIcon icon="check" /> Submit Question</Button>
        )
      }

      // if (this.state.qstType === "Multiple Choice") {
      //     return(
      //     <Button color='primary' id='submit-question' onClick={this.checker}><FontAwesomeIcon icon="check" /> Submit Question</Button>
      //   )
      // }

      if (this.state.qstType === "Rating") {
          return(
          <Button color='primary' id='submit-question' onClick={this.checker}><FontAwesomeIcon icon="check" /> Submit Question</Button>
        )
      }
    }

    renderResult() {
      if (this.state.qstType === "Text") {
        return(
          <div>
            <Row>
              <TextField id="text-field"
                  value={this.state.subQuestion}
                  onChange={this.handleSubQuestionChange}
                  label="Text Answer Question"
                  multiline
                  rows="3"
                  width="400px"
                  margin="normal"
                  placeholder="check"
                  variant="outlined">
                </TextField>
              </Row>
            </div>
        )
      }
      // if (this.state.qstType === "Multiple Choice") {
      //   return(
      //     <div>
      //       <Row>
      //         <TextField id="text-field"
      //             value={this.state.subQuestion}
      //             onChange={this.handleSubQuestionChange}
      //             label="Text Answer Question"
      //             multiline
      //             rows="3"
      //             width="400px"
      //             margin="normal"
      //             placeholder="check"
      //             variant="outlined">
      //         </TextField>
      //         <TextField id="text-field2"
      //               value={this.state.subQuestion}
      //               onChange={this.handleSubQuestionChange}
      //               label="Answer 1"
      //               width="400px"
      //               margin="normal"
      //               placeholder="check"
      //               variant="outlined">
      //         </TextField>
      //       </Row>
      //     </div>
      //   )
      // }
      if (this.state.qstType === "Rating") {
        return(
          <div>
          <Row>
            <TextField id="text-field"
                value={this.state.subQuestion}
                onChange={this.handleSubQuestionChange}
                label="Text Answer Question"
                multiline
                rows="3"
                width="400px"
                margin="normal"
                placeholder="check"
                variant="outlined">
            </TextField>
            </Row>
            <Row>
            <TextField id="text-field2"
                  value={this.state.subQuestion}
                  onChange={this.handleSubQuestionChange}
                  label="Minimum"
                  width="400px"
                  margin="normal"
                  placeholder="check"
                  variant="outlined">
            </TextField>
            </Row>
            <Row>
            <TextField id="text-field2"
                  value={this.state.subQuestion}
                  onChange={this.handleSubQuestionChange}
                  label="Maximum"
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
                </Container>
            </div>
        );
    }
}
