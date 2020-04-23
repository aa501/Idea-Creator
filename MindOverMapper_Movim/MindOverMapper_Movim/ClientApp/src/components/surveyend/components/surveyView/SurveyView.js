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
            surveyCode: '',
            answers: [],
            ratings: [],
            questions: [],
            checkedHold: [],
            survey: [],
        }
    }

    componentDidMount = () => {
        console.log(this.props);
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
                                {this.renderQuestion(qsn)}
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
