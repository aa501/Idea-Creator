import React, { Component } from 'react';
import axios from 'axios';
import './ProjectView.css';
//import App from './mindmapper/App';
import MindMap from './mindmapper/component/MindMap';
import Toolbar from './mindmapper/component/Toolbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';


export default class ProjectView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: this.props.location.state.userData,
            projectName: this.props.location.state.projectName,
            projectConcept: '',
            bestIdea: '',
            pushBack: '',
          }
    }

    componentDidMount() {
        if (this.props.location.state === undefined) {
            this.props.history.push({
                pathname: '/'
            });
        } else {
            this.setState({
                userData: this.props.location.state.userData,
                projectName: this.props.location.state.projectName,
            });
        }
        this.getBestIdea();
    }

    componentWillReceiveProps(props) {
        console.log(props)
    }

    callback = (title) => {
        this.setState({
            projectConcept: title
        }, () => {
        return this.props.history.push({
            pathname: '/concept',
            state: this.state
        });
      });
    };

    setBestIdea = (bestIdea) => {
      axios.post('/api/project/promising-idea',
          {
              'idea': bestIdea,
              'projectUid': this.state.projectName.uid,
          },
        {
        headers: {
          Authorization: 'Bearer ' + this.state.userData.token
        }
      });
        this.setState({
            modalIsOpen2: !this.state.modalIsOpen2
        });
    }

    getBestIdea = async () => {
      console.log(this.state.projectName.uid);
      var uid = this.state.projectName.uid;
      const response = await axios.get(`/api/project/${uid}/promising-idea`, {
          headers: {
              Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
          }
      }).then(response => response.data);
      console.log(await response + "...");
    }

    viewProject = () => {
      return this.props.history.push({
          pathname: '/project-landing-page',
          state: this.state
      });
    }


    render() {
        return (
            <div>
                <MindMap userData={this.props.location.state.userData} projectInfo={this.props.location.state.projectName} bestIdea={this.setBestIdea} projectConcept={this.callback} pushBack={this.viewProject}/>
            </div>
        );
    }
}
