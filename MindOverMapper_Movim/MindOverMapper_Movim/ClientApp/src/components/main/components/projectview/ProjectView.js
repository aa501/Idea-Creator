import React, { Component } from 'react';
import './ProjectView.css';
//import App from './mindmapper/App';
import MindMap from './mindmapper/component/MindMap';
import Toolbar from './mindmapper/component/Toolbar';

export default class ProjectView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: this.props.location.state.userData,
            projectName: this.props.location.state.projectName,
            projectConcept: '',
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

    render() {
        return (
            <div>
                <MindMap userData={this.props.location.state.userData} projectInfo={this.props.location.state.projectName} projectConcept={this.callback}/>
            </div>
            );
    }
}
