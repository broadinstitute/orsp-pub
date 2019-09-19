import { Component } from 'react';
import { hh, div } from 'react-hyperscript-helpers';
import Routes from "./main/Routes";
import TopNavigationMenu from './components/TopNavigationMenu';
import Footer from './components/Footer';
import { withRouter} from 'react-router-dom';
import '../webapp/index.css';

export const App = hh(class App extends Component {
 
  render() {
    return(
      div({className: "container"},[
          TopNavigationMenu({history: this.props.history}),
          Routes({},[]),
          Footer()
      ])
    )
  }
});

export default withRouter(App);
