import { Component } from 'react';
import { hh, div, h1 } from 'react-hyperscript-helpers';
import Routes from "./main/Routes";
import TopNavigationMenu from './components/TopNavigationMenu';
import Footer from './components/Footer';
import ErrorHandler from './components/ErrorHandler';
import { withRouter} from 'react-router-dom';

export const App = hh(class App extends Component {

  render() {
    return(
      div({className: "container"},[
          Routes({},[]),
          TopNavigationMenu({history: this.props.history}),
          Footer()
      ])
    )
  }
});

export default withRouter(App);