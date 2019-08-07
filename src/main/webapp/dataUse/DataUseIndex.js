import { Component } from 'react';
import { div, h2 } from 'react-hyperscript-helpers';
import SampleCollectionLinks from './SampleCollectionLinks';
import DataUseRestriction from './DataUseRestriction';

class DataUseIndex extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
     return (
       div({}, [ 
        DataUseRestriction(),
        SampleCollectionLinks()
       ])
     )
  }
}
export default DataUseIndex;
