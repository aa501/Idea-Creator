import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import TextField from '@material-ui/core/TextField';
import { Dialog, Card, CardContent } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Label, Input, CardTitle, Row } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { Container, Form, Button, FormGroup} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropzone from 'react-dropzone'
import './ProjectPrototype.css';


export default class ProjectPrototype extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: this.props.location.state.projectName,
            userData: this.props.location.state.userData || this.props.userData,
            prototypeName: '',
            prototypeDescription: '',
            files: [],
            prototypes: []
        }
    }

    componentDidMount = () => {
        axios.get('/api/prototype/', this.state.projectName.uid)
            .then(response => {
                this.setState({ prototypes: response.data });
            })
        console.log(this.props)
    }

    resetFields = () => {
        this.setState({
            prototypeName: '',
            prototypeDescription: '',
        })
    }

    handlePrototypeNameChange = (event) => {
        this.setState({
            prototypeName: event.target.value
        });
    }

    handlePrototypeDescriptionChange = (event) => {
        this.setState({
            prototypeDescription: event.target.value
        });
    }


    onDrop = (files) => {
        this.setState({ files: files });
    }



    submitPrototype = () => {
        let formData = new FormData();
        this.state.files.map(file => {
            formData.append('Files', file);
        });
        formData.append('ProjectId', this.state.projectName.uid);
        formData.append('prototypeName', this.state.prototypeName);
        formData.append('prototypeDescription', this.state.prototypeDescription);
        axios.post('/api/prototype',
            formData,
            {
                headers: {
                    Authorization: 'Bearer ' + this.state.userData.token,
                    'Content-Type': 'multipart/form-data'

                }
            })
            .then(response => {
                this.setState({ prototypes: [response.data, ...this.state.prototypes] });
            });
    }


    nextPage = () => {
        this.props.history.push({
            pathname: '/home',
            state: this.state  // need this for moving to different component
        });
    }


    render() {
        return (
            <div className='blue-card-container'>
                <h3 className="page-title">Prototypes</h3>
                <Container>
                        <div className='project-definition-holder'>
                        <TextField
                            value={this.state.prototypetName}
                            onChange={this.handlePrototypeNameChange}
                            label="Name"
                            margin="normal"
                            placeholder="Enter Name..."
                            variant="outlined">
                        </TextField>
                        </div>
                    <div className='project-definition-holder'>
                        <TextField
                            value={this.state.prototypeDescription}
                            onChange={this.handlePrototypeDescriptionChange}
                            label="Description"
                            margin="normal"
                            rows="4"
                            multiline
                            placeholder="Enter Description..."
                             variant="outlined">
                                </TextField>
                            </div>
                    <h4>Upload your files</h4>
                    <div className = "zone">
                    <Dropzone onDrop={this.onDrop} multiple>
                        {({ getRootProps, getInputProps, isDragActive, acceptedFiles}) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                    {isDragActive ? "Drop your file here" : 'Click or drag a file to upload'}
                                    <ul className="list-group mt-2">
                                        {acceptedFiles.length > 0 && acceptedFiles.map(acceptedFile => (
                                            <li className="list-group-item list-group-item-success">
                                                {acceptedFile.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Dropzone>
                            </div>
                    <Button variant="primary" type="submit" onClick={this.submitPrototype}>Upload</Button>
                    <Row>
                        {
                            this.state.prototypes.map(Item => 
                                <Card>
                                    <CardTitle>{Item.PrototypeName}</CardTitle>
                                    <CardContent>{Item.Description}
                                        <ul>
                                            { Item.PrototypePath.map(file => 
                                                <li>{file}</li>
                                            )
                                            }
                                        </ul>
                                    </CardContent>
                                    
                                </Card>       
                            )
                        }
                        
                    </Row>

                </Container>

                </div>
        );
    }
}
