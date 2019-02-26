import { Component } from 'react';
import { AlertMessage } from '../components/Wizard';
import { div, h2 } from 'react-hyperscript-helpers';

class DataUseLetterMessage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
     return (
       div({}, [
        h2({ isRendered: this.props.error === 'submitted', className: "pageSubtitle" }, ["The Data Use Letter form was submitted to ORSP."]),
        h2({ isRendered: this.props.error === 'notFound', className: "pageSubtitle" }, ["Sorry, this page could not be found."])
       ])
     )
  }
}

export default DataUseLetterMessage;
