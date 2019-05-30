import { Component } from 'react';
import { div, hh, p, span, small } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';

export const History = hh(class History extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
  }

  componentDidMount() {
    this.getHistory();
  }

  getHistory() {
    ProjectMigration.getHistory(component.serverUrl, "DEV-NE-5418").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        this.initializeHistory();
      });
    })
  };

  initializeHistory() {
    $.fn.dataTable.moment('MM/DD/YYYY hh:mm:ss');
    $("#history-table").DataTable({
      dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
      buttons: ['excelHtml5', 'csvHtml5', 'print'],
      language: { search: 'Filter:' },
      pagingType: "full_numbers",
      order: [1, "desc"]
    });
  }

  render() {
    return (
      div({dangerouslySetInnerHTML: { __html: this.state.content } },[])
    )
  }
});
