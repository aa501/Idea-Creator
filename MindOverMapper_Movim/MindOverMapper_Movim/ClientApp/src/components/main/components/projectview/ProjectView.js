import React, { Component } from 'react';
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
            pushBack: ''
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

    viewProject = () => {
      return this.props.history.push({
          pathname: '/project-landing-page',
          state: this.state
      });
    }


    render() {
        return (
            <div>
                <MindMap userData={this.props.location.state.userData} projectInfo={this.props.location.state.projectName} projectConcept={this.callback} pushBack={this.viewProject}/>
            </div>
        );
    }
}
