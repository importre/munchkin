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
      dirs: [],
      files: []
    }
  }

  onLoadFile() {
    ipcRenderer.on('on-load-file', function(event, arg) {
      if (arg.error) {
        this.props.viewerSubj.next({
          name: arg.name,
          show: true,
          error: arg.error,
          data: null
        });
      } else {
        this.props.viewerSubj.next({
          name: arg.name,
          show: true,
          error: null,
          data: arg.data
        });
      }
    }.bind(this));
  }

  onLoadFiles() {
    ipcRenderer.on('on-load-files', function(event, arg) {
      var dirs = this.state.dirs;
      var pos = 0;
      if (arg.init) {
        dirs = [arg.dir];
      } else {
        pos = arg.pos;
        if (pos >= 0) {
          if (pos >= dirs.length) {
            dirs.push(arg.dir);
          } else {
            dirs[pos] = arg.dir;
          }
        }
      }

      this.setState({
        device: arg.device,
        dirs: dirs,
        files: arg.files,
        pos: pos
      })

      this.props.viewerSubj.next({ show: false });
    }.bind(this));
  }

  initPathSubj() {
    this.props.pathSubj.subscribe(x => {
      var pos;
      if (x == 'prev') {
        pos = this.state.pos - 1;
      } else if (x == 'next') {
        pos = this.state.pos + 1;
      } else {
        pos = null;
      }

      if (pos != null) {
        ipcRenderer.send('load-files', {
          device: this.state.device,
          dir: this.state.dirs[pos],
          pos: pos
        });
      }
    })
  }

  componentDidMount() {
    this.onLoadFiles();
    this.onLoadFile();
    this.initPathSubj();
  }

  onClick(index) {
    const entry = this.state.files[index];
    if (entry.isFile) {
      ipcRenderer.send('open-file', {
        device: this.state.device,
        absPath: entry.absPath
      });
    } else {
      ipcRenderer.send('load-files', {
        device: this.state.device,
        dir: entry.absPath,
        pos: this.state.pos + 1
      });
    }
  }

  render() {
    const rows = this.state.files.map((entry, index) => {
      const glyph = !entry.isFile ? 'folder' : 'doc-text';
      const icon = <Icon glyph={glyph} className="table-icon" />
      return (
        <tr key={index} onClick={this.onClick.bind(this, index)}>
          <td>{icon} {entry.name}</td>
          <td>{entry.time}</td>
          <td>{entry.size > 0 ? pretty(entry.size) : ''}</td>
        </tr>
      );
    });

    return (
      <Pane>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Pane>
    );
  }
}
