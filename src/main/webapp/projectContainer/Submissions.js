import { Component, Fragment } from 'react';
import { div, a, hh, h, button, span } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';
import { Panel } from '../components/Panel';
import { MultiTab } from "../components/MultiTab";
import { Table } from "../components/Table";
import { Files } from "../util/ajax";
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
      amendments:[],
      others: [],
      amendmentDocuments: [],
      otherDocuments: [],
    };
  }

  componentDidMount() {
    this.getDisplaySubmissions();
  }

  getDisplaySubmissions = () => {
    let amendments = {};
    let others = {};
    ProjectMigration.getDisplaySubmissions(component.serverURL, component.projectKey).then(resp => {
      amendments = resp.data.groupedSubmissions.Amendment;
      others = resp.data.groupedSubmissions.Other;

      amendments.forEach(other=> {
        other.documents.forEach(document => {
          Files.getDocument(document.id).then(resp => {
            document.document = resp.data.document;
          });
        });
      });

      others.forEach(other=> {
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


  getDocumentLink = (data) => {
    return [component.serverURL, 'api/files-helper/get-document?id=' + data].join("/");
  };

  submissionEdit = (data) => {
    const indexButton = a({
      className: 'btn btn-default btn-xs pull-left link-btn',
      href: `${component.contextPath}/submission/index?projectKey=${component.projectKey}&submissionId=${data.id}`
    }, [component.isAdmin === true ? 'Edit': 'View']);
    const submissionComment = span({className: 'submission-comment'}, [data.comments]);
    return h(Fragment, {}, [indexButton, submissionComment]);
  };

  redirectNewSubmission(e) {
    window.location.href=`${component.serverURL}/api/submissions/add-new?projectKey=${component.projectKey}&type=${e.target.id}`;
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
      ])
    )
  }
});
