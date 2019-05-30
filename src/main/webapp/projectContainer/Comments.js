import { Component } from 'react';
import { div, hh, p, span, small } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';

export const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
  }

  componentDidMount() {
    this.getComments();
  }

  getComments() {
    ProjectMigration.getComments(component.serverUrl, "DEV-NE-5418").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        this.initializeComments();
      });
    })
  };

  initializeComments() {
    tinymce.remove();
    $.fn.dataTable.moment('MM/DD/YYYY hh:mm:ss');
    $("#comments-table").DataTable({
      dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
      buttons: ['excelHtml5', 'csvHtml5', 'print'],
      language: { search: 'Filter:' },
      pagingType: "full_numbers",
      order: [1, "desc"]
    });
  
    this.initializeEditor();
  }
  
  initializeEditor() {
    tinymce.init({
      selector: 'textarea.editor',
      width: '100%',
      menubar: false,
      statusbar: false,
      plugins: "paste",
      paste_data_images: false
    });
  }

  render() {
    return (
      div({dangerouslySetInnerHTML: { __html: this.state.content } },[])
    )
  }
});
