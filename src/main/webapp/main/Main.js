import { Component, Fragment} from 'react';
import { h, div, h2, label, span, a } from 'react-hyperscript-helpers';
import { StatusBox } from "../components/StatusBox";
import { ProjectContainer } from "../projectContainer/ProjectContainer";


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: {}
    };
  }

  componentDidMount() {
    // DEBUGUBUGU
    this.setState({
      // searchUsersURL : component.searchUsersURL, // searchUsersURL = "/dev/search/getMatchingUsers"
      // projectKey : component.projectKey,
      // projectUrl : component.projectUrl, //         projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
      // isAdmin : component.isAdmin,
      // isViewer : component.isViewer,
      // serverURL : component.serverURL,
      // rejectProjectUrl : component.rejectProjectUrl,
      // updateProjectUrl : component.updateProjectUrl,
      // discardReviewUrl : component.discardReviewUrl,
      // clarificationUrl : component.clarificationUrl,
      // loadingImage : component.loadingImage
    })
  }

  statusBoxHandler = (issue) => {
    console.log("statusBoxHandler", issue);
    this.setState(prev => {
      prev.status = issue;
      return prev;
    });
  };

  render () {
    console.log("project key:--", component.projectKey);
    console.log("pk****:--", component.pk);
    return (
      div({},[
        StatusBox({
          status: this.state.status
        }),
        ProjectContainer({
          statusBoxHandler: this.statusBoxHandler,
          searchUsersURL : component.searchUsersURL, // searchUsersURL = "/dev/search/getMatchingUsers"
          projectKey : component.projectKey,
          projectUrl : component.projectUrl, //         projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
          isAdmin : component.isAdmin,
          isViewer : component.isViewer,
          serverURL : component.serverURL,
          rejectProjectUrl : component.rejectProjectUrl,
          updateProjectUrl : component.updateProjectUrl,
          discardReviewUrl : component.discardReviewUrl,
          clarificationUrl : component.clarificationUrl,
          loadingImage : component.loadingImage,
          saveExtraPropUrl: component.saveExtraPropUrl

        })
      ])
    );
  }
}

export default Main;
