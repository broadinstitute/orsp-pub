import { Component } from 'react';
import { div, h2 } from 'react-hyperscript-helpers';
import SampleCollectionLinks from './SampleCollectionLinks';
//import DataUseRestriction from './DataUseRestriction';
import TopNavigationMenu from '../components/TopNavigationMenu';


class DataUseRestrictionIndex extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
     return (
       div({}, [ 
        //DataUseRestriction(),
        //SampleCollectionLinks()
        TopNavigationMenu()
       ])
     )
  }
}
export default DataUseRestrictionIndex;
