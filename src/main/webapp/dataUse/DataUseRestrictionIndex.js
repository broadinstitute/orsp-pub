import React, { Component, Fragment } from 'react';
import { hh, h } from 'react-hyperscript-helpers';
import SampleCollectionLinks from './SampleCollectionLinks';
import DataUseRestriction from './DataUseRestriction';

const DataUseRestrictionIndex = hh(class DataUseRestrictionIndex extends Component {

  render() {
     return (
       h( Fragment, {},[
         h(DataUseRestriction, {}),
         h(SampleCollectionLinks,{}),
       ])
     )
  }
});

export default DataUseRestrictionIndex;
