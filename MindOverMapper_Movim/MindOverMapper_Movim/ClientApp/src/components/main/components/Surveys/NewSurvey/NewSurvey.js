import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Container, Row, Col, FormGroup, InputGroup, Form, Input, Button, Card } from 'react-bootstrap';
import { List, ListSubheader, ListItem, ListItemText, Select, MenuItem, Dialog, DialogContent, DialogActions } from '@material-ui/core';


export default class NewSurvey extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData || this.props.userData,
            projectName: this.props.location.state.projectName,
            surveyName: '',
            questions: [],
            concepts: [],
            prototypes: [],
            questionDialog: false,
            conceptDialog: false,
            prototypeDialog: false
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

    addQuestion = () => {
        this.setState({ questionDialog: true });
    }

    questionDialogClose = () => {
        this.setState({ questionDialog: false });
    }

    addConcept = () => {
        this.setState({ conceptDialog: true });
    }

    addPrototype = () => {
        this.setState({ prototypeDialog: true });
    }

    conceptDialogClose = () => {
        this.setState({ conceptDialog: false });
    }

    prototypeDialogClose = () => {
        this.setState({ prototypeDialog: false });
    }
    render() {
        return (
            <div id='blue-card-container'>
                <Container>
                    <div class="d-flex align-content-between flex-column">
                    <Card>
                        <Card.Body>
                    <h3>Create a new Survey</h3>

                    <FormGroup>
                        <InputLabel>Survey Name</InputLabel>
                        <TextField id="name" onChange={this.handleSurveyNameChange} value={this.state.surveyName} />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel id="survey_type_label">Survey Type</InputLabel>
                        <Select id="survey_type" value="0">
                            <MenuItem value="0">Email</MenuItem>
                            <MenuItem value="1">Amazon Turk</MenuItem>
                            </Select>
                            </FormGroup>
                            </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <FormGroup>
                                <InputLabel id="add_concept_label"></InputLabel>
                                <Button onClick={this.addConcept}>Add Concept</Button>
                                <List subheader={<ListSubheader>Concepts</ListSubheader>} >
                                    {this.state.concepts.map((concept) => {
                                        return <ListItem>
                                            <ListItemText primary={concept.text} />

                                        </ListItem>
                                    })
                                    }
                                 </List>
                            </FormGroup>
                        </Card.Body>    
                    </Card>

                    <Card>
                        <Card.Body>
                            <FormGroup>
                                <InputLabel id="add_concept_label"></InputLabel>
                                <Button onClick={this.addPrototype}>Add Prototype</Button>
                                <List subheader={<ListSubheader>Prototypes</ListSubheader>} >
                                    {this.state.prototypes.map((prototype) => {
                                        return <ListItem>
                                            <ListItemText primary={prototype.text} />

                                        </ListItem>
                                    })
                                    }
                                </List>
                            </FormGroup>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <FormGroup>
                                <div class="d-flex justify-content-end">
                                    <Button onClick={this.addQuestion}>Add Question</Button>
                                </div>
                                <List subheader={<ListSubheader>Questions</ListSubheader>} >
                                    {this.state.questions.map((question) => {
                                        return <ListItem>
                                            <ListItemText primary={question.text} />

                                        </ListItem>
                                    })
                                    }
                                </List>
                                </FormGroup>
                            </Card.Body>
                        </Card>
                    <div class="d-flex justify-content-around flex-row">
                    <Button>Save</Button>
                        <Button variant="danger" onClick={this.cancel} >Cancel</Button>
                        </div>
                        <Dialog open={this.state.questionDialog} >
                            <DialogContent dividers>
                                <h3>Question List</h3>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.questionDialogClose}>Close</Button>
                            </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.conceptDialog} >
                        <DialogContent dividers>
                            <h3>Concept List</h3>
                            <p>Select a concept from here</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.conceptDialogClose}>Close</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.prototypeDialog} >
                        <DialogContent dividers>
                            <h3>Prototype List</h3>
                            <p>Select a protype from the list</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.prototypeDialogClose}>Close</Button>
                        </DialogActions>
                        </Dialog>
                    </div>
                </Container>
               

            </div>
            
        );
    }
}