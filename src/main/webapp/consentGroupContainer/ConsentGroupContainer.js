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
    ProjectMigration.getHistory(component.serverURL, component.consentKey).then(resp => {
      this.setState(prev => {
        prev.history = resp.data;
        return prev;
      })
    });
  };

  // comments
  getComments() {
    Review.getComments(component.consentKey).then(result => {
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
          MultiTab({ defaultActive: component.tab === "" ? this.state.defaultActive : component.tab },
            [
              div({
                key: "review",
                title: "Cohort Details",
              }, [
                  h(ConsentGroupReview, {
                    initStatusBoxInfo: this.props.initStatusBoxInfo,
                    changeInfoStatus: this.props.changeInfoStatus,
                    updateDetailsStatus: this.updateDetailsStatus,
                    updateContent: this.updateContent
                  })
                ]),
              div({
                key: "documents",
                title: "Documents",
              }, [
                  h(ConsentGroupDocuments, {
                    updateDocumentsStatus: this.updateDocumentsStatus
                  })
                ]),
              div({
                key: "comments",
                title: "Messages",
              }, [
                  h(Fragment, {}, [Comments({
                    comments: this.state.comments,
                    id: component.consentKey,
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
