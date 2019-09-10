import { Component } from 'react';
import { hh, div, h1 } from 'react-hyperscript-helpers';


export const NotFound = hh(class NotFound extends Component {

  constructor(props) {
    super(props);
  }

  render() {
     return (
       div({className:"row", style: {"margin":"60px 0"}}, [
        div({className:"col-xs-12"}, [
          h1({}, ["Sorry, this page could not be found."])
         ])
       ])
     )
  }
})
export default NotFound;
