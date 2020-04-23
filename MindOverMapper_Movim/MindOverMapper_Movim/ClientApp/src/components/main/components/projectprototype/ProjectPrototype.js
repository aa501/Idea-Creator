import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import TextField from '@material-ui/core/TextField';
import { Dialog, Card, CardContent, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Label, Input, CardTitle, Row } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { Container, Form, Button, FormGroup} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropzone from 'react-dropzone'
import * as FileSaver from 'file-saver';
import './ProjectPrototype.css';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

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
        axios.get('/api/prototype/' + this.state.projectName.uid, {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token,
                'Content-Type': 'multipart/form-data'

            }
        })
            .then(response => {
                let prototypes = response.data;
                this.setState({ prototypes: prototypes });
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
        formData.append('projectUid', this.state.projectName.uid);
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
            }).catch(() => {
          console.log("Failure");
          });
        }


    nextPage = () => {
        this.props.history.push({
            pathname: '/home',
            state: this.state  // need this for moving to different component
        });
    }

    projectPaths = (item) => {
        let pathArray = JSON.parse(item.prototypePath);
        console.log(pathArray);
        return pathArray;
    }

    downloadFile = (file) => {
        axios.get('/api/prototype/file/' + file, {
            responseType: 'arraybuffer',
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token,
                'Content-Type': 'text/html'

            }
        })
            .then(response => {
                let downloadedFile = new Blob([response.data], { type: response.headers['content-type'] })
                FileSaver.saveAs(downloadedFile, file);
            });
    }

    pushToMindMap = () => {
        this.props.history.push({
            pathname: '/project-view',
            state: this.state  // need this for moving to different component
        });
    }

    pushToResearch = () => {
        this.props.history.push({
            pathname: '/project-research-editing',
            state: this.state  // need this for moving to different component
        });
    }

    pushToConcepts = () => {
        this.props.history.push({
            pathname: '/concept-view',
            state: this.state  // need this for moving to different component
        });
    }

    pushToSurveys = () => {
        this.props.history.push({
            pathname: '/surveys',
            state: this.state  // need this for moving to different component
        });
    }

    pushToPrototypes = () => {
        this.props.history.push({
            pathname: '/add-prototype',
            state: this.state  // need this for moving to different component
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

    navProject = () => {
        this.props.history.push({
            pathname: '/project-landing-page',
            state: this.state  // need this for moving to different component
        });
    }

    render() {
        return (

            <div id="prototype-container">

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

                        <NavItem expanded="true" role="menuitem" eventKey="project">
                            <NavIcon>
                                <FontAwesomeIcon icon="cogs" id="dash-icon" style={{ fontSize: '1.1em', color: "black" }} />
                            </NavIcon>
                            <NavText id="nav-text" style={{ paddingTop: 15, paddingRight: 28, fontSize: 16 }}>
                                Project Options
                            </NavText>
                            <NavItem eventKey="options" onClick={() => this.navProject()}>
                                <NavText id="subnav">
                                    Project Home
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToResearch}>
                                <NavText id="subnav">
                                    Research
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToConcepts}>
                                <NavText  id="subnav">
                                    Concepts
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToMindMap}>
                                <NavText id="subnav">
                                    Mind Map
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToPrototypes}>
                                <NavText style={{ color: "#0283C4" }} id="subnav">
                                    Prototypes
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="options" onClick={this.pushToSurveys}>
                                <NavText id="subnav">
                                    Surveys
                                </NavText>
                            </NavItem>
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

                <div id="prototype-main-content">
                    <div>
                        <h3 id="subtitle">Prototypes</h3>
                        <hr style={{ width: "30%" }} id="hr-1" />
                    </div>
                    <div align="center">
                    <TableContainer style={{ width: "80%" }} component={Paper}>
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          { this.state.prototypes.map((Item) => (
                              <TableRow>
                                  <TableCell style={{maxWidth:"130px", wordWrap: 'break-word'}}>{Item.prototypeName}</TableCell>
                                  <TableCell style={{maxWidth:"500px", wordWrap: 'break-word'}}>{Item.prototypeDescription}</TableCell>
                                  <TableCell style={{maxWidth:"70px"}}>{this.projectPaths(Item).map(file =>
                                                   <a href="javascript:void(0);" onClick={() => { this.downloadFile(file) }}><Button>Download</Button></a>)
                                             }</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      </div>
                      <div hidden={this.state.userData.type != "admin"}>
                        <div>
                        <p></p>
                            <h5 id="subtitle">Add Prototype</h5>
                            <hr style={{ width: "30%" }} id="hr-1" />
                        </div>
                        <div class="mx-auto shadow my-5 p-3" style={{width: "60%", backgroundColor: "white"}}>
                          <Container>
                          <div className='prototype-definition-holder'>
                              <TextField style={{width: "400px"}}
                                  value={this.state.prototypetName}
                                  onChange={this.handlePrototypeNameChange}
                                  label="Name"
                                  margin="normal"
                                  placeholder="Enter Name..."
                                  variant="outlined">
                              </TextField>
                          </div>
                          <div className='prototype-definition-holder'>
                              <TextField style={{width: "400px"}}
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
                                  <div className="zone">
                                      <Dropzone onDrop={this.onDrop} multiple>
                                          {({ getRootProps, getInputProps, isDragActive, acceptedFiles }) => (
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
                        <div>
                    <Button style={{width: "100px", marginTop: "10px"}} variant="primary" type="submit" onClick={this.submitPrototype}>Upload</Button>
                    </div>
                </Container>
                </div>
                </div>
          </div>
          </div>
        );
    }
}
