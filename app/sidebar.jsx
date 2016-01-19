import React from "react";
import { Pane, NavGroup, NavTitle, NavGroupItem } from "react-photonkit";
import electron from 'electron';

const ipcRenderer = electron.ipcRenderer;

export default
class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      devices: {}
    }
  }

  onSelect(key) {
    ipcRenderer.send('load-files', {
      device: this.state.devices[key],
      dir: '/',
      init: true
    });
  }

  componentDidMount() {
    ipcRenderer.on('on-add-device', function(event, arg) {
      var devices = this.state.devices;
      devices[arg.id] = arg;
      this.setState({ devices: devices });
    }.bind(this));

    ipcRenderer.on('on-change-device', function(event, arg) {
      var devices = this.state.devices;
      devices[arg.id] = arg;
      this.setState({ devices: devices });
    }.bind(this));

    ipcRenderer.on('on-remove-device', function(event, arg) {
      var devices = this.state.devices;
      delete devices[arg.id];
      this.setState({ devices: devices });
    }.bind(this));

    ipcRenderer.send('check-devices');
  }

  render() {
    const devices = [<NavTitle key="device-title">Devices</NavTitle>];
    Object.keys(this.state.devices).forEach((key, index) => {
      const type = this.state.devices[key].type;
      const glyph = type == 'device' ? 'mobile' : 'alert';
      devices.push(
        <NavGroupItem key={key} eventKey={key} glyph={glyph} text={key} />
      );
    });

    return (
      <Pane ptSize="sm" sidebar>
        <NavGroup activeKey={1} onSelect={this.onSelect.bind(this)}>
          {devices}
        </NavGroup>
      </Pane>
    );
  }
}
