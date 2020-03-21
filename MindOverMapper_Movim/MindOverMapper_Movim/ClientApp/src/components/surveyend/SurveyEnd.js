import React, { Component } from 'react';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, Form, FormGroup, FormText, Label, Input} from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import logo from '../../static/Logo.png';
import light from '../../static/Light.jpg'
import './SurveyEnd.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export class SurveyEnd extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    displayName = SurveyEnd.name;

    nextPage = () => {
        this.props.history.push({
            pathname: 'login',
            state: this.state  // need this for moving to different component
        });
    }

    render() {
        return (
            <div id='page-holder'>
                <img className='background' src={light}/>
                <div id='login-holder'>
                    <div id='login-container'>
                        <div id='logo-holder-logo' class="col-row">


                            <img id='login-logo' alt="Login Logo" src={logo} />


                        </div>


                        <div id='logo-holder-text' class="row-md">

                            <text id='logo-name-text'>Idea Creator</text>

                        </div>
                        <text id="label_temp">Survey Input/Button</text>
                    </div>
                </div>
            </div>
        );
    }
}
