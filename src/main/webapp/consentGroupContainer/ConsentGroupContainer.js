import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { ConsentGroupReview } from "../consentGroupReview/ConsentGroupReview";
import { History } from "../components/History";
import { Comments } from "../components/Comments";
import '../components/Wizard.css';
import { ConsentGroupDocuments } from "../consentGroupDocuments/ConsentGroupDocuments";
import { MultiTab } from "../components/MultiTab";
import { ProjectMigration } from '../util/ajax';

export const ConsentGroupContainer = hh(class ConsentGroupContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0,
      historyContent: '',
      dialogContent: '',
      defaultActive: 'review'
    };
  }

  componentDidMount() {
    this.getHistory();
  }

  updateDetailsStatus = (status) => {
    this.getHistory();
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
    this.getHistory();
  };

  // history
  getHistory() {
    ProjectMigration.getHistory(component.serverURL, component.consentKey).then(resp => {
      this.setState(prev => {
        prev.historyContent = resp.data;
        return prev;
      }, () => {
        this.initializeHistory();
      });
    })
  };

  initializeHistory() {
    $.fn.dataTable.moment('MM/DD/YYYY hh:mm:ss');
    if (!$.fn.dataTable.isDataTable("#history-table")) {
      $("#history-table").DataTable({
        dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
        buttons: ['excelHtml5', 'csvHtml5', 'printContent'],
        language: { search: 'Filter:' },
        pagingType: "full_numbers",
        order: [1, "desc"]
      });
    }
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
                    id: component.consentKey
                  })]),
                ]),
              div({
                key: "history",
                title: "History",
              }, [
                  h(Fragment, {}, [History({
                    historyContent: this.state.historyContent
                  }
                  )])
                ])
            ])
        ])
      ])
    );
  }
});
