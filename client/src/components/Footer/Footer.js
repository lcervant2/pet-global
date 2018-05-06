import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './Footer.scss';

// import SpacedSegment from '../SpacedSegment';

import Container from '../UI/Container/Container';

import { withAuth } from '../../helpers/withAuth';

class Footer extends Component {

  render() {
    const { isLoggedIn, currentUser, className } = this.props;

    const inputClass = classNames('footer', className);
    const containerClass = classNames('footer__container');
    const sectionClass = classNames('footer__section');
    const headerClass = classNames('footer__section__header');
    const linkClass = classNames('footer__section__link');

    return (
      <div className={inputClass}>
        <Container className={containerClass}>

          <div className={sectionClass}>
            <div className={headerClass}>Account</div>
            {isLoggedIn ? (
              <div>
                <Link to={'/profile/' + currentUser.username} className={linkClass}>Profile</Link>
                <Link to='/settings' className={linkClass}>Settings</Link>
              </div>
            ) : (
              <div>
                <Link to='/login' className={linkClass}>Login</Link>
                <Link to='/signup' className={linkClass}>Sign Up</Link>
              </div>
            )}
          </div>

          <div className={sectionClass}>
            <div className={headerClass}>PetGlobal</div>
            <Link to='/about' className={linkClass}>About Us</Link>
            <Link to='/terms' className={linkClass}>Terms and Conditions</Link>
          </div>

          <div className={sectionClass}>
            <div className={headerClass}>Are you a business owner?</div>
            <Link to='/businesses/register' className={linkClass}>Register Your Business</Link>
            <Link to='/services' className={linkClass}>Business Services</Link>
          </div>

          <div className={sectionClass} />

        </Container>
      </div>
    )
  }

}

export default withAuth(Footer);