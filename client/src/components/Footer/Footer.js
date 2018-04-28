import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Segment,
  Header,
  Grid
} from 'semantic-ui-react';
import './Footer.css';

import SpacedSegment from '../SpacedSegment';

import { withAuth } from '../../helpers/withAuth';

class Footer extends Component {

  render() {
    const { isLoggedIn, currentUser } = this.props;

    return (
      <div className='footer'>
        <Container>
          <Grid>
            <Grid.Row>

              <Grid.Column largeScreen={4} mobile={16}>
                <SpacedSegment spacing={2}><Header size='medium' className='footer-header'>Account</Header></SpacedSegment>
                {isLoggedIn ? (
                  <div>
                    <SpacedSegment spacing={1}><Link to={'/profile/' + currentUser.username} className='footer-link'>Profile</Link></SpacedSegment>
                    <SpacedSegment spacing={1}><Link to='/settings' className='footer-link'>Settings</Link></SpacedSegment>
                  </div>
                ) : (
                  <div>
                    <SpacedSegment spacing={1}><Link to='/signup' className='footer-link'>Sign Up</Link></SpacedSegment>
                    <SpacedSegment spacing={1}><Link to='/login' className='footer-link'>Login</Link></SpacedSegment>
                  </div>
                )}
              </Grid.Column>

              <Grid.Column largeScreen={4} mobile={16}>
                <SpacedSegment spacing={2}><Header size='medium' className='footer-header'>PetGlobe</Header></SpacedSegment>
                <SpacedSegment spacing={1}><Link to='/' className='footer-link'>About Us</Link></SpacedSegment>
                <SpacedSegment spacing={1}><Link to='/' className='footer-link'>Contact Us</Link></SpacedSegment>
                <SpacedSegment spacing={1}><Link to='/' className='footer-link'>Terms and Conditions</Link></SpacedSegment>
              </Grid.Column>

              <Grid.Column largeScreen={8} mobile={16}>
                <SpacedSegment spacing={2}><Header size='medium' className='footer-header'>Are you a business owner?</Header></SpacedSegment>
                <SpacedSegment spacing={1}><Link to='/businesses/register' className='footer-link'>Register Your Business</Link></SpacedSegment>
              </Grid.Column>

            </Grid.Row>
          </Grid>
        </Container>
      </div>
    )
  }

}

export default withAuth(Footer);