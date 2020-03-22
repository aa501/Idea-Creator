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
import './SurveyBuilder.css';



export default class SurveyBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subQuestion: '',
            qstType: '',
        }
    }

    componentDidMount = () => {
        console.log(this.props)
    }

    resetFields = () => {
        this.setState({
        })
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

    resetFields = () => {
        this.setState({
            subQuestion: '',
            qstType: ''
        })
    }

    submitQuestion = () => {
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

    render() {

        return (
            <div className='concept-question-container'>
                        <h3 className="page-title">Create Survey Question</h3>
                <Container>
                    <h4>Submit new questions for surveys or concepts.</h4>
                    <Row>
                    <Col md={{ span: 5, offset: 0 }} >
                      <TextField id="concept-field"
                          value={this.state.subQuestion}
                          onChange={this.handleSubQuestionChange}
                          label="Question to Submit"
                          multiline
                          rows="3"
                          width="400px"
                          margin="normal"
                          placeholder="check"
                          variant="outlined">
                        </TextField>
                    </Col>
                    <Col md={{ span: 3, offset: 0 }} >
                       Question Type  <Select id="select" label="Type" value={this.state.qstType} onChange={this.handleQstTypeChange} defaultValue = "Concept" >
                                <MenuItem value="Concept">Concept</MenuItem>
                                <MenuItem value="Survey">Survey</MenuItem>
                      </Select>
                    </Col>
                        <Col>
                            <Button color='warning' id='reset-fields' onClick={this.resetFields}><FontAwesomeIcon icon="undo" /> Reset</Button>

                            <Button color='primary' id='submit-question' onClick={this.submitQuestion}><FontAwesomeIcon icon="check" /> Submit Question</Button>
                        </Col>
                    </Row>
                </Container>
            </div>


        );
    }
}
