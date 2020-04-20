import { Checkbox, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Container, FormGroup} from 'react-bootstrap';
import React, { Component } from 'react';
import axios from 'axios';
import Slide from '@material-ui/core/Slide';

const surveyStates = {
    Written: 'Written',
    Deployed: 'Deployed',
    Closed: 'Closed'
  }

  function Transition(props) {
    return <Slide direction="up" {...props} />;
  }
export default class TurkSurvey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.location.state,
            reward:0.00,
            turkBalance: 0.00,
            country: null,
            subDivision: null,
            adult: false,
            hitUrl: null,
            successModal: false
                    
        }
    }


    changedReward = (evt) => {
        this.setState({reward: evt.target.value});
    }

    SubmitTurk = () => {
        let data = {
            'SurveyName': this.state.surveyName,
            'uniqueId': this.state.uniqueId,
            'projectUid': this.state.projectName.uid,
            'prototypes': JSON.stringify(this.state.chosenPrototypes),
            'conceptUid': '',
            'notes': this.state.surveyNotes,
            'qualifications': '',
            'questions': JSON.stringify(this.state.finalQuestionSet),
            'status': surveyStates.Deployed,
            'reward': this.state.reward,
            'country': this.state.country,
            'subDivision': this.state.subDivision,
        }
        axios.post('/api/survey/turk', data, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
        }).
        then(response => {
            this.setState({hitUrl: response.data});
            this.setState({successModal: true});
        });
    }

    componentDidMount = () => {
        this.getBalance();
    }

    handleCloseConfirmationModal = () =>{
        this.props.history.push({
            pathname: '/surveys',
            state: this.props.location.state
        })
    }
    getBalance = () => {
        axios.get("/api/survey/turk-balance",
        {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
        })
            .then(response => {
                this.setState({turkBalance: response.data});
            })
    }

    updateCountryCode = (evt) => {
        this.setState({country: evt.target.value });
    }

    updateSubDivision = (evt) => {
        this.setState({subDivision: evt.target.value });
    }
    adultChanged = (evt) => {
        this.setState({adult: evt.target.checked});
    }
    render () {
        return (
            <div class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>
                <Container>
                    <div class="d-flex align-content-between flex-column">
                        <h3>Survey Builder</h3>
                        <h5>Balance: $ {this.state.turkBalance}</h5>
                        <FormGroup>
                            <h5>Reward Amount</h5>
                            <TextField
                                id="standard-number"
                                onChange={this.changedReward}
                                value={this.state.reward}
                                type="number"
                                step="0.01"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                />
                        </FormGroup>
                        <FormGroup>
                            <h5>Regional Restrictions</h5>
                            <p>Enter an ISO 3166 compliant 2 digit country</p>
                            <TextField value={this.state.country} onChange={this.updateCountryCode} placeholder="US"></TextField>
                            <p>Enter an ISO 3166_2 compliant 2 digit state code</p>
                            <TextField value={this.subDivision} onChnage={this.updateSubDivision} placeholder="CA"></TextField>
                        </FormGroup>
                        <FormGroup>

                            <h5>Worker is over 18?</h5>
                            <Checkbox value={this.state.adult}></Checkbox>
                        </FormGroup>
                        <Button onClick={this.SubmitTurk} variant="success">Save and Submit</Button>
                    </div>
                </Container>
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
                            Hit Created Successfully.  Preview: {this.state.hitUrl}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={this.handleCloseConfirmationModal} variant="primary">close</Button>
                            
                        </DialogActions>
                        </Dialog>
                        </div>
            </div>

                       

        )
    }
}