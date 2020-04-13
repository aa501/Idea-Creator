import React, { Component } from 'react';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import logo from '../../static/new-logo-crop-wide.jpg';
import background from '../../static/background.mp4';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            recoveryEmail: '',
            loginError: false,
            errorMessage: '',
            passwordRegex : new RegExp("(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$"),
            registrationModal: false,
            recoverPasswordModal: false,
            errorModal: false,
            recoveryCode: '',
            recoveryPassword1: '',
            registerFirstName: '',
            registerLastName: '',
            registerPassword:'',
            registerEmail: ''
        }
    }

    displayName = Login.name;

    validateForm() {
        return this.state.userName.length > 0 && this.state.password.length > 0;
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        });
    }

    handleUserNameChange = event => {
        this.setState({
            userName: event.target.value
        });
    }

    handleRecoveryEmail = (event) => {
        this.setState({
            recoveryEmail: event.target.value
        });
    }

    handleClickOpenForgotPassword = () => {
        this.setState({ openForgotPassword: true});
    };


    handleCloseForgotPassword = () => {
        this.setState({ 
            openForgotPassword: false,
        });
    };

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleCloseRegisterAccount = () => {
        this.setState({
            registrationModal: false
        });
    }

    openRegisterAccount = () => {
        this.setState({
            registrationModal: true
        });
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
    

    handleRegisterEmailChange = (event) => {
        this.setState({
            registerEmail: event.target.value
        });
    }

    handleRegisterPasswordChange = (event) => {
        this.setState({
            registerPassword: event.target.value
        });
    }

    handleRegisterFirstNameChange = (event) => {
        this.setState({
            registerFirstName: event.target.value
        });
    }

    handleRegisterLastNameChange = (event) => {
        this.setState({
            registerLastName: event.target.value
        });
    }

    handleRecoveryCode = (event) => {
        this.setState({
            recoveryCode: event.target.value
        });
    }

    handleRecoveryPassword1 = (event) => {
        this.setState({
            recoveryPassword1: event.target.value
        });
    }

    handleRecoveryPassword2 = (event) => {
        this.setState({
            recoveryPassword2: event.target.value
        });
    }

    openRecoverPassword = () => {
        this.setState({
            recoverPasswordModal: true
        });
    }

    handleCloseRecoverPassword = () => {
        this.setState({
            recoverPasswordModal: false
        });
    }

    handleSubmit = async (event) => {
        let userData = {};
       
        userData.userName = this.state.userName;
        userData.password = this.state.password;       

        this.validate(userData.userName, userData.password).then((response)  => { 
        if (response.data.token) {
            this.props.history.push({
                pathname: '/home',
                state: { userData: response.data } // need this for moving to different component
            });
        }
    }).catch(err => {
            this.setState({
                errorModalMessage : "Incorrect Login Information"
            });
            this.openErrorModal();
        });
    }

    submitAccountRegistration = async () => {
        let response =  await axios.post('/api/auth/register',    
            {
                'email': this.state.registerEmail,            
                'password': this.state.registerPassword,
                'firstName': this.state.registerFirstName,
                'lastName': this.state.registerLastName
            }).then(res => console.log(res)).catch(err => 
                {
                    this.setState({
                        errorModalMessage : err.response.data.message
                    });
                this.openErrorModal();
                }
                );      
                
                // close modal

                if(this.state.errorModal == false)
                {
                    this.setState({
                        registrationModal : false,
                        errorModalMessage : 'Successfully Registered!'
                    });
                    this.openErrorModal();
           
                }
    }


    validate = async (userName, password) => {
        let response =  await axios.post('api/auth/login',    
            {
                'email': userName,            
                'password': password,
            });

        return response;
    }

    submitRecoveryEmail = async () => {
        let response = await axios.post('/api/auth/grant', {
            'email': this.state.recoveryEmail
        });
        if(response.status === 200){
            this.setState({
                recoveryGrant: response.data.grant,
                recoverPasswordModal: true
            });
        }
    }

    recoverAccount = async () => {
        let response = await axios.post('/api/auth/recover', {
            'grant': this.state.recoveryGrant,
            'code': this.state.recoveryCode,
            'newPassword': this.state.recoveryPassword2
        }).catch(err => {
            this.setState({
                errorModalMessage : "Incorrect Reset Information"
            });
            this.openErrorModal();
        });;

        if(this.state.errorModal == false){
            this.setState({
                recoveryPassword1: '',
                recoveryPassword2: '',
                recoveryCode: '',
                recoverPasswordModal: false,
                openForgotPassword: false
            });
        }
        
    }

    handleKeyDown = (event) => {
        if(event.keyCode === 13 && this.state.userName !== '' && this.state.userName != null)
        {
            this.handleSubmit();
        }
    }

    render() {
        return (
            <div id='page-holder' class="container">
                        
                <div id='display' class=" text-center">

                    <div id='login-container' style={{ boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",background: "white", width: "100%", height: "380px", marginLeft: "15%"}} class="row text-center">

                        <div class="col" style={{ height: "100%", margin: "0%", padding: "0%" }}> 
                              <img id='login-logo-2' alt="Login Logo" src={logo} />
                        </div>

                        <div class="col text-center" style={{ background: "white", margin: "0%" }}>
                            <div id='text' style={{ marginTop: "18px", fontSize: "18px", fontWeight: "600", color: "#606060" }}>Login to Idea Creator</div>

                            <div id='username-field' style={{ width: "100%" }}>

                            <input type="email" style={{background: "white", color: "black"}} autofocus class="form-control" id="userName-input" placeholder="Email"
                                value={this.state.userName} onChange={this.handleUserNameChange} />
                        </div>
                        <div id='password-field' style={{ width: "100%" }}>

                            <input type="password" style={{ background: "white", color: "black" }} class="form-control" id="password-input"
                                onKeyDown={this.handleKeyDown} placeholder="Password" value={this.state.password}
                                onChange={this.handlePasswordChange} />
                        </div>


                            <div class="form-check" style={{ fontColor: "black" }} id='remember-me'>
                            <input type="checkbox" class="form-check-input" id="rememberme-check" />
                                <label class="form-check-label" style={{fontColor: "black"}} for="rememberme-check">Remember Me?</label>
                        </div>

                            <button type="submit" style={{ width: "100%", backgroundColor: "#0292D1" }} class="btn btn-lg" id='submit-button'
                            onClick={this.handleSubmit}>Login
                        </button>


                        <Button color="link" id='forgot-pass' onClick={this.handleClickOpenForgotPassword}>Forgot
                            password?</Button>


                        <Button color="link" id='register' onClick={this.openRegisterAccount}>Create
                            Account <FontAwesomeIcon icon="user-plus" /></Button>




                        <div >
                            <Dialog
                                open={this.state.openForgotPassword}
                                TransitionComponent={Transition}
                                keepMounted
                                maxWidth='md'
                                onClose={this.handleCloseForgotPassword}
                                aria-labelledby="alert-dialog-slide-title"
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle id="responsibe-alert-dialog-slide-title">
                                    {"Password Recovery"}
                                </DialogTitle>
                                <DialogContent>
                                    <Form>
                                        <FormGroup>
                                            <Label for="userName">Email Address: </Label>
                                            <Input type="text" class="form-control" id="user-name" placeholder="Email" value={this.state.recoveryEmail} onChange={this.handleRecoveryEmail} />
                                        </FormGroup>
                                        <DialogActions>                   
                                            <Button color="danger" onClick={this.handleCloseForgotPassword}>Cancel</Button>
                                            <Button color="primary" id='continue-password' onClick={this.submitRecoveryEmail} disabled={this.state.recoveryEmail.length < 1}>Continue</Button>
                                        </DialogActions>
                                    </Form>
                                </DialogContent>
                            </Dialog> 
                        </div>
                        <div >
                            <Dialog
                                open={this.state.recoverPasswordModal}
                                TransitionComponent={Transition}
                                keepMounted
                                maxWidth='md'
                                aria-labelledby="alert-dialog-slide-title"
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle id="responsibe-alert-dialog-slide-title">
                                    {"Update Password"}
                                </DialogTitle>
                                <DialogContent>
                                    <Form>
                                        <FormGroup>
                                            <Label for="userName">Code: </Label>
                                            <Input type="text" class="form-control" id="user-name" placeholder="" value={this.state.recoveryCode} onChange={this.handleRecoveryCode} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="userName">Password: </Label>
                                            <Input type="password" class="form-control" id="user-name" placeholder="" value={this.state.recoveryPassword1} onChange={this.handleRecoveryPassword1} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="userName">Verify Password: </Label>
                                            <Input type="password" class="form-control" id="user-name" placeholder="" value={this.state.recoveryPassword2} onChange={this.handleRecoveryPassword2} />
                                        </FormGroup>
                                        <DialogActions>                   
                                            <Button color="danger" onClick={this.handleCloseRecoverPassword}>Cancel</Button>
                                            <Button color="primary" id='continue-password' onClick={this.recoverAccount} disabled={(this.state.recoveryPassword1 !== this.state.recoveryPassword2) || (this.state.recoveryPassword1.length < 1) || (this.state.recoveryCode.length <1)}>Continue</Button>
                                        </DialogActions>
                                    </Form>
                                </DialogContent>
                            </Dialog> 
                        </div>
                        <div >
                            <Dialog
                                open={this.state.registrationModal}
                                TransitionComponent={Transition}
                                keepMounted
                                maxWidth='lg'
                                onClose={this.handleCloseRegisterAccount}
                                aria-labelledby="alert-dialog-slide-title"
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle id="responsibe-alert-dialog-slide-title">
                                    {"Account Registration"}
                                </DialogTitle>
                                <DialogContent>
                                    <Form>
                                        <FormGroup>
                                            <Label for="userName">Email Address: </Label>
                                            <Input type="email" class="form-control" id="user-name" placeholder="" value={this.state.registerEmail} onChange={this.handleRegisterEmailChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="userName">Password: </Label>
                                            <Input type="password" class="form-control" id="user-name" placeholder="" value={this.state.registerPassword} onChange={this.handleRegisterPasswordChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="userName">First Name: </Label>
                                            <Input type="text" class="form-control" id="user-name" placeholder="" value={this.state.registerFirstName} onChange={this.handleRegisterFirstNameChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="userName">Last Name: </Label>
                                            <Input type="text" class="form-control" id="user-name" placeholder="" value={this.state.registerLastName} onChange={this.handleRegisterLastNameChange} />
                                        </FormGroup>
                                        <DialogActions>                   
                                            <Button color="danger" onClick={this.handleCloseRegisterAccount}>Cancel</Button>
                                            <Button color="primary" disabled ={(this.state.registerFirstName.length < 1) || (this.state.registerLastName.length <1 || this.state.registerPassword.length < 8 || this.state.registerEmail.length < 3)} id='continue-password' onClick={this.submitAccountRegistration}>Continue</Button>
                                        </DialogActions>
                                    </Form>
                                </DialogContent>
                            </Dialog> 
                        </div>
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
                                    {this.state.errorModalMessage}
                                </DialogTitle>
                                <DialogActions>
                                    <Button onClick={this.handleCloseErrorModal} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}