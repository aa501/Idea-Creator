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
import { Route } from 'react-router';
import { LayoutS } from './navigationS/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SurveyView from './components/surveyView/SurveyView.js';
import SurveyLandingPage from './components/surveyLandingPage/SurveyLandingPage.js';


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
            pathname: 'survey-landing-page',
            state: this.state  // need this for moving to different component
        });
    }

    render() {
          return (
              <div>
                  {this.state ? (
                      <LayoutS>
                          <Route exactpath='/survey-landing-page' component={SurveyLandingPage} />
                          <Route exact path='/survey-view' component={SurveyView} />
                      </LayoutS>
                  ): (null)}
              </div>
              );
    }
}
