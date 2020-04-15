import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Login } from './components/login/Login';
import { Main } from './components/main/Main';
import { SurveyEnd } from './components/surveyend/SurveyEnd';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminPanel from './components/main/components/admin/AdminPanel';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faTimes, faEraser, faWrench, faPen, faList, faUpload, faCog, faCogs, faCircleNotch,faHome, faIgloo, faTasks, faTrashAlt, faTrash, faUndo, faInfoCircle, faFileDownload, faFile, faScroll, faFileInvoice, faTimesCircle, faExclamationTriangle, faCheck, faClock, faBalanceScale, faFileExport, faFileInvoiceDollar, faEdit, faCalculator, faFileAlt, faTools, faUserPlus, faUserEdit, faSignInAlt, faUserCircle, faSignOutAlt, faUserLock, faCalendar, faShareSquare, faProjectDiagram, faStream, faAngleDoubleRight, faArrowRight, faArrowLeft, faHeart, faQuestion } from '@fortawesome/free-solid-svg-icons'

library.add(
  faIgloo,
  faTimes,
  faEraser,
  faWrench,
  faPen,
  faList,
  faUpload,
  faHome,
  faTrash,
  faTasks,
  faCircleNotch,
  faTrashAlt,
  faUndo,
  faPlus,
  faCog,
  faCogs,
  faUserPlus,
  faUserEdit,
  faUserCircle,
  faSignOutAlt,
  faTools,
  faFileAlt,
  faCalculator,
  faEdit,
  faFile,
  faFileInvoiceDollar,
  faFileExport,
  faBalanceScale,
  faTimesCircle,
  faExclamationTriangle,
  faCheck,
  faClock,
  faBalanceScale,
  faFileInvoice,
  faScroll,
  faUserLock,
  faSignInAlt,
  faCalendar,
  faFileDownload,
  faShareSquare,
  faInfoCircle,
  faProjectDiagram,
  faStream,
  faAngleDoubleRight,
  faArrowLeft,
  faArrowRight,
  faHeart,
  faQuestion
  )

export default class App extends Component {
    static displayName = App.name;

  render () {
    return (
      <div className="app-routes">
              <Switch>
                  <Route exact path ="/" component={Login} />
                  <Route exact path ="/survey" component={SurveyEnd} />
                  <Route exactpath ="/home" component={Main} />
                  <Route exactpath ="/admin-panel" component={AdminPanel} />
              </Switch>
          </div>
    );
  }
}
