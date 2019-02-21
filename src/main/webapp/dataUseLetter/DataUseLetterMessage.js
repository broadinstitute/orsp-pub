import { Component } from 'react';
import { AlertMessage } from '../components/Wizard';
import { div } from 'react-hyperscript-helpers';

class DataUseLetterMessage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
     // error notFound or submitted
     console.log("data use letter message", this.props.error);
     return (
      div(['Test' + this.props.error]))
  }
}

export default DataUseLetterMessage;
