import React, { Component } from 'react';
import { hh, h, div } from 'react-hyperscript-helpers';
import { About } from '../components/About';
import { Panel } from '../components/Panel';
import { TableComponent } from "../components/TableComponent";

const LandingPage = hh(class LandingPage extends Component{

  constructor(props) {
    super(props);
  }

  render() {
    return (
      div({}, [
        About({
          showAccessDetails : true
        }),
        Panel({title: "My Task List"}, [
          TableComponent({
            remoteProp: false,
            data: this.props.comments,
            columns: columnsCopy,
            keyField: 'id',
            search: false,
            fileName: 'XXXXXXX',
            showPrintButton: false,
            printComments: this.printComments,
            defaultSorted: defaultSorted,
            pagination: false,
            showExportButtons: false,
            showSearchBar: false
          })
        ])
      ])
    );
  }

});

export default LandingPage;
