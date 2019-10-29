import { Component, Fragment } from 'react';
import { div, a, hh, h, button, span } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';
import { Panel } from '../components/Panel';
import MultiTab from "../components/MultiTab";
import { Table } from "../components/Table";
import { Files } from "../util/ajax";
import _ from 'lodash';
import { UrlConstants } from "../util/UrlConstants";
import { Storage } from "../util/Storage";

const headers =
  [
    { name: 'Number', value: 'number' },
    { name: 'Description', value: 'comments' },
    { name: 'Documents', value: 'documents' },
    { name: 'Created', value: 'createDate' },
  ];

const styles = {
  submissionComment: {
    margin: '0 10px 10px 0',
    paddingLeft: '20px',
    width: 'calc(100% - 60px)',
    display: 'inline-block',
    overflow: 'visible',
    whiteSpace: 'normal',
    textOverflow: 'initial',
    wordBreak: 'break-word'
  },

  addSubmission: {
    position: 'absolute',
    right: '30px',
    top: '46px'
  },

  submissionCounter: {
    marginLeft: '1em'
  }
};

export const Submissions = hh(class Submissions extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      amendments:[],
      others: [],
      amendmentDocuments: [],
      otherDocuments: [],
      submissions: {},
      activeTab: 'Amendment',
      numbers: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getDisplaySubmissions();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  submissionEdit = (data) => {
    const indexButton = a({
      className: 'btn btn-default btn-xs pull-left link-btn',
      onClick: () => this.redirectEditSubmission(data)
    }, [!component.isViewer ? 'Edit': 'View']);
    const submissionComment = span({style: styles.submissionComment}, [
      span({dangerouslySetInnerHTML: { __html: data.comments } },[])
    ]);
    return h(Fragment, {}, [indexButton, submissionComment]);
  };

  getDisplaySubmissions = () => {
    let submissions = {};
    let numbers = {};
    ProjectMigration.getDisplaySubmissions(this.props.projectKey).then(resp => {
      submissions = resp.data.groupedSubmissions;

      _.map(submissions, (data, title) => {
        numbers[title] = [];
        data.forEach(submisionData => {
          numbers[title].push(submisionData.number);
          submisionData.documents.forEach(document => {
            Files.getDocument(document.id).then(resp => {
              document.document = resp.data.document;
            });
          });
        });
      });

      Storage.setSubmissionNumbers(numbers);

      if (this._isMounted) {
        this.setState(prev => {
          prev.submissions = submissions;
          return prev;
        });
      }
    }).catch(() => { });
  };

  redirectEditSubmission = (data) => {
    this.props.history.push(`${UrlConstants.submissionsAddNewUrl}?projectKey=${this.props.projectKey}&type=${data.type}&submissionId=${data.id}`);
  };

  redirectNewSubmission = (e) => {
    this.props.history.push(`/submissions/add-new?projectKey=${this.props.projectKey}&type=${e.target.id}`);
  };

  submissionTab = (data, title) => {
    return div({
      key: title, title: this.tabTitle(title, data.length) },[
      a({
        isRendered: !component.isViewer,
        onClick: this.redirectNewSubmission,
        className: "btn btn-primary",
        style: styles.addSubmission,
        id: title
      }, ["Add Submission"]),
      Table({
        headers: headers,
        data: data,
        sizePerPage: 10,
        paginationSize: 10,
        isAdmin: component.isAdmin,
        pagination: true,
        reviewFlow: true,
        submissionEdit: this.submissionEdit,
      })
    ]);
  };

  tabTitle = (title, amount) => {
    return h(Fragment, {}, [
      title,
      span({className: "badge badge-dark", style: styles.submissionCounter}, [amount])
    ]);
  };

  handleTabChange = async (tab) => {
    await this.setState({ activeTab: tab });
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
          div({}, [
            h(MultiTab, {
              activeKey: this.state.activeTab,
              handleSelect: this.handleTabChange
            }, [
              _.map(this.state.submissions, (data, title) => {
                return this.submissionTab(data, title)
              }),
            ])
          ])
        ]),
      ])
    )
  }
});
