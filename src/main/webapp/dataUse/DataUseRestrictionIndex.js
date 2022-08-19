import React, { Component, Fragment } from 'react';
import { h, hh, div } from 'react-hyperscript-helpers';
import SampleCollectionLinks from './SampleCollectionLinks';
import DataUseRestriction from './DataUseRestriction';
import { About } from '../components/About';
import { LoginText } from '../util/ajax';

const DataUseRestrictionIndex = hh(class DataUseRestrictionIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultValueCheckForAbout: ''
    }
  }

  componentDidMount() {
    this.checkDefault();
  }


  async checkDefault() {
    await LoginText.getLoginText().then(loginText => {
      let data = loginText.data[0];
      if(data[3] === 'default') {
        this.setState({
          defaultValueCheckForAbout: 'default'
        })
      } else {
        this.setState({
          defaultValueCheckForAbout: ''
        })
      }
    })
  }

  render() {
     return (
      div({}, [
        About({
          isRendered: this.state.defaultValueCheckForAbout !== 'default',
          showWarning: false
        }),
        h( Fragment, {},[
          h(DataUseRestriction, {}),
          h(SampleCollectionLinks,{}),
        ])
      ])
     )
  }
});

export default DataUseRestrictionIndex;
