import React, { Component } from 'react';
import { hh, span, div, a, h3, p, br, ul, li } from 'react-hyperscript-helpers';
import { isEmpty } from "../util/Utils";
import { LoginText, User } from "../util/ajax";
import { AlertMessage } from './AlertMessage';
import { Storage } from '../util/Storage';
import { PortalMessage } from './PortalMessage';

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
      div({className: "row"}, [
        AlertMessage({
          msg: 'You must be a Broad Institute User for further access. Please sign out and log in with a "broadinstitute.org" email account.',
          show: Storage.userIsLogged() && !Storage.getCurrentUser().isBroad,
          type: 'danger'
        }),      
        PortalMessage({}),
        div({ className: "col-md-10" }, [
          h3({ style: { fontSize: styles.titleSize }
          },['About the ORSP Portal']),
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            a({
              isRendered: component.isBroad && showAccessDetails,
              href:"https://iwww.broadinstitute.org/sponsored-research/research-subject-protection/office-research-subject-protection", target: "_blank"}, [
                "ORSP on the Broad Intranet"
            ]),
          ]),
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            "The Office of Research Subject Protection (ORSP) at the Broad Institute is committed to helping " +
            "our community members adhere to federal regulations and institutional policies governing the " +
            "protection of human subjects who make our research possible. To fulfill that mission, the Broad " +
            "must ensure appropriate regulatory oversight and reliable documentation storage. The ORSP " +
            "Portal (accessible at ",  
            a({href:"https://orsp.broadinstitute.org/"}, ["https://orsp.broadinstitute.org/"]),
            "​) is an online platform where Broad staff " +
            "members can upload documents for ORSP review (either as stand-alone submissions, or in " +
            "preparation for an IRB protocol application), store consent forms and regulatory approvals, and " +
            "search for data use restrictions. Please contact ",
            a({href:"mailto:orsp-portal@broadinstitute.org"}, ["orsp-portal@broadinstitute.org"]),
            " with any questions or requests for assistance.",
          ]),
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            "In accordance with Institutional policies, ORSP must review (via an ORSP Portal submission) " +
            "any Broad project that involves either biospecimens or data originating from human sources, with the following exceptions: "]),
            ul([
              li([
                "Projects that are exclusively fee-for-service work for external entities (e.g. pharmaceutical companies, researchers with no " +
                "Broad affiliation or Broad email address), and that do not involve research collaborations (e.g. substantial contributions to " +
                "research design, joint data analysis, etc) with Broad-affiliated researchers.  Such projects are, however, subject to review by " +
                "Broad’s Office of Strategic Alliances and Partnerships (OSAP).  For additional information about OSAP review, " +
                "contact ", a({href:"mailto: agreements@broadinstitute.org"}, ["agreements@broadinstitute.org"]), " agreements@broadinstitute.org. ",
                span({style: {color: "rgb(211 79 79)"}}, ["Fee-for-service projects that have been reviewed by OSAP may use ORSP-ID NE-8596 " +
                "when placing orders to the Genomics Platform/Broad Clinical Labs (including Walk-Up Sequencing)."])
              ]),br(),
              li([
                "Projects that involve ", span({style: {textDecoration: "underline"}}, ["only commercially/publicly available biospecimens"]), 
                " (e.g. cell lines sourced from ATCC) or publicly available data " +
                "(e.g. open source data such as GEO, or controlled access data available via a data access committee such as dbGaP, provided that " +
                "IRB approval is not a condition for access). ", 
                span({style: {color: "rgb(211 79 79)"}}, ["Such projects can use ORSP-ID NHSR-8716 when placing orders to the Genomics Platform/Broad Clinical Labs (including Walk-Up Sequencing). "]), 
                "Please note that projects involving the use of human embryonic stem cells DO require ORSP review."
              ])
            ]),
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            "ORSP remains available to review projects that do not, per policy, require submission to the ORSP Portal, " +
            "particularly in cases where there are questions about Broad's engagement in research, or whether data generated " +
            "from a project can be shared widely in the future (e.g. datasets generated from commercially available " +
            "biospecimens that may require dbGaP deposition in the future). Email ", 
            a({href:"mailto: orsp@broadinstitute.org"}, ["orsp@broadinstitute.org"]), " for assistance."
          ]),
          p({ isRendered: this.props.showWarning, 
              style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize, padding:"15px", border:"1px solid #CCCCCC", borderRadius:"6px", margin:"20px 0 30px 0"}},[
            "Please note that Microsoft Edge and Internet Explorer are not supported browsers for the ORSP Portal. Please use Google Chrome or Firefox instead."
          ]),
          div({ isRendered:  component.isBroad && showAccessDetails}, [
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
    );
  }
});
