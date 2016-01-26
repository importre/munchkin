import React from "react";
import { Toolbar, Actionbar, Button, ButtonGroup } from "react-photonkit";
import electron from 'electron';
import pkg from "../package.json"

const ipcRenderer = electron.ipcRenderer;
const shell = electron.shell;

export default
class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dir: ''
    }
  }

  componentDidMount() {
    ipcRenderer.on('on-load-files', (event, arg) => {
      this.setState({
        dir: arg.dir
      })
    });
  }

  onClickPrev() {
    this.props.subj.next({
      type: 'nav',
      data: 'prev'
    });
  }

  onClickNext() {
    this.props.subj.next({
      type: 'nav',
      data: 'next'
    });
  }

  onClick(item) {
    switch(item) {
      case 'github': this.openUrl('https://github.com/importre'); break;
      case 'facebook': this.openUrl('https://www.facebook.com/importre'); break;
      case 'help': this.openUrl('https://github.com/importre/munchkin'); break;
    }
  }

  openUrl(url) {
    shell.openExternal(url);
  }

  render() {
    const dir = this.state.dir;
    const path = dir.length > 0 ? ` ( ${dir} )` : '';
    const title = `${pkg.productName}${path}`;

    return (
      <Toolbar title={title}>
        <Actionbar>
          <ButtonGroup>
            <Button glyph="left-open-big"
                    onClick={this.onClickPrev.bind(this)} />
            <Button glyph="right-open-big"
                    onClick={this.onClickNext.bind(this)} />
          </ButtonGroup>

          <ButtonGroup>
            <Button glyph="github"
                    onClick={this.onClick.bind(this, 'github')} />
            <Button glyph="facebook"
                    onClick={this.onClick.bind(this, 'facebook')} />
          </ButtonGroup>

          <Button glyph="help-circled" text="Help"
                  onClick={this.onClick.bind(this, 'help')} />
        </Actionbar>
      </Toolbar>
    );
  }
}
