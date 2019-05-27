
import { Component } from 'react';
import { div, hh, label, span, className, h1, p } from 'react-hyperscript-helpers';
import axios from 'axios';
import '../components/Wizard.css';



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
    })
    if (n == 7) {
      this.buildHistory();
      // const url = "https://localhost:8443/dev/api/history";
      // return a({
      //   href: url,
      //   target: '_blank'
      // }, [link])
      //   window.location.href = "https://localhost:8443/dev/api/history";
      // return axios.get("https://localhost:8443/dev/api/history?id=ORSP-641");

    }
  };

  buildHistory = () => {
    axios.get("https://localhost:8443/dev/api/history?id=ORSP-641").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      })
      console.log(resp.data);
      return resp.data;
    });
  }

  render() {

    const { currentStepIndex } = this.state;
    
    return (

      div({}, [
        div({ className: "headerBox"}, [
          p({ className: "headerBoxStatus" }, ["Project Type"]),
          h1({}, [
            span({ className: "bold" }, ["ProjectKey: "]), 
            span({ className: "italic" }, ["ProjectTitle"])
          ]),
          p({}, [
            "Status: ",
            span({},  ["ActualStatus"]), 
            "; Awaiting action from: ",
            span({ className: "italic" },  ["ActualPerson"])
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

        div({ className: "containerBox"}, [
          div({ className: "tabContainer"}, [


            //   this.props.children.map((child, idx) => {
            //     return h(Fragment, { key: idx }, [
            //       div({ className: "tabStep " + (idx === currentStepIndex ? "active" : ""), onClick: this.goStep(idx)}, [child.props.title])
            //     ])
            //   })


            div({ className: "tabStep " + (currentStepIndex === 0 ? "active" : ""), onClick: this.goStep(0) }, ["Project Details"]),
            div({ className: "tabStep " + (currentStepIndex === 1 ? "active" : ""), onClick: this.goStep(1) }, ["Broad Project Info"]),
            div({ className: "tabStep " + (currentStepIndex === 2 ? "active" : ""), onClick: this.goStep(2) }, ["Documents New"]),
            div({ className: "tabStep " + (currentStepIndex === 3 ? "active" : ""), onClick: this.goStep(3) }, ["Documents"]),
            div({ className: "tabStep " + (currentStepIndex === 4 ? "active" : ""), onClick: this.goStep(4) }, ["Sample/Data Cohort"]),
            div({ className: "tabStep " + (currentStepIndex === 5 ? "active" : ""), onClick: this.goStep(5) }, ["Submissions"]),
            div({ className: "tabStep " + (currentStepIndex === 6 ? "active" : ""), onClick: this.goStep(6) }, ["Messages"]),
            div({ className: "tabStep " + (currentStepIndex === 7 ? "active" : ""), onClick: this.goStep(7) }, ["History"]),
          ]),
          div({ className: "tabContent", dangerouslySetInnerHTML: { __html: this.state.content }  }, [
            
          ])
        ])
      ])
    );
  }
}

export default ProjectContainer;
