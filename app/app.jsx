import React from "react";
import ReactDom from "react-dom";
import { Window, Content, PaneGroup, Pane } from "react-photonkit";
import Rx from 'rxjs/Rx';

import Header from "./header.jsx"
import Footer from "./footer.jsx";
import Sidebar from "./sidebar.jsx"
import Contents from "./contents.jsx"
import Viewer from "./viewer.jsx"

const subj = new Rx.Subject();

require('../index.scss');

ReactDom.render(
  <Window>
    <Header subj={subj} />
    <Content>
      <PaneGroup>
        <Sidebar />
        <Contents subj={subj} />
        <Viewer subj={subj} />
      </PaneGroup>
    </Content>
    <Footer />
  </Window>
  , document.querySelector("#main"));
