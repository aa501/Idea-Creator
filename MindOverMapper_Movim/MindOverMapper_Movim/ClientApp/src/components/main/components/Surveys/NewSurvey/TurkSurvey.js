import { Checkbox, TextField, Button } from '@material-ui/core';
import { Container, FormGroup} from 'react-bootstrap';
import React, { Component } from 'react';
import axios from 'axios';

const surveyStates = {
    Written: 'Written',
    Deployed: 'Deployed',
    Closed: 'Closed'
  }
export default class TurkSurvey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.location.state,
            reward:0.00,
            turkBalance: 0.00,
            country: null,
            state: null
                    
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
        }
        axios.post('/api/survey/turk', data, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
        });
    }

    componentDidMount = () => {
        this.getBalance();
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
                            <TextField value={this.state.country} onChange={this.updateCountryCode}></TextField>
                            <p>Enter an ISO 3166_2 compliant 2 digit state code</p>
                            <TextField value={this.subDivision} onChnage={this.updateSubDivision}></TextField>
                        </FormGroup>

                        <Button onClick={this.SubmitTurk} variant="success">Save and Submit</Button>
                    </div>
                </Container>
            </div>
        )
    }
}