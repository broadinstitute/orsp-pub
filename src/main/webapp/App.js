import { Component } from 'react';
import { hh, div, h } from 'react-hyperscript-helpers';
import Routes from './main/Routes';
import TopNavigationMenu from './components/TopNavigationMenu';
import ErrorHandler from './components/ErrorHandler';
import Footer from './components/Footer';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { handleUnauthorized } from './util/Utils';
import '../webapp/index.css';

export const App = hh(class App extends Component {

  componentDidMount() {
    axios.interceptors.response.use(function (response) {
      return response;
    }, (error) => {
      if (error.response != undefined && error.response.status === 401) {
        handleUnauthorized(this.props.history.location);
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    });
  }

  render() {
    return (
      div({}, [
        h(TopNavigationMenu, { history: this.props.history, cProps: component }),
        div({ className: "container" }, [
          h(ErrorHandler, {history: this.props.history}, [
            Routes({}, []),
          ]),
          Footer()
        ])
      ])
    )
  }
});

export default withRouter(App);
