import React from "react";
import { Toolbar } from "react-photonkit";
import electron from 'electron';

const ipcRenderer = electron.ipcRenderer;

export default
class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      files: []
    }
  }

  componentDidMount() {
    ipcRenderer.on('on-load-files', (event, arg) => {
      this.setState({
        files: arg.files
      })
    });
  }

  render() {
    const size = this.state.files.length;
    const items = size > 1 ? 'items' : 'item';
    const title = `${size} ${items}`;
    return (
        <Toolbar ptType="footer" title={title}/>
    );
  }
}
