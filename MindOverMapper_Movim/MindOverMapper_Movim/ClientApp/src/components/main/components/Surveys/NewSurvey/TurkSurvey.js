import { Checkbox, TextField, Button } from '@material-ui/core';
import { Container, FormGroup} from 'react-bootstrap';
import React, { Component } from 'react';
import axios from 'axios';

export default class TurkSurvey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.location.state,
            reward:0.00,
                    
        }
    }


    changedReward = (evt) => {
        this.setState({reward: evt.target.value});
    }

    SubmitTurk = () => {
        let data = this.state;
        axios.post('/api/survey/turk', data, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
        });
    }
    render () {
        return (
            <div class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>
                <Container>
                    <div class="d-flex align-content-between flex-column">
                        <h3>Survey Builder</h3>

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

                        <Button onClick={this.SubmitTurk} variant="success">Save and Submit</Button>
                    </div>
                </Container>
            </div>
        )
    }
}