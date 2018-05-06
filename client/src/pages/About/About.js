import React from 'react';
import './About.scss';

import Container from '../../components/UI/Container/Container';

const About = () => {
  return (
    <div className='about-page'>
      <Container>
        <h2>About Us</h2>
        <p>
          PetGlobal is a website that serves as a platform for advertisers and inquiries related to pet-related needs, to include products, services such as grooming, pet insurance, pet relocation services, pet hotels and spas, and veterinary and emergency care.
        </p>
        <p>
          Customers of PetGlobal are local companies in the Northern Virginia-Washington D.C. metro area.  PetGlobal’s comprehensive services will include:
        </p>
        <ul>
          <li>Pet Retailers</li>
          <li>Pet Insurance</li>
          <li>Grooming</li>
          <li>Relocation</li>
          <li>Hotels and Spas</li>
          <li>Veterinary Care</li>
          <li>Emergency Care</li>
          <li>Social Media</li>
        </ul>
        <p>
          The PetGlobal website will distinguish itself from others by providing top-quality care utilizing cutting-edge technology and efficient Internet capabilities to deliver quality care to the end consumer.
        </p>
        <br />
        <br />
        <h4>Contact Information</h4>
        <p>
          Email: <a href='mailto://lcervant@hotmail.com'>lcervant@hotmail.com</a><br />
          Copyright &copy; 2018
        </p>
      </Container>
    </div>
  );
};

export default About;