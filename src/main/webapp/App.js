import { Component } from 'react';
import { hh, div } from 'react-hyperscript-helpers';
import Routes from "./main/Routes";
import TopNavigationMenu from './components/TopNavigationMenu';
import Footer from './components/Footer';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Storage } from './util/Storage';
import '../webapp/index.css';

export const App = hh(class App extends Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
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

  async handleUnauthorized() {
    Storage.clearStorage();
    window.location.reload();
  }

  render() {
    return (
      div({ className: "container" }, [
        TopNavigationMenu({ history: this.props.history }),
        Routes({}, []),
        Footer()
      ])
    )
  }
});

export default withRouter(App);
