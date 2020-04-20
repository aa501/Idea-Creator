import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
import './ProjectStimuli.css';

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


export default class ProjectStimuli extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stimulusTitle: '',
      stimulusDesc: '',
      stimulusLink: '',
      stimuli: [],
      userData: this.props.location.state.userData || this.props.userData,
      projectName: this.props.location.state.projectName,
      projectResearch1: this.props.location.state.projectResearch1,
      projectResearch2: this.props.location.state.projectResearch2,
      projectResearch3: this.props.location.state.projectResearch3,
      projectResearchLink3: this.props.location.state.projectResearchLink1,
      projectResearchLink2: this.props.location.state.projectResearchLink2,
      projectResearchLink1: this.props.location.state.projectResearchLink3,
      projectDefinition: this.props.location.state.projectDefinition,
      projectExclusions: this.props.location.state.projectExclusions,
      projectDescription: this.props.location.state.projectDescription,
      activeCheckboxes: [],
      inActiveCheckboxes: [],
      initStimuli: [],
      relatedStimuli: [],
      unrelatedStimulus: [],
      errorModal: false,
      successModal: false,
      anchorEl : null,
      openPopover : false,
      popOverLoading: null,
      popOverText: null
    }
  }

  handleOpenPopover = async (event, string) =>
  {

    this.setState({
      anchorEl : event.currentTarget,
      openPopover : true
    })
    await this.pullSyn(string);

  }

  pullSyn = async (string) => {
    string = string.replace(/ .*/, '');
    const response = await axios.post('/api/linguistic/test', {
      word: string
    },
      {
        headers: {
          Authorization: 'Bearer ' + this.state.userData.token
        }
      }).then(response => response.data).catch(err => {
        this.setState({
          popOverText: err.response.data.message,
          popOverLoading: true
        })
      });

    if (!this.state.popOverLoading) {
      var cleaned = [];
      response.forEach(function (itm) {
        var unique = true;
        cleaned.forEach(function (itm2) {
          if (itm === itm2) unique = false;
        });
        if (unique) cleaned.push(itm);
      })

      this.setState({
        popOverText: cleaned,
        popOverLoading: true
      })
    }

  }


  handleClosePopover = () =>
  {
    this.setState({
      anchorEL : null,
      openPopover : false,
      popOverLoading: null
    })
  }

  handleCloseErrorModal = () => {
    this.setState({
        errorModal: false
    });
  }

  openErrorModal = () => {
    this.setState({
        errorModal: true
    });
  }

  handleCloseSuccessModal = () => {
    this.setState({
        successModal: false
    });
  }

  openSuccessModal = () => {
    this.setState({
        successModal: true
    });
  }



  handleStimTitleChange = (event) => {
    this.setState({
      stimulusTitle: event.target.value
    });
  }

  handleStimDescriptionChange = (event) => {
    this.setState({
      stimulusDesc: event.target.value
    });
  }

  handleStimLinkChange = (event) => {
    this.setState({
      stimulusLink: event.target.value
    });
  }

  returnToDashboard = () => {
    this.props.history.push({
      pathname: '/home',
      state: { userData: this.state.userData } // need this for moving to different component
  });
  }

  addProject = async () => {

    await this.sortStimulus();

    axios.post('/api/project',
      {
        'title': this.state.projectName,
        'description': this.state.projectDescription,
        'definition' : this.state.projectDefinition, //project mission
        'problemStatement': {
          'content': this.state.projectName
        },
        'exclusions': [{
          'content': this.state.projectExclusions
        }],
        'areasOfResearch': [{
          'content': this.state.projectResearch1,
          'link': {
            'href': this.state.projectResearchLink1,
            'hrefName': this.state.projectResearchLink1
          }
        },
        {
          'content': this.state.projectResearch2,
          'link': {
            'href': this.state.projectResearchLink2,
            'hrefName': this.state.projectResearchLink2
          }
        },
        {
          'content': this.state.projectResearch3,
          'link': {
            'href': this.state.projectResearchLink3,
            'hrefName': this.state.projectResearchLink3
          }
        }
        ],
        'initStimulus': this.state.initStimuli,
        'relatedStimulus': this.state.relatedStimuli,
        'unrelatedStimulus': [
          {
            'content': 'yeet'
          }
        ],
      },
      {
        headers: {
          Authorization: 'Bearer ' + this.state.userData.token
        }
      }
    ).then(response => {
      this.uploadFiles(response.data);
    }).catch(() => {
      this.openErrorModal();
      this.setState({
        errorMessage: 'Error: Project could not be created!'
      });
    });



  }

  uploadFiles = (project) => {
    let formData = new FormData();
    this.props.location.state.files.map(file => {
        formData.append('Files', file);
    });
    formData.append('uid', project.uid);
    axios.post("/api/research/file/", formData, 
        {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token, //the token is a variable which holds the token
                'Content-Type': 'multipart/form-data'
            }
        }
        
    ).then(response => {
        this.setState({researchFiles: response.data});
        this.openSuccessModal();
        this.setState({
          successMessage: 'Project ' + this.state.projectName + ' has successfully been created!'
        });
    });
}

  sortStimulus = () => {
    let stimuli = this.state.stimuli
    let relatedStimuli = [];
    let initStimuli = [];

    stimuli.forEach((stimulus) => {

      let stimForCall = {
        'content' : stimulus.name,
        'description' :  stimulus.desc,
        'link' : {
            href : stimulus.link,
            hrefName : stimulus.link
          }
        }

        if(stimulus.isInitialStimulus === true){
          initStimuli.push(stimForCall);
        } else {
          relatedStimuli.push(stimForCall);
        }
    });

    this.setState({
      initStimuli,
      relatedStimuli
    });
  }

  addStimulus() {
    if (this.state.stimuli) {
      let stimStateTemp = this.state.stimuli
      let stimulusObject = {
        name: this.state.stimulusTitle,
        desc: this.state.stimulusDesc,
        link: this.state.stimulusLink,
        key: Math.floor((Math.random() * 1000000) + 1),
        isInitialStimulus: true
      }
      stimStateTemp.push(stimulusObject);

      this.setState({
        stimuli: stimStateTemp
      })

      this.resetValues()
    }
  }

  removeStimulus = (keyToDelete) => {
    var stim = this.state.stimuli;
    let itemToDelete = stim.findIndex(i => i.key === keyToDelete)
    stim.splice(itemToDelete, 1);
    this.setState({stimuli: stim});
  }

  resetValues = () => {
    this.setState({
      stimulusTitle: '',
      stimulusDesc: '',
      stimulusLink: ''
    })
  }

  resetAllValues = () => {
    this.setState({
      stimulusTitle: '',
      stimulusDesc: '',
      stimulusLink: '',
      stimuli: []
    })
  }



  handleToggleCheck = (stimuliCheck) => {
    console.log(stimuliCheck);
    let stimuli = this.state.stimuli;
    stimuli.forEach(stimuli => {
      if(stimuli === stimuliCheck){
        stimuli.isInitialStimulus = !stimuli.isInitialStimulus
      };
    });
    this.setState({
      stimuli
    });
  }




  render() {
    return (
      <div id='blue-card-container'>
        <h3 id="page-title">Stimulus Page</h3>
        <Container>
          <Row>
            <Col md={{ span: 6 }}>

              <TextField id="projectLink-input"
                value={this.state.stimulusTitle}
                onChange={this.handleStimTitleChange}
                placeholder="Stimulus Title"
                multiline
                rows="1"
                label="Stimulus Title"
                margin="normal"
                variant="outlined">
              </TextField>
              <TextField id="stimulusDesc-input"
                value={this.state.stimulusDesc}
                onChange={this.handleStimDescriptionChange}
                placeholder="Stimulus Description"
                multiline
                rows="1"
                label="Stimulus Description"
                margin="normal"
                variant="outlined">
              </TextField>


              <TextField id="stimulusLink-input"
                value={this.state.stimulusLink}
                onChange={this.handleStimLinkChange}
                placeholder="Link"
                multiline
                rows="1"
                label="Link"
                margin="normal"
                variant="outlined">
              </TextField>

              <div id='button-box'>
                <Button color='danger' id='clearStim' onClick={() => { this.resetAllValues() }}> <FontAwesomeIcon icon="undo" /> Reset</Button>
                <Button color='primary' id='addStim' disabled = {this.state.stimulusTitle === ''} onClick={() => { this.addStimulus() }}><FontAwesomeIcon icon="plus"/> Add Stimulus</Button>

              </div>
            </Col>
            <Col md={{ span: 6 }}>
            <Paper id="listContainer">
              <List>
                {this.state.stimuli.map(stimuli => {
                  return (
                    <ListItem key={stimuli.key} role={undefined} dense button onClick={() => {this.handleToggleCheck(stimuli)}}>
                      <ListItemIcon>
                      <Tooltip title="Is Initial Stimulus?">
                        <Checkbox
                          edge="start"
                          checked={stimuli.isInitialStimulus}
                          //tabIndex={-1}
                          disableRipple
                        />
                        </Tooltip>
                      </ListItemIcon>
                      <ListItemText primary={stimuli.name} secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {stimuli.desc}
                        </Typography>
                          {" - " + stimuli.link}
                      </React.Fragment> }/>
                        <ListItemSecondaryAction>
                        <Tooltip title="Get Insights">
                          <IconButton edge="end" aria-label="comments">
                            <FindReplaceIcon onClick={(event) => {this.handleOpenPopover(event, stimuli.name)}}/>
                          </IconButton>
                          </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton edge="end" aria-label="comments">
                            <DeleteIcon onClick={() => {this.removeStimulus(stimuli.key)}}/>
                          </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                    );
                  })}
              </List>
              </Paper>
              <div id='button-box-submit'>
              <Button color='success' id= 'button-box-submit' onClick={() => { this.addProject() }}><FontAwesomeIcon icon="project-diagram"/> Submit Project</Button>
            </div>
            </Col>
          </Row>

        </Container>

        <div >
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
        <div >
          <Dialog
            open={this.state.successModal}
            TransitionComponent={Transition}
            keepMounted
            maxWidth='lg'
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="responsibe-alert-dialog-slide-title">
              {this.state.successMessage}
            </DialogTitle>
            <DialogActions>
              <Button onClick={this.returnToDashboard} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Popover
          open={this.state.openPopover}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography id ='pop-text' > {this.state.popOverText && this.state.popOverLoading ? (
          <div>
            {typeof this.state.popOverText === 'string' ? (this.state.popOverText) : this.state.popOverText.map((x) =>{
            return <span>{(x.charAt(0).toUpperCase() + x.slice(1).replace('_'," "))}<br/></span>
          })
            }
            </div>
          )


          : <FontAwesomeIcon id = 'pop-icon' icon="circle-notch" spin /> }</Typography>
        </Popover>

      </div>

        );
      }
}
