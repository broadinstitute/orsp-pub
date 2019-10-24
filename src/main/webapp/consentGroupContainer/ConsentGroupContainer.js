import { Component } from 'react';
import { div, h, hh } from 'react-hyperscript-helpers';
import ConsentGroupReview from '../consentGroupReview/ConsentGroupReview';
import { History } from '../components/History';
import Comments from '../components/Comments';
import '../components/Wizard.css';
import ConsentGroupDocuments from '../consentGroupDocuments/ConsentGroupDocuments';
import MultiTab from '../components/MultiTab';
import { ConsentGroup, ProjectMigration, Review } from '../util/ajax';
import { KeyDocumentsEnum } from "../util/KeyDocuments";
import { subscriber } from "../services/messageService";
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
      activeTab: 'review',
      isConsentFormPresent: false,
      isConsentFormAnswered: false,
      isConsentFormAnsweredEdit: false,
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

  consentFormDocument = (documents) => {
    const consentDocPresent = documents.filter(doc => doc.fileType === KeyDocumentsEnum.CONSENT_DOCUMENT).length > 0;
    this.setState(prev => {
      prev.isConsentFormPresent = consentDocPresent;
      return prev;
    });
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

  noConsentFormAnswer = (isAnswered) => {
    this.setState(prev => {
      prev.isConsentFormAnswered = isAnswered;
      return prev;
    });
  };

  noConsentFormAnswerEdit = (isAnsweredEdited) => {
    this.setState(prev => {
      prev.isConsentFormAnsweredEdit = isAnsweredEdited;
      return prev;
    });
  };

  deleteNoConsentReason = async () => {
    if (this.state.isConsentFormAnsweredEdit) {
      this.setState(prev => {
        prev.isConsentFormAnsweredEdit = false;
        return prev;
      });
    }
    if (this.state.isConsentFormAnswered) {
      subscriber.next('');
      await ConsentGroup.deleteNoReasonConsent(this.props.consentKey);
      this.setState(prev => {
        prev.isConsentFormAnswered = false;
        return prev;
      })
    }
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
                    consentFormDocument: this.state.isConsentFormPresent,
                    noConsentFormAnswer: this.noConsentFormAnswer,
                    noConsentFormAnswerEdit: this.noConsentFormAnswerEdit,
                    history: this.props.history
                  })
                ]),
              div({
                key: "documents",
                title: "Documents",
              }, [
                  h(ConsentGroupDocuments, {
                    updateDocumentsStatus: this.updateDocumentsStatus,
                    consentKey: this.props.consentKey,
                    consentFormDocument: this.consentFormDocument,
                    deleteNoConsentReason: this.deleteNoConsentReason
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
