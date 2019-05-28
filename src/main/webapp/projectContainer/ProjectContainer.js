
import { Component } from 'react';
import { div, hh, label, span, className, h1, p } from 'react-hyperscript-helpers';
import axios from 'axios';
import '../components/Wizard.css';
import './index.css';



class ProjectContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0,
      content: ''
    };
  }

  goStep = (n) => (e) => {
    this.setState(prev => {
      prev.currentStepIndex = n;
      return prev;
    });
    if (n == 3) {
      this.buildSubmissions();
    }
    if (n == 4) {
      this.buildComments();
    }
    if (n == 5) {
      this.buildHistory();
    }
  };

  buildHistory = () => {
    tinymce.remove();
    axios.get("https://localhost:8443/dev/api/history?id=ORSP-641").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      });
      $.fn.dataTable.moment('M/D/YYYY');
      $(".submissionTable").DataTable({
        dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
        buttons: [],
        language: { search: 'Filter:' },
        pagingType: "full_numbers",
        pageLength: 50,
        columnDefs: [{ targets: [1, 2], orderable: false }],
        order: [0, "desc"]
      });
    });
  };

  buildComments = () => {
    axios.get("https://localhost:8443/dev/api/comments?id=ORSP-641").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        this.loadComments();
      });
    });
  };

  loadComments(url) {
    // $("#comments").load(
    //   url,
    //  function () {
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
   //   }
   // );
  }
  initializeEditor() {
   // tinymce.remove();
    tinymce.init({
      selector: 'textarea.editor',
      width: '100%',
      menubar: false,
      statusbar: false,
      plugins: "paste",
      paste_data_images: false
    });

  }

  buildSubmissions = () => {
    axios.get("https://localhost:8443/dev/api/submissions?id=ORSP-641").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, function () {
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
      })
      return resp.data;
    });
  };

  render() {

    const { currentStepIndex } = this.state;

    return (

      div({ className: "headerBoxContainer" }, [
        div({ className: "headerBox" }, [
          p({ className: "headerBoxStatus top" }, ["Project Type"]),
          h1({ className: "projectTitle" }, [
            span({ className: "projectKey" }, ["ProjectKey: "]),
            span({ className: "italic" }, ["ProjectTitle"])
          ]),


          p({ className: "headerLabel" }, [
            "Status: ",
            span({ className: "block" }, ["ActualStatus"])
          ]),

          p({ className: "headerLabel" }, [
            "Awaiting action from: ",
            span({ className: "block" }, ["ActualPerson"])
          ]),



          p({ className: "headerBoxStatus" }, [
            span({ className: "bold" }, ["New Status: "]),
            span({ className: "italic" }, ["SomeStatus"])
          ]),
          p({ className: "headerBoxStatus" }, [
            span({ className: "bold" }, ["Information Sub-Status: "]),
            span({ className: "italic" }, ["SomeStatus"])
          ]),
          p({ className: "headerBoxStatus" }, [
            span({ className: "bold" }, ["Documents Sub-Status: "]),
            span({ className: "italic" }, ["SomeStatus"])
          ])
        ]),

        div({ className: "containerBox" }, [
          div({ className: "tabContainer" }, [


            //   this.props.children.map((child, idx) => {
            //     return h(Fragment, { key: idx }, [
            //       div({ className: "tabStep " + (idx === currentStepIndex ? "active" : ""), onClick: this.goStep(idx)}, [child.props.title])
            //     ])
            //   })


            div({ className: "tabStep " + (currentStepIndex === 0 ? "active" : ""), onClick: this.goStep(0) }, ["Project Details"]),
            div({ className: "tabStep " + (currentStepIndex === 1 ? "active" : ""), onClick: this.goStep(1) }, ["Documents New"]),
            div({ className: "tabStep " + (currentStepIndex === 2 ? "active" : ""), onClick: this.goStep(2) }, ["Sample/Data Cohort"]),
            div({ className: "tabStep " + (currentStepIndex === 3 ? "active" : ""), onClick: this.goStep(3) }, ["Submissions"]),
            div({ className: "tabStep " + (currentStepIndex === 4 ? "active" : ""), onClick: this.goStep(4) }, ["Messages"]),
            div({ className: "tabStep " + (currentStepIndex === 5 ? "active" : ""), onClick: this.goStep(5) }, ["History"]),
          ]),
          div({ className: "tabContent", dangerouslySetInnerHTML: { __html: this.state.content } }, [

          ])
        ])
      ])
    );
  }
}

export default ProjectContainer;
