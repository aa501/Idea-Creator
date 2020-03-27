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
}));


export default class SurveyView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subQuestion: '',
            qstType: '',
            answers: [],
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

    handleRating = (event) => {
      this.setState({
        rating: event.target.value
      });
    }

    resetFields = () => {
        this.setState({
            subQuestion: '',
            qstType: '',
            rating: ''
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
                The problem with the above occurs when the browser window is smaller than the width of the element. The browser then adds a horizontal scrollbar to the page.
                <div class="rating-div">
                <Grid container direction="column" justify="center" alignItems="stretch" spacing={2}>
                  <Grid item>
                  </Grid>
                  <Grid item>
                    <div align="center">
                      <ToggleButtonGroup
                        value={this.state.rating}
                        exclusive
                        onChange={this.handleRating}
                        aria-label="text alignment">
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
                          <Col xs="6"><div text-align="left">Test</div></Col>
                          <Col xs="6"><div class="testing">Testjfhtdhgfkhs</div></Col>
                        </Row>
                      </Grid>
                    </Grid>
                    </div>
                </Container>
            </div>


        );
    }
}
