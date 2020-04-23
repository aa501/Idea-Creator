import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Row, Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';
import axios from 'axios';
import noProjectImage from "../../../../static/NoProjectsFound.png";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import userImage from "../../../../static/usericon.png";
import './AdminPanel.css';
import { textAlign } from '@material-ui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@material-ui/core/Tooltip';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}


export default class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.location.state.userData || this.props.userData,
            projectList: [],
            projectPermissions: [],
            adminPermissions: [],
            editUsersModal: false,
            editAdminsModal: false,
            activeCheckboxes: [],
            permissionsToAdd: [],
            permissionsToRemove: [],
            permissionsChanged: [],
            activeAdminCheckboxes: [],
            permissionsAdminToAdd: [],
            permissionsAdminToRemove: [],
            permissionsAdminChanged: [],
            project: [],
            errorModal: false,
            errorMessage: '',
            currentProjectUid: ''
        }
    }


    handleCloseErrorModal = () => {
        this.setState({
            errorModal: false
        });
      }

      openErrorModal = (uid) => {
        this.setState({
            errorModal: true,
            currentProjectUid: uid
        });
      }

    closeAdminsModal = () => {
        this.setState({
            editAdminsModal: false
        });
        this.resetAdminValues()
    }

    openAdminsModal = () => {
        this.setState({
            editAdminsModal: true
        });
    }

    closeUserModal = () => {
        this.setState({
            editUsersModal: false
        });
        this.resetValue()
    }

    openUserModal = () => {
        this.setState({
            editUsersModal: true
        });
    }

    componentDidMount = () => {
        this.pullProjectsForUser();
    }

    pullProjectsForUser = async () => {
        const response = await axios.get('/api/project', {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
            }
        }).then(response => response.data);
        this.setState({
            projectList: response
        });
    }

    pullProjectPermissions = async (projectUID) => {
        const response = await axios.get('/api/project/' + projectUID + '/permissions', {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
            }
        }).then(response => response.data);
        this.setState({
            projectPermissions: response
        });
    }

    editAdminsClick = async () => {

        await this.pullAdminPermissions()
        let guidList = this.addUsersToAdminCheckedList()
        this.openAdminsModal()
        this.setState({
            activeAdminCheckboxes: guidList
        })
    }

    pullAdminPermissions = async () => {
        const response = await axios.get('/api/auth/get-users', {
            headers: {
                Authorization: 'Bearer ' + this.state.userData.token //the token is a variable which holds the token
            }
        }).then(response => response.data);
        this.setState({
            adminPermissions: response
        });
    }

    addUsersToCheckedList = () => {
        let guidList = []

        if (this.state.projectPermissions) {
            this.state.projectPermissions.map((user) => {
                if (user.hasPermission) {
                    guidList.push(user.uid);
                }

            })
        }

        return guidList;


    }

    addUsersToAdminCheckedList = () => {
        let guidList = []

        if (this.state.adminPermissions) {
            this.state.adminPermissions.map((user) => {
                if (user.type === 'admin') {
                    guidList.push(user.uid);
                }

            })
        }

        return guidList;


    }

    editUsersClick = async (project) => {
        await this.pullProjectPermissions(project.uid)
        let guidList = this.addUsersToCheckedList()
        this.openUserModal()
        this.setState({
            project: project,
            activeCheckboxes: guidList
        })

    }

    submitUserChange = async () => {
        let add = []
        let remove = []
        await this.state.permissionsChanged.map((userId) => {
            if (this.state.activeCheckboxes.includes(userId) && !this.state.projectPermissions.filter(x => x.uid === userId)[0].hasPermission) {
                add.push(userId)
            }
            else if (!this.state.activeCheckboxes.includes(userId) && this.state.projectPermissions.filter(x => x.uid === userId)[0].hasPermission) {
                remove.push(userId)
            }
        })

        this.setState({
            permissionsToRemove: remove,
            permissionsToAdd: add
        })
        await this.removePermissions()
        await this.addPermissions()
        this.closeUserModal()
    }

    addPermissions = async () => {
        if (this.state.permissionsToAdd.length > 0) {
            console.log("enter")
            const response = await axios.post('/api/project/' + this.state.project.uid + '/permissions', {

                userUids: this.state.permissionsToAdd
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + this.state.userData.token
                    }
                }).then(response => response.data);
        }
    }

    removePermissions = async () => {
        let projectUID = this.state.project.uid

        if (this.state.permissionsToRemove.length > 0) {
            const response = await axios.delete(`/api/project/${projectUID}/permissions`, {
                data: {
                    userUids: this.state.permissionsToRemove
                },
                headers: {
                    Authorization: 'Bearer ' + this.state.userData.token
                }
            }
            ).then(response => response.data);
        }
    }

    submitAdminChange = async () => {
        let add = []
        let remove = []
        await this.state.permissionsAdminChanged.map((userId) => {
            if (this.state.activeAdminCheckboxes.includes(userId) && this.state.adminPermissions.filter(x => x.uid === userId)[0].type !== 'admin') {
                add.push(userId)
            }
            else if (!this.state.activeAdminCheckboxes.includes(userId) && this.state.adminPermissions.filter(x => x.uid === userId)[0].type === 'admin') {
                remove.push(userId)
            }
        })


        this.setState({
            permissionsAdminToAdd: add,
            permissionsAdminToRemove: remove
        })
        await this.editAdminPermissions()
        this.closeAdminsModal()
    }

    editAdminPermissions = async () => {

        let i = 0;

        if (this.state.permissionsAdminToAdd.length > 0) {
            for (i = 0; this.state.permissionsAdminToAdd.length > i; i++) {
                const response = await axios.post('/api/auth/user', {

                    uid: this.state.permissionsAdminToAdd[i],
                    type: 'admin'
                },
                    {
                        headers: {
                            Authorization: 'Bearer ' + this.state.userData.token
                        }
                    }).then(response => response.data);
            }
        }

        i = 0

        if (this.state.permissionsAdminToRemove.length > 0) {
            for (i = 0; this.state.permissionsAdminToRemove.length > i; i++) {

                const response = await axios.post('/api/auth/user', {

                    uid: this.state.permissionsAdminToRemove[i],
                    type: 'regular'
                },
                    {
                        headers: {
                            Authorization: 'Bearer ' + this.state.userData.token
                        }
                    }).then(response => response.data);
            }
        }
    }

    handleDeleteProject = async () =>{

        let projectUID = this.state.currentProjectUid

        if (projectUID !== '') {
            const response = await axios.delete(`/api/project/${projectUID}`, {
                headers: {
                    Authorization: 'Bearer ' + this.state.userData.token
                }
            }
            ).then(response => response.data);
            console.log(projectUID)
            console.log(this.state.userData.token)
            console.log(response);
        }
        this.pullProjectsForUser();
        this.handleCloseErrorModal();
    }

    resetValue = () => {
        this.setState({
            permissionsChanged: [],
            permissionsToAdd: [],
            permissionsToRemove: [],
        })
    }

    resetAdminValues = () => {
        this.setState({
            adminPermissions: [],
            activeAdminCheckboxes: [],
            permissionsAdminToAdd: [],
            permissionsAdminToRemove: [],
            permissionsAdminChanged: [],
        })
    }


    CheckboxListSecondary = () => {
        const [checked, setChecked] = React.useState([1]);

        const handleToggle = value => () => {
            const currentIndex = checked.indexOf(value);
            const newChecked = [...checked];

            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }

            setChecked(newChecked);
        }
    }

    handleToggle = (toggle) => {
        alert(toggle);
    }

    handleCheck(id) {
        let temp = this.state.permissionsChanged
        if (!this.state.permissionsChanged.includes(id)) {
            temp = [...temp, id]
        }
        let found = this.state.activeCheckboxes.includes(id)
        if (found) {
            this.setState({
                activeCheckboxes: this.state.activeCheckboxes.filter(x => x !== id),
                permissionsChanged: temp
            })
        } else {
            this.setState({
                activeCheckboxes: [...this.state.activeCheckboxes, id],
                permissionsChanged: temp
            })
        }

    }

    handleAdminCheck(id) {
        let temp = this.state.permissionsAdminChanged
        if (!this.state.permissionsAdminChanged.includes(id)) {
            temp = [...temp, id]
        }
        let found = this.state.activeAdminCheckboxes.includes(id)
        if (found) {
            this.setState({
                activeAdminCheckboxes: this.state.activeAdminCheckboxes.filter(x => x !== id),
                permissionsAdminChanged: temp
            })
        } else {
            this.setState({
                activeAdminCheckboxes: [...this.state.activeAdminCheckboxes, id],
                permissionsAdminChanged: temp
            })
        }

    }


     /* renderSwitch(param) {
        switch(param % 6) {
          case 1:
            return require("../../../../static/City.jpg");
          case 2:
            return require("../../../../static/Beach.jpg");
          case 3:
            return require("../../../../static/Coast.jpg");
          case 4:
            return require("../../../../static/Field.jpg");
            case 5:
            return require("../../../../static/Mountain.jpg");
          default:
            return require("../../../../static/Underwater.jpg");*/
      //  }
    // }


    render() {

        return (
            <div className='dashboard-container'>
               
                <div className='dashboard-header'>
                <h3>Edit Projects</h3>
                <hr style={{width: "100%"}} id="hr-1" />
                </div>
                <div className='dashboard-body' style={{marginTop: 50}}>
                    {this.state.projectList.length === 0 ? (
                        <img src={noProjectImage} id='no-projects-image' alt="No Projects Found" />

                    ) : (<div></div>)}
                    {/* TODO: Have to make this conditional render, render the project tiles */}
                    {this.state.projectList.map((project, index) => {
                        return (
                            <div className='project-paper-holder'>
                                <Card style={{ minHeight: 200, width: 240, borderTop: "solid", borderTopWidth: "6px", borderTopColor: "#028ECC"}}>
                                    <Paper className='project-paper'>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {project.title}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <FontAwesomeIcon id='font-awesome-space-right' icon="stream" />
                                                    {project.description.slice(0,75)}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    <FontAwesomeIcon id='font-awesome-space-right' icon="calendar" />
                                                    Date Created: {project.dateCreated.slice(0, 10)}
                                                </Typography>
                                                <div id='share-learn-container' align="center">
                                                    <Button size="small" style={{marginRight: 10}} onClick={() => { this.editUsersClick(project) }} color="primary">
                                                        <FontAwesomeIcon id='font-awesome-space' icon="user-edit" />
                                                    </Button>
                                                        <Tooltip title="Delete Project">
                                                            <Button id='learn-button' onClick={()=> {this.openErrorModal(project.uid)}}>
                                                                <div id = 'trash-icon-button'><FontAwesomeIcon id='admin-delete' icon="trash-alt" /></div>

                                                            </Button>
                                                        </Tooltip>
                                                    </div>
                                            </CardContent>
                                        </CardActionArea>
                                        <CardActions>

                                        </CardActions>
                                    </Paper>
                                </Card>
                            </div>
                        );
                    })
                    }
                    {this.state.userData.type === 'admin' ? (
                        <div className='project-paper-holder'>
                            <Card style={{ marginTop: 250 }}>
                                <Paper className='project-paper' onClick={this.editAdminsClick}>
                                    <CardActionArea>
                                        <CardMedia
                                            style={{ height: 0, paddingTop: '56.25%' }}
                                            image={require("../../../../static/addProject.jpg")}
                                            title="Add Administrator"
                                        />

                                        <CardContent>

                                            <Typography variant="h5" component="h2">
                                                <center>
                                                    Add Administrator +
                                    </center>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>

                                </Paper>
                            </Card>
                        </div>
                    ) : (null)}
                </div>

                <Dialog
                    open={this.state.editUsersModal}
                    TransitionComponent={Transition}
                    scroll="paper"
                    aria-labelledby="scroll-dialog-title"
                    maxWidth="md"
                >
                    <DialogTitle id="scroll-dialog-title">Edit Users</DialogTitle>
                    <DialogContent dividers={true}>
                        <DialogContentText>
                            <List dense id='userList'>
                                {this.state.projectPermissions.map((user) => {
                                    return (
                                        <ListItem key={user.uid} button disabled={user.type === 'admin'} onClick={() => this.handleCheck(user.uid)}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={`Avatar`}
                                                    src={userImage}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText primary={user.firstName + " " + user.lastName} />
                                            <ListItemSecondaryAction>
                                                <Checkbox
                                                    edge="end"
                                                    onChange={() => this.handleCheck(user.uid)}
                                                    checked={this.state.activeCheckboxes.includes(user.uid)}
                                                    disabled={user.type === 'admin'}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeUserModal} color="warning">
                            Cancel
          </Button>
                        <Button onClick={this.submitUserChange} color="success">
                            Apply
          </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.editAdminsModal}
                    TransitionComponent={Transition}
                    scroll="paper"
                    aria-labelledby="scroll-dialog-title"
                    maxWidth="md"
                >
                    <DialogTitle id="scroll-dialog-title">Edit Admins</DialogTitle>
                    <DialogContent dividers={true}>
                        <DialogContentText>
                            <List dense id='userList'>
                                {this.state.adminPermissions.map((user) => {
                                    return (
                                        <ListItem key={user.uid} button disabled={user.uid === this.state.userData.uid} onClick={() => this.handleAdminCheck(user.uid)}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={`Avatar`}
                                                    src={userImage}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText primary={user.firstName + " " + user.lastName} />
                                            <ListItemSecondaryAction>
                                                <Checkbox
                                                    edge="end"
                                                    onChange={() => this.handleAdminCheck(user.uid)}
                                                    checked={this.state.activeAdminCheckboxes.includes(user.uid)}
                                                    disabled={user.uid === this.state.userData.uid}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeAdminsModal} color="warning">
                            Cancel
          </Button>
                        <Button onClick={this.submitAdminChange} color="success">
                            Apply
          </Button>
                    </DialogActions>
                </Dialog>



            <Dialog
              open={this.state.errorModal}
              TransitionComponent={Transition}
              keepMounted
              maxWidth='lg'
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="responsibe-alert-dialog-slide-title">
                Delete This Project?
              </DialogTitle>
              <DialogActions>
                <Button onClick={this.handleCloseErrorModal} color="primary">
                  No
                </Button>
                <Button onClick={this.handleDeleteProject} color="warning">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </div>

        );
    }

}
