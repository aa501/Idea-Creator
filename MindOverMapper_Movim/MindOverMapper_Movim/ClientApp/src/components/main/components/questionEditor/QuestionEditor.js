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
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import './QuestionEditor.css';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class QuestionEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: this.props.location.state.projectName,
            userData: this.props.location.state.userData || this.props.userData,
            subQuestion: '',
            qstType: 'Concept',
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

    goBack = () => {
      this.props.history.push({
          pathname: '/concept-view',
          state: this.state  // need this for moving to different component
      });
    }

    submitQuestion = () => {
      axios.post('/api/project/submit-question',
      {
          'text': this.state.subQuestion,
          'type': this.state.qstType,
          'notes': '',
          'archived': 'No'
      },
      {
          headers: {
            Authorization: 'Bearer ' + this.state.userData.token
          }
      }).then(() => {
          this.openSuccessModal();
        }).catch(() => {
          this.openErrorModal();
        });
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

    render() {

        return (
            <div className='concept-question-container'>
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

                    <NavItem role="menuitem" eventKey="add-question" onClick={()=> this.goBack()}>
                        <NavIcon>
                            <FontAwesomeIcon icon="arrow-left" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                        </NavIcon>

                        <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                            Back to Concepts
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


            <div id="concept-main-content">
                <div class="mx-auto shadow my-5 p-3" style={{width: "80%", backgroundColor: "white"}}>
                <Container>
                    <h3>Add Question</h3>
                    <hr />
                        <h6>Submit new questions for surveys or concepts.</h6>
                        <div class="d-flex justify-content-around flex-row">
                          <TextField id="concept-field"
                              value={this.state.subQuestion}
                              onChange={this.handleSubQuestionChange}
                              label="Question to Submit"
                              multiline
                              rows="3"
                              width="500px"
                              margin="normal"
                              placeholder="Enter your new concept question here..."
                              variant="outlined">
                            </TextField>
                        </div>
                        <div align="right">
                            <br />
                            <Button class="qsn-btn" color='warning' onClick={this.resetFields}><FontAwesomeIcon icon="eraser" /> Clear</Button>
                            {"        "}
                            <Button class="qsn-btn" color='primary' onClick={this.submitQuestion}><FontAwesomeIcon icon="check" /> Submit Question</Button>
                        </div>
                    </Container>
                </div>
              </div>

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
                    Question failed to submit!
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={this.handleCloseErrorModal} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <div>
                <Dialog
                  open={this.state.successModal}
                  TransitionComponent={Transition}
                  keepMounted
                  maxWidth='lg'
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle id="responsibe-alert-dialog-slide-title">
                    Question Submitted!
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={this.handleCloseSuccessModal} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
          </div>
        );
    }
}
