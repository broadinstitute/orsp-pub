import { Component } from 'react';
import { div, hh } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';

export const Submissions = hh(class Submissions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
  }

  componentDidMount() {
    this.getSubmissions();
  }

  getSubmissions() {
    ProjectMigration.getSubmissions(this.props.serverURL, this.props.projectKey).then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        this.loadSubmissions();
      })
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

  render() {
    return (
      div({dangerouslySetInnerHTML: { __html: this.state.content } },[])
    )
  }
});
