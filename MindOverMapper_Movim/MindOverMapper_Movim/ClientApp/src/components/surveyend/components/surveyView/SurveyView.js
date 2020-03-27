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


export default class SurveyView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subQuestion: '',
            qstType: '',
            answers: [],
            checkedHold: [],
        }
    }

    componentDidMount = () => {
        console.log(this.props)
    }

    resetFields = () => {
        this.setState({
        })
    }

    handleChange = (event) => {
      this.setState({ qstType: event.target.value });
    }

    handleRating = (event) => {
      this.setState({
        rating: event.target.value
      });
    }

    setRadio = (event) => {
      this.setState({
        radio: event.target.value
      });
    }

    setRadio = (event) => {
      this.setState({
        radio: event.target.value
      });
    }

    handleChecked(e) {
      const item = e.target.name;
      const isChecked = e.target.checked;
      const checkedArray = this.state.checkedHold;

      if (isChecked == true) {
        checkedArray.push(item)
        this.setState({ checkedHold: checkedArray });
      }

      else {
        var newArray = [];
        newArray = checkedArray.filter(el => el !== item)
        this.setState({ checkedHold: newArray });
      }

      console.log(this.state.checkedHold)
    }

    checkVal() {
      return(
        <div>{this.state.checkedHold}</div>
      )
    }

    renderQstDropdown() {
      return(
          <Select id="select" label="Type" className="col-md-8 col-offset-4" value={this.state.qstType} onChange={this.handleChange}>
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
            <Row>The problem with the above occurs when the browser window is smaller than the width of the element. The browser then adds a horizontal scrollbar to the page.
            </Row>
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
            The problem with the above occurs when the browser window is smaller than the width of the element. The browser then adds a horizontal scrollbar to the page.

              <RadioGroup defaultValue="female" aria-label="gender" name="customized-radios" value={this.state.radio} onChange={this.setRadio}>
                <FormControlLabel value="Choice 1" control={<Radio color="primary" />} label="Choice 1" />
                <FormControlLabel value="Choice 2" control={<Radio color="primary" />} label="Choice 2" />
                <FormControlLabel value="Choice 3" control={<Radio color="primary" />} label="Choice 3" />
                <FormControlLabel value="Choice 4" control={<Radio color="primary" />} label="Choice 4" />

              </RadioGroup>
            </Row>
          </div>
        )
      }
      if (this.state.qstType === "Check All") {
        return(
          <div>
          <Row>The problem with the above occurs when the browser window is smaller than the width of the element. The browser then adds a horizontal scrollbar to the page.</Row>
          <Row><FormControlLabel control={<Checkbox color="teal" name="Answer1" checked={this.state.checked} onChange={(e) => this.handleChecked(e)}/>}
                  label="Answer1" labelPlacement="end"/></Row>
          <Row><FormControlLabel control={<Checkbox color="teal" name="Answer2" checked={this.state.checked} onChange={(e) => this.handleChecked(e)}/>}
                  label="Answer2" labelPlacement="end"/></Row>
          <Row><FormControlLabel control={<Checkbox color="teal" name="Answer3" checked={this.state.checked} onChange={(e) => this.handleChecked(e)}/>}
                  label="Answer3" labelPlacement="end"/></Row>
          <Row><FormControlLabel control={<Checkbox color="teal" name="Answer4" checked={this.state.checked} onChange={(e) => this.handleChecked(e)}/>}
                  label="Answer4" labelPlacement="end"/></Row>
          </div>

        )
      }
      if (this.state.qstType === "Rating") {
        return(
          <div class="rating-div">
          The problem with the above occurs when the browser window is smaller than the width of the element. The browser then adds a horizontal scrollbar to the page.

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
                    <Col xs="6"><div text-align="left">Minimum Label</div></Col>
                    <Col xs="6"><div class="testing">Maximum</div></Col>
                  </Row>
                </Grid>
              </Grid>
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
                    <Row>
                      <Col md={{ span: 3, offset: 0 }} >
                        Choose Question Type: {this.renderQstDropdown()}
                      </Col>
                      <Col md={{ span: 5, offset: 0 }} >
                        <p>
                        {this.renderResult()}
                        </p>
                        {this.checkVal()}
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
