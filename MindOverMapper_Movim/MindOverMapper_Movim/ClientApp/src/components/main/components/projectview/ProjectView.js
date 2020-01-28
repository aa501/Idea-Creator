import React, { Component } from 'react';
import './ProjectView.css';
//import App from './mindmapper/App';
import MindMap from './mindmapper/component/MindMap';

export default class ProjectView extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        if(this.props.location.state === undefined){
            this.props.history.push({
                pathname: '/'
            });
        } else {
            this.setState({
                userData: this.props.location.state.userData,
                projectName: this.props.location.state.projectName
            });
        }
    }

    render() {
        return (
            <div>
                <MindMap userData={this.props.location.state.userData} projectInfo={this.props.location.state.projectName}/>
            </div>
            );
    }
}