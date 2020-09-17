import { Component, React } from 'react';
import { hh, h1, span, div, p} from 'react-hyperscript-helpers';
import './QuestionnaireWorkflow.css';

export const StatusBox = hh(class StatusBox extends Component {

  showActor(actor) {
    return actor != "" && actor.length > 0;
  }

  render() {
    const {
      type = '',
      projectKey = '',
      summary = '',
      status= '',
      actor= '',
      projectReviewApproved= '',
      attachmentsApproved = ''
    } = this.props.status;
    return(
      div({className: "headerBox"}, [
        p({className: "issue-type"}, [type]),
        h1({className: "projectTitle"}, [
          span({className: "projectKey"}, [projectKey+": " ]),
          span({className: "italic"}, [summary])
        ]),
        p({isRendered: this.props.issueType === 'project', className: "headerLabel"}, [
          "Status: ",
          span({}, [status])
        ]),
        p({isRendered: this.props.issueType === 'project' && this.showActor(actor), className: "headerLabel"}, [
          "Awaiting action from: ",
          span({}, [this.showActor(actor) ? actor.join(", ") : ''])
        ]),
        p({className: "headerBoxStatus"}, [
          span({className: "bold"}, ["Information Sub-Status: "]),
          span({className: "italic"}, [projectReviewApproved ? 'Approved' : 'Pending'])
        ]),
        p({className: "headerBoxStatus"}, [
          span({className: "bold"}, ["Documents Sub-Status: "]),
          span({className: "italic"}, [attachmentsApproved ? 'Approved' : 'Pending'])
        ])
      ])
    );
  }
});
