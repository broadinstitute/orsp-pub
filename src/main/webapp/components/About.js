import React, { Component } from 'react';
import { hh, span, div, a, h3, p, br } from 'react-hyperscript-helpers';
import { isEmpty } from "../util/Utils";
import { LoginText, User } from "../util/ajax";
import { AlertMessage } from './AlertMessage';
import { Storage } from '../util/Storage';

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
          heading: '',
          body: '',
          defaultValue: 'default'
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
      LoginText.getLoginText().then(loginText => {
        let data = loginText.data[0];
        if(data[3] === 'default') {
          this.setState({
            defaultValue: 'default'
          })
        } else {
          this.setState({
            defaultValue: ''
          })
        }
        this.setState(prev => {
          prev.heading = data[1];
          let bodyData = data[2];
            bodyData = bodyData.replaceAll("&lt;", "<");
            bodyData = bodyData.replaceAll("&gt;", ">");
          prev.body = bodyData;
          return prev;
        })
      })
  }

  render() {

    const showAccessDetails = !isEmpty(this.props.showAccessDetails) ? true : false;
    return (
      // <div className='row'>
      //   <AlertMessage
      //     msg='You must be a Broad Institute User for further access. Please sign out and log in with a "broadinstitute.org" email account.'
      //     show={Storage.userIsLogged() && !Storage.getCurrentUser().isBroad}
      //     type='danger'
      //   ></AlertMessage>
      //   <div className="col-md-10">
      //     <h3 style={ this.state.defaultValue !== 'default' ? { fontSize: styles.titleSize, color: '#ED1D24', fontWeight: 'bold' } : { fontSize: '24px', color: '#000000', fontWeight: 'bold' }}>{this.state.heading}</h3>
      //     <p 
      //       style={{ fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}
      //       dangerouslySetInnerHTML={{ __html: this.state.body }}
      //     ></p>
      //     <p style={{ fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}>
      //       { component.isBroad && showAccessDetails ? <a
      //         href="https://iwww.broadinstitute.org/sponsored-research/research-subject-protection/office-research-subject-protection"
      //         target="_blank"
      //       >ORSP on the Broad Intranet</a> : undefined }
      //     </p>
      //     { this.props.showWarning ? <p
      //       style={{ fontFamily : styles.fontFamily, fontSize: styles.textFontSize, padding:"15px", border:"1px solid #CCCCCC", borderRadius:"6px", margin:"20px 0 30px 0" }}>
      //         Please note that Microsoft Edge and Internet Explorer are not supported browsers for the ORSP Portal. Please use Google Chrome or Firefox instead.
      //     </p> : undefined }
      //     { component.isBroad && showAccessDetails ? <div>
      //       <h3
      //         style={{ fontSize: styles.titleSize }}
      //       >User Guide</h3>
      //       <p style={{ fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}>To access detailed instructions about how to use the ORSP portal, please visit: 
      //         <br/>
      //         <a
      //           href="https://intranet.broadinstitute.org/research-subject-protection/orsp-online-portal-submission-system"
      //           target="_blank"
      //         >https://intranet.broadinstitute.org/research-subject-protection/orsp-online-portal-submission-system</a>
      //       </p>
      //     </div> : undefined }
      //   </div>
      // </div>
      div({className: "row"}, [
        AlertMessage({
          msg: 'You must be a Broad Institute User for further access. Please sign out and log in with a "broadinstitute.org" email account.',
          show: Storage.userIsLogged() && !Storage.getCurrentUser().isBroad,
          type: 'danger'
        }),
  
        div({ className: "col-md-10" }, [
          h3({ style: { fontSize: styles.titleSize, color: '#ED1D24', fontWeight: 'bold' }
          },['About the ORSP Portal']),
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            a({
              isRendered: component.isBroad && showAccessDetails,
              href:"https://iwww.broadinstitute.org/sponsored-research/research-subject-protection/office-research-subject-protection", target: "_blank"}, [
                "ORSP on the Broad Intranet"
            ]),
          ]),
          p({style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [this.state.body]),
          // p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
          //   "The Office of Research Subject Protection (ORSP) at the Broad Institute is committed to helping " +
          //   "our community members adhere to federal regulations and institutional policies governing the " +
          //   "protection of human subjects who make our research possible. To fulfill that mission, the Broad " +
          //   "must ensure appropriate regulatory oversight and reliable documentation storage. The ORSP " +
          //   "Portal (accessible at ",  
          //   a({href:"https://orsp.broadinstitute.org/"}, ["https://orsp.broadinstitute.org/"]),
          //   "​) is an online platform where Broad staff " +
          //   "members can upload documents for ORSP review (either as stand-alone submissions, or in " +
          //   "preparation for an IRB protocol application), store consent forms and regulatory approvals, and " +
          //   "search for data use restrictions. Please contact ",
          //   a({href:"mailto:orsp-portal@broadinstitute.org"}, ["orsp-portal@broadinstitute.org"]),
          //   " with any questions or requests for assistance.",
          // ]),
          p({ isRendered: this.props.showWarning, style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize, padding:"15px", border:"1px solid #CCCCCC", borderRadius:"6px", margin:"20px 0 30px 0"}},[
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
