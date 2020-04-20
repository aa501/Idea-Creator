import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './navigation/Layout';
import DashBoard  from './components/dashboard/Dashboard.js';
import ProjectDefinition from './components/projectdefinition/ProjectDefinition.js'
import ProjectResearch from './components/projectresearch/ProjectResearch.js'
import ProjectResearchEditing from './components/projectResearchEditing/ProjectResearchEditing.js';
import AdminPanel from './components/admin/AdminPanel.js';
import ProjectView from './components/projectview/ProjectView.js'
import ProjectStimuli from './components/projectStimuli/ProjectStimuli.js';
import Concept from './components/concept/Concept.js';
import ConceptView from './components/conceptView/ConceptView.js';
import ConceptQuestion from './components/conceptQuestion/ConceptQuestion.js';
import QuestionEditor from './components/questionEditor/QuestionEditor.js';
import ProjectLandingPage from './components/projectLandingPage/projectLandingPage.js';
import ProjectPrototype from './components/projectprototype/ProjectPrototype.js';
import ProjectSurvey from './components/Surveys/ProjecctSurvey.js';
import NewSurvey from './components/Surveys/NewSurvey/NewSurvey.js';
import SurveyAnalytics from './components/Surveys/surveyAnalytics/SurveyAnalytics.js';
import EditSurvey from './components/Surveys/EditSurvey/EditSurvey.js';
import TurkSurvey from './components/Surveys/NewSurvey/TurkSurvey.js';

export class Main extends Component {
    static displayName = Main.name;
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
                userData: this.props.location.state.userData
            });
        }
    }

    render() {
        return (
            <div>
                {this.state ? (
                    <Layout props={this.state.userData}>
                        <Route path='/home' component={DashBoard}/>
                        <Route path='/create-project' component={ProjectDefinition} />
                        <Route path='/project-research' component={ProjectResearch} />
                        <Route path='/project-research-editing' component={ProjectResearchEditing} />
                        <Route path='/admin-panel' component={AdminPanel}/>
                        <Route path='/project-view' component={ProjectView}/>
                        <Route path='/project-stimuli' component={ProjectStimuli}/>
                        <Route path='/concept' component={Concept} />
                        <Route path='/concept-question' component={ConceptQuestion}/>
                        <Route path='/concept-view' component={ConceptView} />
                        <Route path='/question-editor' component={QuestionEditor}/>
                        <Route path='/project-landing-page' component={ProjectLandingPage} />
                        <Route path='/add-prototype' component={ProjectPrototype} />
                        <Route path='/surveys' component={ProjectSurvey} />
                        <Route path='/new-survey' component={NewSurvey} />
                        <Route path='/turk-survey/' component={TurkSurvey} />
                        <Route path='/survey-analytics' component={SurveyAnalytics} />
                        <Route path='/edit-survey' component={EditSurvey} />
                    </Layout>
                ): (null)}
            </div>
            );
    }
}
