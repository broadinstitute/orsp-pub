import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { ConsentGroupReview } from "../consentGroupReview/ConsentGroupReview";
import { History } from "../components/History";
import { Comments } from "../components/Comments";
import '../components/Wizard.css';
import { ConsentGroupDocuments } from "../consentGroupDocuments/ConsentGroupDocuments";
import { MultiTab } from "../components/MultiTab";
import { ProjectMigration, Review } from '../util/ajax';

export const ConsentGroupContainer = hh(class ConsentGroupContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0,
      history: [],
      comments: [],
      dialogContent: '',
      defaultActive: 'review'
    };
  }

  componentDidMount() {
    this.getHistory();
    this.getComments();
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
      this.setState(prev => {
        prev.history = resp.data;
        return prev;
      })
    });
  };

  // comments
  getComments() {
    Review.getComments(this.props.consentKey).then(result => {
      this.setState(prev => {
        prev.comments = result.data;
        return prev;
      })
    });
  }

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          MultiTab({ defaultActive: this.props.tab === "" ? this.state.defaultActive : this.props.tab },
            [
              div({
                key: "review",
                title: "Cohort Details",
              }, [
                  h(ConsentGroupReview, {
                    showSpinner: this.props.showSpinner,
                    hideSpinner: this.props.hideSpinner,
                    initStatusBoxInfo: this.props.initStatusBoxInfo,
                    changeInfoStatus: this.props.changeInfoStatus,
                    updateDetailsStatus: this.updateDetailsStatus,
                    updateContent: this.updateContent,
                    consentKey: this.props.consentKey
                  })
                ]),
              div({
                key: "documents",
                title: "Documents",
              }, [
                  h(ConsentGroupDocuments, {
                    showSpinner: this.props.showSpinner,
                    hideSpinner: this.props.hideSpinner,
                    updateDocumentsStatus: this.updateDocumentsStatus,
                    consentKey: this.props.consentKey
                  })
                ]),
              div({
                key: "comments",
                title: "Messages",
              }, [
                  h(Fragment, {}, [Comments({
                    showSpinner: this.props.showSpinner,
                    hideSpinner: this.props.hideSpinner,
                    comments: this.state.comments,
                    id: this.props.consentKey,
                    updateContent: this.updateContent
                  })]),
                ]),
              div({
                key: "history",
                title: "History",
              }, [
                  h(Fragment, {}, [History({
                    history: this.state.history
                  })])
                ])
            ])
        ])
      ])
    );
  }
});
