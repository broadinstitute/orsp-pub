import { Component } from 'react';
import { hh, div, h } from 'react-hyperscript-helpers';
import Routes from './main/Routes';
import TopNavigationMenu from './components/TopNavigationMenu';
import ErrorHandler from './components/ErrorHandler';
import Footer from './components/Footer';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Storage } from './util/Storage';
import '../webapp/index.css';

export const App = hh(class App extends Component {

  componentDidMount() {
    axios.interceptors.response.use(function (response) {
      return response;
    }, (error) => {
      if (error.response.status === 401) {
        this.handleUnauthorized();
      } else {
        return Promise.reject(error);
      }
    });
  }

  handleUnauthorized() {
    Storage.clearStorage();
    window.location.reload();
  }

  render() {
    return (
      div({}, [
        h(TopNavigationMenu, { history: this.props.history }),
        div({ className: "container" }, [
          h(ErrorHandler, {}, [
            Routes({}, []),
          ]),
          Footer()
        ])
      ])
    )
  }
});

export default withRouter(App);
