import React from "react";
import { Pane, Table, Icon } from "react-photonkit";
import electron from 'electron';
import pretty from 'pretty-bytes';
import fs from 'fs';
import path from 'path';

const ipcRenderer = electron.ipcRenderer;

export default
class Contents extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      display: 'display-none',
      name: '',
      data: ''
    }
  }

  componentDidMount() {
    this.initSubj();
  }

  initSubj() {
    this.props.subj.subscribe(params => {
      if (params.type != 'viewer') {
        return;
      }

      if (params.data.show) {
        this.setState({
          display: 'display-show',
          name: params.data.name,
          data: params.data.data || params.data.error
        });
      } else {
        this.setState({
          display: 'display-none',
          name: '',
          data: ''
        });
      }
    });
  }

  render() {
    return (
      <Pane className={`padded-more ${this.state.display}`}>
        <div className="viewer">
          <h3>{this.state.name}</h3>
          <hr />
          {this.state.data}
        </div>
      </Pane>
    );
  }
}
