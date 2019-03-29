import React from 'react'
import ReactDOM from 'react-dom'
import { a, div } from 'react-hyperscript-helpers'

export class Footer extends React.Component {
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
    return div({className: "container"}, [well]);
  }
}

ReactDOM.render(
  <Footer/>,
  document.getElementById("footer")
);
