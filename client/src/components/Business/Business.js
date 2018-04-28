import React, { Component } from 'react';
import {
  Segment,
  Grid,
  Header,
  Icon,
  Rating,
  Divider,
  Statistic
} from 'semantic-ui-react';
import {Link} from "react-router-dom";

import defaultBusinessImage from '../../images/business_default.png';

import SpacedSegment from '../SpacedSegment';
import SquareImage from '../SquareImage';

class Business extends Component {

  render() {
    const { business } = this.props;

    return (
      <Segment padded>

        <Grid verticalAlign='middle'>

          <Grid.Row>

            <Grid.Column width={3}>
              <Link to={'/businesses/' + business.id}>
                <SquareImage src={business.images.length > 0 ? business.images[0].url : defaultBusinessImage} />
              </Link>
            </Grid.Column>

            <Grid.Column width={10}>
              <SpacedSegment spacing={1}>
                <Header size='large' as={Link} to={'/businesses/' + business.id}>
                  {business.name}
                </Header>
              </SpacedSegment>
              <SpacedSegment style={{ color: '#555' }}>
                {business.distance !== undefined &&
                <span>
                  {Math.round(business.distance * 10) / 10} mi
                  <Icon name='circle' style={{
                    position: 'relative',
                    top: '-3px',
                    marginLeft: '8px',
                    marginRight: '8px',
                    color: '#555',
                    fontSize: '4px'
                  }}
                  />
                </span>
                }
                {business.formattedAddress}
              </SpacedSegment>
              <p>{business.description}</p>
            </Grid.Column>

            <Grid.Column width={3}>
              {business.averageRating > 0
                ? (
                  <Segment basic padded vertical textAlign='center'>
                    <Rating icon='star' defaultRating={Math.round(business.averageRating)} maxRating={5} size='huge' disabled color='yellow' />
                    <Divider horizontal>FROM</Divider>
                    <Statistic style={{ margin: 0 }} value={business.totalReviews} label='reviews' size='small' />
                  </Segment>
                )
                : (
                  <Segment basic padded vertical textAlign='center'>
                    <Header size='medium'>No Reviews</Header>
                  </Segment>
                )
              }
            </Grid.Column>

          </Grid.Row>

        </Grid>

      </Segment>
    );
  }

}

export default Business;