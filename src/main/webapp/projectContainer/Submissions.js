import { Component, Fragment } from 'react';
import { div, hh, h, button, h1 } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';
import { Panel } from '../components/Panel';
import { MultiTab } from "../components/MultiTab";
import { Table } from "../components/Table";

const headers =
  [
    { name: 'Number', value: 'number' },
    { name: 'Description', value: 'description' },
    { name: 'Documents', value: 'documents' },
    { name: 'Created', value: 'creationDate' },
    { name: '', value: 'remove' }
  ];

const dummyData = [
  [
    { name: 'number', }
  ]
];

export const Submissions = hh(class Submissions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      amendments:[],
      others: []
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
      console.log(resp.data.groupedSubmissions);
      this.setState(prev => {
        prev.amendments = resp.Amendment;
        console.log(prev.amendments);
        prev.others = resp.Other;
        return prev;
      });
      console.log(this.state.amendments);
    });
  }

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
                      // data: this.state.amendments,
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
