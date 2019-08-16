import { Component } from 'react';
import { div } from 'react-hyperscript-helpers';
import SampleCollectionLinks from './SampleCollectionLinks';
//import DataUseRestriction from './DataUseRestriction';
import DataUseRestrictionEdit from './DataUseRestrictionEdit';

class DataUseRestrictionIndex extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
     return (
       div({}, [ 
        DataUseRestrictionEdit()
        //DataUseRestriction(),
        //SampleCollectionLinks()
       ])
     )
  }
}
export default DataUseRestrictionIndex;
