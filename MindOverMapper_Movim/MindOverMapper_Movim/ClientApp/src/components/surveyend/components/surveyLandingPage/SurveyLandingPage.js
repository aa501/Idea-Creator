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
import './SurveyLandingPage.css';

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

export default class SurveyLandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subQuestion: '',
            qstType: '',
            answers: [],
            ratings: [],
            questions: [],
            checkedHold: [],
            surveyCode: 'IP',
        }
    }

    handleSurveyCode = (event) => {
      this.setState({ surveyCode: event.target.value });
    }

    render() {

        return (
          <div class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>
              <Container>
                  <div align="center" class="d-flex align-content-justify flex-column">
                      <h3>IP Creator Survey Hub</h3>
                      <hr />
                      <h5>Enter your unique Survey code here:</h5>

                      <div align="center"><TextField variant="outlined" value={this.state.surveyCode} onChange={this.handleSurveyCode} inputProps={{ style: {textAlign: 'center', width: "300px"} }}/>
                      <Button id="submit-code" color="primary" onClick={this.newSurvey}>Take Survey</Button></div>

                  </div>
              </Container>
          </div>
        );
    }
}
