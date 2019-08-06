import React, { Component } from 'react';
import { h3, p, a, br, div } from 'react-hyperscript-helpers';

class AboutPage extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      div({ className: "col-md-10" }, [
        h3({},["About the ORSP Portal"]),
        p({}, [
          a({
            href:"https://iwww.broadinstitute.org/sponsored-research/research-subject-protection/office-research-subject-protection"}, [
              "ORSP on the Broad Intranet"
          ]),
        ]),
        p({}, [
          "The Broad's Office of Research Subject Protection (ORSP) is committed to helping our community adhere to " +
          "federal regulations and institutional policies governing the protection of human subjects who make our" +
          "research possible. To fulfill that mission, the Broad must ensure appropriate regulatory oversight and" +
          "reliable documentation storage.  The ORSP Portal is an online platform where Broad staff members can upload " +
          "documents for ORSP review (either as stand-alone submissions, or in preparation for an IRB protocol applications), " +
          "store consent forms and regulatory approvals, and search for data use restrictions. Please contact ",
          a({
            href:"mailto:orsp-portal@broadinstitute.org"}, ["orsp-portal@broadinstitute.org"]
          ), " for assistance."
        ]),
        h3({}, ["User Guide"]),
        p({},[
          "To access detailed instructions about how to use the ORSP portal, please visit:",
          br({}),
          a({
            href:"https://intranet.broadinstitute.org/research-subject-protection/orsp-online-portal-submission-system"},
            ["https://intranet.broadinstitute.org/research-subject-protection/orsp-online-portal-submission-system"]
          )
        ])
      ])
    );
  }
}

export default AboutPage;
