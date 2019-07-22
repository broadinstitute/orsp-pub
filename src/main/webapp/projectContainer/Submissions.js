import { Component, Fragment } from 'react';
import { div, hh, h, button, h1 } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';
import { Panel } from '../components/Panel';
import { MultiTab } from "../components/MultiTab";
import { Table } from "../components/Table";
import { Files } from "../util/ajax";

const headers =
  [
    { name: 'Number', value: 'number' },
    { name: 'Description', value: 'comments' },
    { name: 'Documents', value: 'documents' },
    { name: 'Created', value: 'createDate' },
  ];


export const Submissions = hh(class Submissions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      amendments:[],
      others: [],
      amendmentDocuments: [],
      otherDocuments: [],
    };
  }

  componentDidMount() {
    this.getSubmissions();
    this.getDisplaySubmissions();
  }

  getSubmissions() {
    ProjectMigration.getSubmissions(component.serverURL, component.projectKey).then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        this.loadSubmissions();
      })
    });
  };

  getDisplaySubmissions() {
    ProjectMigration.getDisplaySubmissions(component.serverURL, component.projectKey).then(resp => {
      this.setState(prev => {
        prev.amendments = resp.data.groupedSubmissions.Amendment;
        prev.others = resp.data.groupedSubmissions.Other;
        return prev;
      });


      // Files.getDocument()
    });
  }

  remove = (row) => {
    console.log('remove row', row);
  };

  loadSubmissions() {
    $(".submissionTable").DataTable({
      dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
      buttons: [],
      language: { search: 'Filter:' },
      pagingType: "full_numbers",
      pageLength: 50,
      columnDefs: [{ targets: [1, 2], orderable: false }],
      order: [0, "desc"]
    });
    $("#submission-tabs").tabs();
  }

  getDocument = (uuid) => {
    Files.getDocument(uuid).then(resp => {
      console.log(resp);
    });
  };

  render() {
    return (
      div({}, [
        button({
          className: "btn buttonPrimary floatRight",
          style: { 'marginTop': '15px' },
          onClick: '',
          isRendered: this.state.readOnly === true && !component.isViewer
        }, ["Edit Information"]),
        Panel({title: "Submissions"}, [

            div({ className: "containerBox" }, [
              MultiTab({ defaultActive: "amendment"}, [
                div({ key: "amendment", title: "Amendment"},[
                  h(Fragment, {}, [
                    Table({
                      headers: headers,
                      data: this.state.amendments,
                      sizePerPage: 10,
                      paginationSize: 10,
                      isAdmin: true,
                      remove: this.remove,
                    })
                  ])
                ]),
                div({ key: "other", title: "Other"},[
                  h(Fragment, {}, [
                    Table({
                      headers: headers,
                    }),
                  ])
                ]),
              ])
            ])
          ]),
        div({dangerouslySetInnerHTML: { __html: this.state.content } },[])
      ])
    )
  }
});
