import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Container, Row, Col, FormGroup, InputGroup, Form, Input, Button } from 'react-bootstrap';
import { List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
export default class NewSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData || this.props.userData,
            projectName: this.props.location.state.projectName,
            surveyName: '',
            questions: []
        }
    }

    handleSurveyNameChange = (event) => {
        this.setState({
            surveyName: event.target.value
        });
    }

    cancel = () => {
        this.props.history.push({
            pathname: '/surveys',
            state: { userData: this.state.userData } 
        });
    }

    render() {
        return (
            <div id='blue-card-container'>
                <Container>
                    <h3>Create a new Survey</h3>
                    <FormGroup>
                        <InputLabel>Survey Name</InputLabel>
                        <TextField id="name" onChange={this.handleSurveyNameChange} value={this.state.surveyName} />
                    </FormGroup>

                    <FormGroup>
                        <List subheader={<ListSubheader>Questions</ListSubheader>} >
                            {this.state.questions.map((question) => {
                                return <ListItem>
                                    <ListItemText primary={question.text} />

                                </ListItem>
                            })
                            }
                        </List>
                    </FormGroup>
                    <div class="d-flex justify-content-around flex-row">
                    <Button>Save</Button>
                        <Button variant="danger" onClick={this.cancel} >Cancel</Button>
                        </div>
                </Container>
            </div>
        );
    }
}