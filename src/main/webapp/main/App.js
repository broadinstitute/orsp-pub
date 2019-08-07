import React from 'react';
import { Component } from 'react';
import Routes from "./Routes";
import { withRouter } from 'react-router-dom';
import { h, div } from 'react-hyperscript-helpers';
import { Spinner } from "../components/Spinner";
import { MAIN_SPINNER } from "../util/Utils";
import { spinnerService } from "../util/spinner-service";

class App extends Component {

  componentWillUnmount() {
    spinnerService._unregister(MAIN_SPINNER);
  }

  render() {
    return (
      div({},[
        h(Spinner, {
          name: MAIN_SPINNER, group: "orsp", loadingImage: component.loadingImage
        }),
        h(Routes, {})
      ])
    );
  }
}
export default withRouter(App);
