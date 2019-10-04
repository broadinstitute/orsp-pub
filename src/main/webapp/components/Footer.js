import React from 'react';

export const Footer = () => {
  const copy = <div>Copyright © 2019 Eli & Edythe L. Broad Institute. All rights reserved. No unauthorized use or disclosure is permitted.</div>
  const links = <div style={{margin: '3rem 0 1rem 0'}}>
      <a href="https://www.broadinstitute.org/contact-us/privacy-policy-broad-institute-website" target="_blank"> Privacy Policy </a>
      | 
      <a href="https://www.broadinstitute.org/contact-us/terms-and-conditions" target="_blank"> Terms of Service </a>
  </div>
  const well = <div className={"well"}> 
    {copy} {links}
  </div>
  return (
    <footer>
      <div className={"row"}>
        <div className={"col-xs-12"}>
          {well}
          </div>
      </div>
    </footer>
  )
};

export default Footer;
