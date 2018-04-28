import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  Segment,
  Button
} from 'semantic-ui-react';

import SpacedSegment from '../../components/SpacedSegment';
import Business from '../../components/Business';

import APIService from '../../services/APIService';

import { withAuth } from '../../helpers/withAuth';

class Businesses extends Component {

  constructor(props) {
    super(props);

    this.loadBusinesses = this.loadBusinesses.bind(this);

    this.state = {
      isLoading: true,
      businesses: []
    };
  }

  componentWillMount() {
    if (this.props.isLoggedIn)
      this.loadBusinesses(this.props.currentUser.id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isLoggedIn)
      this.loadBusinesses(newProps.currentUser.id);
  }

  loadBusinesses(id) {
    this.setState({
      isLoading: true,
      businesses: []
    });

    APIService.shared().requestUserBusinesses(id)
      .then(response => {
        this.setState({
          isLoading: false,
          businesses: response
        });
      });
  }

  render() {
    const { isLoading, businesses } = this.state;

    return (
      <Container>
        <SpacedSegment spacing={4}>
          <Header size='huge'>Your Businesses</Header>
        </SpacedSegment>
        <Segment basic loading={isLoading}>
          {!isLoading && !businesses.length &&
            <SpacedSegment spacing={0} padding={4} style={{ textAlign: 'center' }}>
              <SpacedSegment spacing={4}><Header size='medium'>You don't have any businesses</Header></SpacedSegment>
              <Button as={Link} to='/businesses/register' primary size='large' content='Register a Business' />
            </SpacedSegment>
          }
          {businesses.map(business => (
            <SpacedSegment key={business.id} spacing={3}><Business business={business} /></SpacedSegment>
          ))}
        </Segment>
      </Container>
    );
  }

}

export default withAuth(Businesses);