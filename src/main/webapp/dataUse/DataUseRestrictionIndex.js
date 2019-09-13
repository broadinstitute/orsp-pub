import React, { Component, Fragment } from 'react';
import { hh } from 'react-hyperscript-helpers';
import SampleCollectionLinks from './SampleCollectionLinks';
import DataUseRestriction from './DataUseRestriction';

const DataUseRestrictionIndex = hh(class DataUseRestrictionIndex extends Component {

  render() {
     return (
       <Fragment >
         <DataUseRestriction/>
         <SampleCollectionLinks/>
       </Fragment>
     )
  }
});

export default DataUseRestrictionIndex;
