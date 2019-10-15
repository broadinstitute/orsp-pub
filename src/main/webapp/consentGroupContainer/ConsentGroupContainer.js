import { Component } from 'react';
import { div, h, hh } from 'react-hyperscript-helpers';
import ConsentGroupReview from '../consentGroupReview/ConsentGroupReview';
import { History } from '../components/History';
import Comments from '../components/Comments';
import '../components/Wizard.css';
import ConsentGroupDocuments from '../consentGroupDocuments/ConsentGroupDocuments';
import MultiTab from '../components/MultiTab';
import { ProjectMigration, Review } from '../util/ajax';
import { isEmpty } from '../util/Utils';
import { scrollToTop } from "../util/Utils";

export const ConsentGroupContainer = hh(class ConsentGroupContainer extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0,
      history: [],
      comments: [],
      dialogContent: '',
      activeTab: 'review'
    };
  }

  componentDidMount() {
    this._isMounted = true;
    scrollToTop();
    if (!isEmpty(this.props.tab)) {
      this.setState(prev => {
        prev.activeTab = this.props.tab;
        return prev;
      })
    }
    this.getHistory();
    this.getComments();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateDetailsStatus = (status) => {
    this.getHistory();
    this.getComments();
    this.props.updateDetailsStatus(status);
  };

  updateDocumentsStatus = (status) => {
    this.getHistory();
    this.props.updateDocumentsStatus(status);
  };

  updateAdminOnlyStatus = (status) => {
    this.getHistory();
    this.props.updateAdminOnlyStatus(status);
  };

  updateContent = () => {
    this.getComments();
    this.getHistory();
  };

  // history
  getHistory() {
    ProjectMigration.getHistory(this.props.consentKey).then(resp => {
      if (this._isMounted) {
        this.setState(prev => {
          prev.history = resp.data;
          return prev;
        });
      }
    }).catch(() => {});
  };

  // comments
  getComments() {
    Review.getComments(this.props.consentKey).then(result => {
      if (this._isMounted) {
        this.setState({ comments: result.data });
      }
    });
  }

  handleTabChange = async (tab) => {
    await this.setState({ activeTab: tab });
  };

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          h(MultiTab, {
            activeKey: this.props.tab !== this.state.activeTab ? this.state.activeTab : this.props.tab,
            handleSelect: this.handleTabChange
          },
            [
              div({
                key: "review",
                title: "Cohort Details",
              }, [
                  h(ConsentGroupReview, {
                    initStatusBoxInfo: this.props.initStatusBoxInfo,
                    changeInfoStatus: this.props.changeInfoStatus,
                    updateDetailsStatus: this.updateDetailsStatus,
                    updateContent: this.updateContent,
                    consentKey: this.props.consentKey,
                    history: this.props.history
                  })
                ]),
              div({
                key: "documents",
                title: "Documents",
              }, [
                  h(ConsentGroupDocuments, {
                    updateDocumentsStatus: this.updateDocumentsStatus,
                    consentKey: this.props.consentKey
                  })
                ]),
              div({
                key: "comments",
                title: "Messages",
              }, [
                h(Comments, {
                  comments: this.state.comments,
                  id: this.props.consentKey,
                  updateContent: this.updateContent
                })
              ]),
              div({
                key: "history",
                title: "History",
              }, [
                History({
                  history: this.state.history
                })
              ])
            ])
        ])
      ])
    );
  }
});
