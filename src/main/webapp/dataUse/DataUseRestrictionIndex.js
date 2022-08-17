import React, { Component, Fragment } from 'react';
import { h, hh, div } from 'react-hyperscript-helpers';
import SampleCollectionLinks from './SampleCollectionLinks';
import DataUseRestriction from './DataUseRestriction';
import { About } from '../components/About';

const DataUseRestrictionIndex = hh(class DataUseRestrictionIndex extends Component {

  render() {
     return (
      div({}, [
        About({showWarning: false}),
        h( Fragment, {},[
          h(DataUseRestriction, {}),
          h(SampleCollectionLinks,{}),
        ])
      ])
     )
  }
});

export default DataUseRestrictionIndex;
