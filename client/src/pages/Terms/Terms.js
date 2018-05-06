import React from 'react';
import './Terms.scss';

import Container from '../../components/UI/Container/Container';

const Terms = () => {
  return (
    <div className='terms-page'>
      <Container>
        <h2>Terms and Conditions</h2>
        <p>
          The petglobal.com<br />
          4593 Pleasant Valley Rd<br />
          Fairfax, VA 20251<br />
          703-936-7389
        </p>
        <p>
          Effective Date: May 4, 2018
        </p>
        <p>
          This web page represents a legal document and is the Terms and Conditions (Agreement) for our website, www.petglobal.com. By using our Website, you agree to fully comply with and be bound by the following Agreement each time you use our Website. Please review the following terms carefully.
        </p>
        <h4>Definitions</h4>
        <p>
          The terms “us”, “we”, and “our” refer to PetGlobal.com, the owner of this Website. A “Visitor” is someone who merely browses our Website. A “Member” is someone who has registered with our Website to use our Services. The term “User” is a collective identifier that refers to either a Visitor or a Member. The term “Product” refers to any products we sell or give away.
        </p>
        <p>
          All text, information, graphics, design, and data offered through our Website or Services, whether produced by our Members or by us, are collectively known as our “Content”. We distinguish content posted by our Members as “Member Content”.
        </p>
        <h4>Acceptance of Agreement</h4>
        <p>
          This Agreement is between you and PetGlobal.com
        </p>
        <p>
          THIS AGREEMENT CONTAINS WARRANTY DISCLAIMERS AND OTHER PROVISIONS THAT LIMIT OUR LIABILITY TO YOU. PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY AND IN THEIR ENTIRETY, AS USING, ACCESSING, AND/OR BROWSING OUR WEBSITE CONSTITUTES ACCEPTANCE OF THESE TERMS AND CONDITIONS. IF YOU DO NOT AGREE TO BE BOUND TO EACH AND EVERY TERM AND CONDITION SET FORTH HEREIN, PLEASE EXIT OUR WEBSITE IMMEDIATELY AND DO NOT USE, ACCESS, AND/OR BROWSE IT FURTHER.
        </p>
        <p>
          Except as otherwise noted, this Agreement constitutes the entire and only Agreement between you and the petglobal.com and supersedes all other Agreements, representations, warranties, and understandings with respect to our Website, Services, and the subject matter contained herein.
        </p>
        <p>
          However, for you to use our Website and/or Services, you may also be required to agree to additional terms and conditions. Those additional terms and conditions will be incorporated into this Agreement unless otherwise stated.
        </p>
      </Container>
    </div>
  );
};

export default Terms;