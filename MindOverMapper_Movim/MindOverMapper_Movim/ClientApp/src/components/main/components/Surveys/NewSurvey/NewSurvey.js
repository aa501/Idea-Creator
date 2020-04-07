import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Container, Row, Col, FormGroup, InputGroup, Form, Input, Button, Card, Alert } from 'react-bootstrap';
import { List, ListSubheader, ListItem, ListItemText, Select, MenuItem, Dialog, DialogContent, DialogActions, Checkbox, RadioGroup, FormControlLabel, Radio, TextareaAutosize } from '@material-ui/core';
import axios from 'axios';

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
            prototypeDialog: false,
            pricingOptionId: null,
            idea: false,
            package: false,
            product: false,
            name: false,
            purchaseFrequency: false,
            purchasePrice: false,
            qualitative: false,
            demographics: false
        }
    }

    saveSurvey = (callback) => {
        this.validateSurvey();
        let survey = this.buildSurveyPayload();
        axios.post('/api/survey', {
             survey
            },
            {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token
            }
            }).then(response => {
                callback(response.data);
            }).catch(err => {

         });

    }

    save = () => {

    }

    saveAndPreview = () => {
        this.saveSurvey(this.preview);
    }

    preview = (survey) => {
        alert('Preview Code');
    }

    saveAndEmail = () => {
        this.saveSurvey(this.emailSurvey);
    }

    emailSurvey = (survey) => {
        axios.post('/api/survey/email', {
            surveyId: survey.id
        },
            {
                headers: {
                    Authorization: 'Bearer ' + this.state.userData.token
                }
            }).then(response => {

            }).catch(err => {

            });
    }

    turkSurvey = (survey) => {
        axios.post('/api/survey/turk', {
            surveyId: survey.id
        },
            {
                headers: {
                    Authorization: 'Bearer ' + this.state.userData.token
                }
            }).then(response => {

            }).catch(err => {

            });
    }

    saveAndTurk() {
        this.saveSurvey(this.turkSurvey);
    }

    buildSurveyPayload = () => {
        let survey = {
            surveyName: this.state.surveyName,
            concepts: this.state.concepts,
            prototypes: this.state.prototypes,
            idea: this.state.idea,
            package: this.state.package,
            product: this.state.product,
            name: this.state.name,
            purchaseFrequency: this.state.purchaseFrequency,
            qualitative: this.state.qualitative,
            demographics: this.state.demographics
        };
        return survey;
    }
    validateSurvey = () => {
        if (
            this.state.surveyName &&
            (this.state.prototypes.length > 0 || this.state.concepts.length > 0) &&
            this.state.pricingOptionId
        )
            return true;

        return false;
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

    pricingOptionChanged = (evt) => {
        this.setState({ pricingOptionId: evt.value });
    }

    ideaChanged = (evt) => {
        this.setState({ idea: evt.value });
    }

    packageChanged = (evt) => {
        this.setState({ package: evt.value });
    }
    productChanged = (evt) => {
        this.setState({ product: evt.value });
    }
    nameChanged = (evt) => {
        this.setState({ name: evt.value });
    }

    purchaseFrequencyChanged = (evt) => {
        this.setState({ purchaseFrequency: evt.value });
    }

    purchasePriceChanged = (evt) => {
        this.setState({ purchasePrice: evt.value });
    }

    demographicsChanged = (evt) => {
        this.setState({ demographics: evt.value });
    }

    qualitativeChanged = (evt) => {
        this.setState({demographics: evt.value})
    }
    render() {
        return (
            <div class="mx-auto shadow my-5 p-3">
                <Container>
                    <div class="d-flex align-content-between flex-column">
                        <h3>Rapid Test Start Survey Set Up</h3>

                        <FormGroup>
                            <TextField id="name" onChange={this.handleSurveyNameChange} fullWidth value={this.state.surveyName} label="1. Survey Name (Respondents will not see this name)" />
                        </FormGroup>
                        <FormGroup>
                            <h5>2. Check to include Demographics and Categorization Questions</h5>
                            <FormControlLabel
                                control={<Checkbox checked={this.demographics} onChange={this.demographicsChanged} name="demographics" />}
                                label="Check here if your survey will NOT be utilizing Amazon MTurk."
                            />

                        </FormGroup>

                        <FormGroup>
                               <h3>3.  Add Concepts</h3>
                                    <Alert variant="info">
                                        Please click the proper button below for the format you would like to test your idea as.
                                    </Alert>
                                    <div className="d-flex flex-wrap justify-content-around">
                                        <Button variant="success">
                                            Add a WRITTEN CONCEPT (Yellow Card)
                                        </Button>
                                        <Button variant="success">
                                            Add a CONCEPT PROTOTYPE IMAGE
                                        </Button>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <h5>
                                        4. Is price included in the concept(s)?
                                    </h5>
                                    <p>Important that this selection is correct, so the proper questions can be asked.</p>
                                    <RadioGroup name="pricing_option" value={this.pricingOptionId} onChange={this.pricingOptionChanged}>
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                        <FormControlLabel value="donate" control={<Radio />} label="No, but we want to know if they will donate. (non-profits)" />
                                    </RadioGroup>

                                </FormGroup>
                                <FormGroup>
                                    <h5>
                                        5. Type of Test - Concept and/or Experience
                                    </h5>
                                    <RadioGroup name="test_type" value={this.testTypeId} onChange={this.testTypeChanged}>
                                        <FormControlLabel value="concept" control={<Radio />} label="One Step - Test concept only" />
                                        <FormControlLabel value="experience" control={<Radio />} label="One Step - Test experience only" />
                                        <FormControlLabel value="both" control={<Radio />} label="Two Steps - Test concept AND experience offering" />
                                    </RadioGroup>
                                </FormGroup>
                                <FormGroup>
                                    <h5>
                                        6. How would you like to test the concepts?
                                    </h5>
                                    <RadioGroup name="comparison" value={this.comparisonTypeId} onChange={this.comparisonTypeChanged}>
                                        <FormControlLabel value="single" control={<Radio />} label="Single Concept Test" />
                                        <FormControlLabel value="paired" control={<Radio />} label="Paired Comparison Test (only if testing 2 concepts)" />
                                    </RadioGroup>
                                </FormGroup>
                                <FormGroup>
                                    <h5>7. Include additional qualitative questions</h5>
                                    <FormControlLabel
                                        control={<Checkbox checked={this.qualitative} onChange={this.qualitativeChanged} name="qualitative" />}
                                        label="Open Question Bank"
                                    />
                                </FormGroup>
                                <FormGroup className="d-flex flex-column">
                                    <h5>8. Select Specific Likes and Dislikes</h5>
                                    <p>These will be asked for each idea tested</p>
                                    <FormControlLabel
                                            control={<Checkbox checked={this.idea} onChange={this.ideaChanged} name="idea" />}
                                            label="Idea"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={this.package} onChange={this.packageChanged} name="package" />}
                                        label="Package"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={this.product} onChange={this.productChanged} name="product" />}
                                        label="Product"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={this.name} onChange={this.nameChanged} name="name" />}
                                        label="Name"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={this.purchaseFrequency} onChange={this.purchaseFrequencyChanged} name="purchase_frequency" />}
                                        label="Purchase Frequency"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={this.purchasePrice} onChange={this.purchasePriceChanged} name="purchase_price" />}
                                        label="Purchase Price"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <h5>9. Survey Comments (Optional)</h5>
                                        <p>This space is here to record any notes you might have such as who will respond or how the data will be collected</p>
                                        <TextField fullWidth label="Survey Comments" multiline rows={3} placeholder="Examples:
    How and/or where responses will be collected
    More information on the ideas and/or products tested." />
                                </FormGroup>
                                <FormGroup>
                                    <h2>Connect Research with Innovation Projects</h2>
                                    <p>Select Projects: The project team will have access to this test.</p>
                                    <p>Hold the control key(windows) or command key (mac) to select multiple</p>
                                </FormGroup>


                    <div class="d-flex justify-content-around flex-row">
                            <Button onClick={this.cancel} >Cancel</Button>
                            <span>
                                <Button>Save and Exit</Button>
                                <Button variant="success" onClick={this.saveAndPreview}>Save and Preview Survey</Button>
                                <Button variant="success" onClick={this.saveAndEmail}>Save and Email</Button>
                                <Button variant="success" onClick={this.saveAndTurk}>Save and Collect Live</Button>
                            </span>

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
