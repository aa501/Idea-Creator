import React from "react";
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import { Toolbar } from "./Toolbar";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';
import { Diagram } from "@blink-mind/renderer-react";
import RichTextEditorPlugin from "@blink-mind/plugin-rich-text-editor";
import { JsonSerializerPlugin } from "@blink-mind/plugin-json-serializer";
import { ThemeSelectorPlugin } from "@blink-mind/plugin-theme-selector";
import "@blink-mind/renderer-react/lib/main.css";
import './MindMap.css';
import LoadingGIF from '../../../../../../static/Loading3.gif';
import Snackbar from '@material-ui/core/Snackbar';
import { downloadFile, generateSimpleModel } from "../utils";

const plugins = [
  RichTextEditorPlugin(),
  JsonSerializerPlugin(),
  ThemeSelectorPlugin()
];

export default class MindMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.userData,
      projectInfo: this.props.projectInfo,
      change: false,
      diagramVersion: 0,
      openSuccessSnackBar: false,
      oldState: null,
      newState: null,
      loading: true,
    };
    // This was adam's idea
    this.timeOutID = null;
    this.initModel();
  }

  diagram;
  diagramRef = ref => {
    this.diagram = ref;
    this.setState({});
  };

  handleOpenSuccessSnackBar = (version) => {
    this.setState({
      openSuccessSnackBar: true,
      diagramVersion: version
    })
  }
  handleCloseSuccessSnackBar = () => {
    this.setState({ openSuccessSnackBar: false })
  }

  handleOpenErrorSnackBar = () => {
    this.setState({ openErrorSnackBar: true })
  }
  handleCloseErrorSnackBar = () => {
    this.setState({ openErrorSnackBar: false })
  }

  componentDidMount = async () => {
    await this.retrieveMindMap(this.props.projectInfo.uid);
    this.autoSave(); // Enable auto save 
  };

  componentWillUnmount() {
    if(this.timeOutID)
    {
      clearTimeout(this.timeOutID);
    }
    
}

  autoSave = async () => {
    let id = await setTimeout(async () => {
      if(this.state.model === this.state.oldState){
        this.autoSave();
      } else {
        await this.saveMindMap();
        this.setState({
          oldState: this.state.model,

        });
        this.autoSave();
      }
    }, 10000);
    this.timeOutID = id;
  }

  retrieveMindMap = async (projectId) => {
    let mindModelConfig = await axios.get(`/api/project/${projectId}/state`, {
      headers: {
        Authorization: 'Bearer ' + this.props.userData.token //the token is a variable which holds the token
      }
    }).then(res => { 
      this.setState({
        loading: false
      });
    return res.data;
    });
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    let obj = mindModelConfig.state;
    let model = controller.run("deserializeModel", { controller, obj });    
    this.setState({
      model,
      diagramVersion: mindModelConfig.version,
    });
  }

  saveMindMap = async () => {
    let exportyboi = this.exportJson();
    axios({
      method: 'put',
      url: `/api/project/${this.props.projectInfo.uid}/state`,
      headers: {
                Authorization: 'Bearer ' + this.props.userData.token, //the token is a variable which holds the token
                'Content-Type': 'application/json'
              },
      data: JSON.stringify({
        "state" : exportyboi,
        "version" : this.state.diagramVersion,
      }) 
    }).then(response => { 
      // Saved successfully
      this.handleOpenSuccessSnackBar(response.data.version)
    })
    .catch(error => {
        // Save conflict
        this.handleOpenErrorSnackBar()
        this.retrieveMindMap(this.props.projectInfo.uid);
      });
  }

  initModel() {
    const model = generateSimpleModel();
    this.state = { model };
    return model;
  }

  onClickOpenFile = e => {
    const input = document.createElement("input");
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", evt => {
      const file = evt.target.files[0];
      const fr = new FileReader();
      fr.onload = evt => {
        const txt = evt.target.result;
        let obj = JSON.parse(txt);
        let model = controller.run("deserializeModel", { controller, obj });
        this.setState({ model });
      };
      fr.readAsText(file);
    });
    input.click();
  };

  exportJson = e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    const json = controller.run("serializeModel", props);
    return json;
  }

  onClickExportJson = e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    const json = controller.run("serializeModel", props);
    const jsonStr = JSON.stringify(json);
    const url = `data:text/plain,${encodeURIComponent(jsonStr)}`;
    downloadFile(url, "example.json");
    this.setState({ showDialog: false });
  };

  onClickSetTheme = themeKey => e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run("setTheme", { ...props, themeKey });
  };

  onClickSetLayout = layoutDir => e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run("setLayoutDir", { ...props, layoutDir });
  };

  onClickUndo = e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run("undo", props);
  };

  onClickRedo = e => {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    controller.run("redo", props);
  };

  renderDiagram() {
    return (
      <Diagram
        ref={this.diagramRef}
        model={this.state.model}
        onChange={this.onChange}
        plugins={plugins}
      />
    );
  }

  renderToolbar() {
    const props = this.diagram.getDiagramProps();
    const { controller } = props;
    const canUndo = controller.run("canUndo", props);
    const canRedo = controller.run("canRedo", props);
    const toolbarProps = {
      onClickExportJson: this.onClickExportJson,
      onClickOpenFile: this.onClickOpenFile,
      onClickChangeTheme: this.onClickSetTheme,
      onClickSetLayout: this.onClickSetLayout,
      onClickUndo: this.onClickUndo,
      onClickRedo: this.onClickRedo,
      canUndo,
      canRedo
    };
    return <Toolbar {...toolbarProps} />;
  }

  renderDialog() {}

  onChange = model => {
    this.setState({
      model
    });
  };

  render() {
    return (
      <div className="mindmap">
        {this.diagram && this.renderToolbar()}
        {this.state.loading ? (
          <div >
            <img src={LoadingGIF} className='loading-content' />
          </div>
           ):( 
          this.renderDiagram())}
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.openSuccessSnackBar}
          autoHideDuration={3000}
          onClose={this.handleCloseSuccessSnackBar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          variant="success"
          message={<span id="message-id"><CheckCircleIcon /> Saved Successfully!</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="red"

              onClick={this.handleCloseSuccessSnackBar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <Snackbar
          id='success-snack'
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.openErrorSnackBar}
          autoHideDuration={6000}
          onClose={this.handleCloseErrorSnackBar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id"><CheckCircleIcon /> Newer Changes Detetcted, Loading...</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="red"

              onClick={this.handleCloseErrorSnackBar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}