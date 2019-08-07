import { Component } from 'react';
import { hh, div, h2 } from 'react-hyperscript-helpers';


export const DataUseLetterMessage = hh(class DataUseLetterMessage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
     return (
       div({}, [
        h2({ isRendered: this.props.error === 'submitted', className: "pageSubtitle" }, ["The Data Use Letter form was submitted to the Broad Institute's Office of Research Subject Protection (ORSP)."]),
        h2({ isRendered: this.props.error === 'notFound', className: "pageSubtitle" }, ["Sorry, this page could not be found."])
       ])
     )
  }
})
export default DataUseLetterMessage;
