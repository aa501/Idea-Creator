import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { Paper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Popover from '@material-ui/core/Popover';


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));


export default class ProjectSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.location.state.userData || this.props.userData,
        projectName: this.props.location.state.projectName,
        surveys: []

    }
  }

    componentDidMount() {
      try{
        axios.get('/api/survey/' + this.state.projectName.uid, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
        }
        ).then(response => {
            this.setState({ surveys: response.data });
        });
      } catch {}
    }

  returnToDashboard = () => {
    this.props.history.push({
      pathname: '/home',
      state: { userData: this.state.userData } // need this for moving to different component
  });
  }

    newSurvey = () => {
        this.props.history.push({
            pathname: '/new-survey',
            state: this.props.location.state
        })
    }

  render() {
    return (
      <div id='blue-card-container'>
            <Container>
                <h3 id="page-title">Survey Page</h3>
                <div>
                    <Button onClick={this.newSurvey}>New Survey</Button>
                </div>
                <Row>
                    <List subheader={<ListSubheader>Surveys</ListSubheader>} >
                        {this.state.surveys.map((survey) => {
                            return <ListItem>
                                <ListItemText primary={survey.surveyName} />

                            </ListItem>
                        })
                        }
                        </List>
          </Row>
        </Container>
      </div>
        );
      }
}
