import React, { Component } from "react";
import { h, hh, div } from "react-hyperscript-helpers";
import { Panel } from "../components/Panel";
import { TableComponent } from "../components/TableComponent";
import { About } from "../components/About";

const columnsCopy = [{
  dataField: 'project',
  text: 'Project',
  sort: true
}, {
  dataField: 'title',
  text: 'Title',
  sort: true
}, {
  dataField: 'status',
  text: 'Status',
  sort: true
}, {
  dataField: 'type',
  text: 'Type',
  sort: true
}, {
  dataField: 'updated',
  text: 'Updated',
  sort: true
}, {
  dataField: 'expiration',
  text: 'Expiration',
  sort: true
}];


class Index extends Component {
 constructor(props) {
   super(props);
 }

 render() {
   return (
     div({}, [
       About(),
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
       ]),

     ])
   );
 }
}

export default Index;
