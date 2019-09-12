import { Component } from 'react'
import { a, div, hh, footer } from 'react-hyperscript-helpers'
import { styles } from '../util/ReportConstants';

export const Footer = hh(class Footer extends Component {
  render() {
    const copy = div("Copyright © 2019 Eli & Edythe L. Broad Institute. All rights reserved. No unauthorized use or disclosure is permitted.");
    const links = div({style: {margin: "3rem 0 1rem 0"}},
      [
        a({href: "https://www.broadinstitute.org/contact-us/privacy-policy-broad-institute-website", target: "_blank"}, "Privacy Policy"),
        " | ",
        a({href: "https://www.broadinstitute.org/contact-us/terms-and-conditions", target: "_blank"}, "Terms of Service")
      ]
    );
    const well = div({className: "well"}, [copy, links]);
    return footer({style: {'marginTop': '30px'}}, [
      div({className: "row"}, [
        div({className: "col-xs-12"}, [
          well
        ])
      ])
    ]);
  }
});

export default Footer;
