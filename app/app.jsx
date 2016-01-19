import React from "react";
import ReactDom from "react-dom";
import { Window, Content, PaneGroup ,Pane } from "react-photonkit";
import Rx from 'rxjs/Rx';

import Header from "./header.jsx"
import Footer from "./footer.jsx";
import Sidebar from "./sidebar.jsx"
import Contents from "./contents.jsx"
import Viewer from "./viewer.jsx"

const pathSubj = new Rx.Subject();
const viewerSubj = new Rx.Subject();

require('../index.scss');

ReactDom.render(
  <Window>
    <Header pathSubj={pathSubj} />
    <Content>
      <PaneGroup>
        <Sidebar />
        <Contents viewerSubj={viewerSubj} pathSubj={pathSubj} />
        <Viewer viewerSubj={viewerSubj} />
      </PaneGroup>
    </Content>
    <Footer />
  </Window>
  , document.querySelector("#main"));
