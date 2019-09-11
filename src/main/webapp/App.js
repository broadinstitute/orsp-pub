import { Component } from 'react';
import { hh, span, h1 } from 'react-hyperscript-helpers';
import Routes from "./main/Routes";
import TopNavigationMenu from './components/TopNavigationMenu';
import Footer from './components/Footer';

export const App = hh(class App extends Component {

  render() {
    return(
      span({},[
        TopNavigationMenu(),
        Routes({},[]),
        Footer()
      ])
    )
  }
});

export default App;