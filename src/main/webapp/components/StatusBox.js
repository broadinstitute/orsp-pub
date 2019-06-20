import { Component, React } from 'react';
import { hh, h1, span, div, p} from 'react-hyperscript-helpers';
import './QuestionnaireWorkflow.css';

export const StatusBox = hh(class StatusBox extends Component {

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
        p({isRendered: component.issueType === 'project', className: "headerLabel"}, [
          "Status: ",
          span({}, [status])
        ]),
        p({isRendered: component.issueType === 'project', className: "headerLabel"}, [
          "Awaiting action from: ",
          span({}, [actor[0]])
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
