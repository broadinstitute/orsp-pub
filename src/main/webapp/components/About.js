import { Component } from 'react';
import { hh, span, div, a, h3, p, br } from 'react-hyperscript-helpers';
import { isEmpty } from "../util/Utils";
import { User } from "../util/ajax";
import { Storage } from '../util/Storage';
import { AlertMessage } from './AlertMessage';
import { nonBroadUser } from '../util/UserUtils';

const styles = {
  titleSize: '24px',
  fontFamily : '"Helvetica Neue",Helvetica,Arial,sans-serif',
  textFontSize: '14px'
};

export const About = hh(class About extends Component {

  constructor(props){
      super(props);
      this.state = {
          logged: false,
      };
  }

  hasSession = () => {
      User.isAuthenticated().then(resp => {
        this.setState({
          logged: resp.data.session
        })
      }).catch(error => this.setState(() => { throw error; }));
  };

  componentDidMount(){
      this.hasSession();
  }

  render() {

    const showAccessDetails = !isEmpty(this.props.showAccessDetails) ? true : false;
    return (
      
      div({className:"row"}, [
        AlertMessage({
          msg: 'You must be a Broad Institute User for further access. Please sign out and log in with a "broadinstitute.org" email account.',
          show: nonBroadUser(),
          type: 'danger'
        }),
        div({ className: "col-md-10" }, [
          h3({ style: { fontSize: styles.titleSize }
          },["About the ORSP Portal"]),
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            a({
              isRendered: Storage.userIsLogged() && !nonBroadUser() && showAccessDetails,
              href:"https://iwww.broadinstitute.org/sponsored-research/research-subject-protection/office-research-subject-protection", target: "_blank"}, [
                "ORSP on the Broad Intranet"
            ]),
          ]),
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            "The Broad's Office of Research Subject Protection (ORSP) is committed to helping our community adhere to " +
            "federal regulations and institutional policies governing the protection of human subjects who make our " +
            "research possible. To fulfill that mission, the Broad must ensure appropriate regulatory oversight and " +
            "reliable documentation storage.  The ORSP Portal is an online platform where Broad staff members can upload " +
            "documents for ORSP review (either as stand-alone submissions, or in preparation for an IRB protocol applications), " +
            "store consent forms and regulatory approvals, and search for data use restrictions. Please contact ",
            a({
              href:"mailto:orsp-portal@broadinstitute.org"}, ["orsp-portal@broadinstitute.org"]
            ), " for assistance."
          ]),
          div({ isRendered: Storage.userIsLogged() && !nonBroadUser() && showAccessDetails }, [
              h3({ style: { fontSize: styles.titleSize }}, ["User Guide"]),
              p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }},[
                "To access detailed instructions about how to use the ORSP portal, please visit: ",
                br({}),
                a({
                  href:"https://intranet.broadinstitute.org/research-subject-protection/orsp-online-portal-submission-system", target: "_blank"},
                  ["https://intranet.broadinstitute.org/research-subject-protection/orsp-online-portal-submission-system"]
                )
              ])
          ])
        ])
      ])
    )
  }
});
