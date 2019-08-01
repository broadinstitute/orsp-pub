import { Component, Fragment } from 'react';
import { div, a, hh, h, button, span } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';
import { Panel } from '../components/Panel';
import { MultiTab } from "../components/MultiTab";
import { Table } from "../components/Table";
import { Files } from "../util/ajax";
import _ from 'lodash';
import './Submissions.css';

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
      submissions: [],
    };
  }

  componentDidMount() {
    this.getSubmissions();
    this.getDisplaySubmissions();
  }

  getSubmissions() {
    ProjectMigration.getSubmissions(component.projectKey).then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        this.loadSubmissions();
      })
    });
  };

  getDisplaySubmissions = () => {
    let amendments = {};
    let others = {};
    ProjectMigration.getDisplaySubmissions(component.projectKey).then(resp => {
      console.log(resp.data.groupedSubmissions);
      _.map(resp.data.groupedSubmissions, (data, title) => {
        console.log('data', data);
        console.log('title', title);
        let submission = {
          title: title,
          documents: data.documents,
          type: data.type,
          projectKey: data.projectKey,
          comments: data.comments
        }
      });
      amendments = resp.data.groupedSubmissions.Amendment;
      others = resp.data.groupedSubmissions.Other;

      amendments.forEach(other => {
        other.documents.forEach(document => {
          Files.getDocument(document.id).then(resp => {
            document.document = resp.data.document;
          });
        });
      });

      others.forEach(other => {
        other.documents.forEach(document => {
          Files.getDocument(document.id).then(resp => {
            document.document = resp.data.document;
          });
        });
      });

      this.setState(prev => {
        prev.amendments = amendments;
        prev.others = others;
        return prev;
      });
    }).catch(error => {
      // TODO: redirect to index
      this.setState(() => { throw error; });
    });
  };

  getDocuments = (documents) => {
    documents.forEach(document => {
      Files.getDocument(document.id).then(resp => {
        document.document = resp.data.document;
      });
    });
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

  redirectNewSubmission(e) {
    window.location.href = `${component.serverURL}/api/submissions/add-new?projectKey=${component.projectKey}&type=${e.target.id}`;
  }

  render() {

    const amendmentTitle = h(Fragment, {}, [
      "Amendment",
      span({className: "badge badge-dark submission-counter"}, [this.state.amendments.length])
    ]);

    const othersTitle = h(Fragment, {}, [
      "Others",
      span({className: "badge badge-dark submission-counter"}, [this.state.others.length])
    ]);
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
              div({ key: "amendment", title: amendmentTitle },[
                h(Fragment, {}, [
                  a({
                    onClick: this.redirectNewSubmission,
                    className: "btn btn-primary add-submission",
                    id: "Amendment"
                  }, ["Add Submission"]),
                  Table({
                    headers: headers,
                    data: this.state.amendments,
                    sizePerPage: 10,
                    paginationSize: 10,
                    isAdmin: component.isAdmin,
                    getDocumentLink: this.getDocumentLink,
                    pagination: true,
                    reviewFlow: true,
                    submissionEdit: this.submissionEdit,
                  })
                ])
              ]),
              div({ key: "other", title: othersTitle},[
                h(Fragment, {}, [
                  a({
                    onClick: this.redirectNewSubmission,
                    className: "btn btn-primary add-submission",
                    id: "Other"
                  }, ["Add Submission"]),
                  Table({
                    headers: headers,
                    data: this.state.others,
                    sizePerPage: 10,
                    paginationSize: 10,
                    isAdmin: component.isAdmin,
                    getDocumentLink: this.getDocumentLink,
                    pagination: true,
                    reviewFlow: true,
                    submissionEdit: this.submissionEdit,
                  }),
                ])
              ]),
            ])
          ])
        ]),
      ]),
        div({dangerouslySetInnerHTML: { __html: this.state.content } },[])
    )
  }
});
