import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Segment,
  Header,
  Divider,
  Rating,
  Button,
  Statistic,
  Label,
  Sticky,
  Icon
} from 'semantic-ui-react';
import './Business.css';

import { formatNumber } from 'libphonenumber-js';

import queryString from 'query-string';

import defaultBusinessImage from '../../images/business_default.png';

import SpacedSegment from '../../components/SpacedSegment';
import SquareImage from '../../components/SquareImage';
import Review from '../../components/Review';

import APIService from '../../services/APIService';

import { withAuth } from '../../helpers/withAuth';

import SERVICE_CATEGORIES from '../../helpers/serviceCategories';

class Business extends Component {

  constructor(props) {
    super(props);

    this.loadBusiness = this.loadBusiness.bind(this);
    this.loadReviews = this.loadReviews.bind(this);

    this.handleContextRef = this.handleContextRef.bind(this);

    this.deleteBusiness = this.deleteBusiness.bind(this);

    this.serviceCategories = _.keyBy(SERVICE_CATEGORIES, category => category.value);

    this.state = {
      isLoading: true,
      business: null,
      isLoadingReviews: true,
      reviews: [],
      contextRef: null,
      isDeletingBusiness: false,
      directionsUrl: '#'
    };
  }

  componentWillMount() {
    this.loadBusiness(this.props.match.params.id);
  }

  componentWillReceiveProps(newProps) {
    this.loadBusiness(newProps.match.params.id);
  }

  loadBusiness(id) {
    this.setState({
      isLoading: true
    });

    APIService.shared().requestBusiness(id)
      .then(response => {
        this.setState({
          isLoading: false,
          business: response,
          directionsUrl: 'https://www.google.com/maps/dir/?api=1&' + queryString.stringify({ destination: response.formattedAddress })
        });

        this.loadReviews(id);
      });
  }

  loadReviews(id) {
    this.setState({
      isLoadingReviews: true,
      reviews: []
    });

    APIService.shared().requestBusinessReviews(id)
      .then(response => {
        this.setState({
          isLoadingReviews: false,
          reviews: response
        });
      });
  }

  handleContextRef(contextRef) {
    this.setState({
      contextRef: contextRef
    });
  }

  deleteBusiness(e) {
    e.preventDefault();

    this.setState({
      isDeletingBusiness: true
    });

    APIService.shared().deleteBusiness(this.state.business.id)
      .then(response => {
        if (this.props.history.canGoBack)
          this.props.history.goBack();
        else
          this.props.history.push('/businesses');
      });
  }

  render() {
    const { isLoading, business, isLoadingReviews, reviews, contextRef, isDeletingBusiness, directionsUrl } = this.state;
    const { isLoggedIn, currentUser } = this.props;

    return (
      <Container>
        <Segment loading={isLoading} basic>
          {business &&
            <Grid>
              <Grid.Row>

                <Grid.Column width={4}>

                  <Sticky context={contextRef} offset={24}>
                    <SpacedSegment spacing={4}>
                      <SquareImage src={business.images.length > 0 ? business.images[0].url : defaultBusinessImage} />
                    </SpacedSegment>
                    <SpacedSegment spacing={3}><Header size='large'>{business.name}</Header></SpacedSegment>
                    {isLoggedIn &&
                      <SpacedSegment>
                        <Button
                          as={Link}
                          to={'/businesses/' + business.id + '/review'}
                          icon='write' content='Write a Review' primary fluid />
                      </SpacedSegment>
                    }
                    {!!business.email && <SpacedSegment><Button as='a' href={'mailto:' + business.email} target='_top' icon='mail' content='Contact' fluid /></SpacedSegment>}
                    <SpacedSegment><Button as='a' href={directionsUrl} target='_blank' icon='map' content='Get Directions' fluid /></SpacedSegment>
                    {currentUser && currentUser.id === business.user &&
                    <SpacedSegment><Button icon='trash' content='Delete Business' color='red' fluid onClick={this.deleteBusiness} loading={isDeletingBusiness} /></SpacedSegment>
                    }
                  </Sticky>

                </Grid.Column>

                <Grid.Column width={12}>

                  <div ref={this.handleContextRef}>

                    <Grid padded>
                      <Grid.Row>
                        <Grid.Column largeScreen={11} computer={10} tablet={8} mobile={16}>
                          <SpacedSegment spacing={3}><Header size='huge'>{business.name}</Header></SpacedSegment>
                          <SpacedSegment spacing={3} className='business-details'>
                            <SpacedSegment spacing={1}><Icon name='map' /> {business.formattedAddress}</SpacedSegment>
                            {business.email &&
                            <SpacedSegment spacing={1}><Icon name='mail' /> {business.email}</SpacedSegment>
                            }
                            {business.phoneNumber &&
                            <SpacedSegment spacing={1}><Icon name='phone' /> {formatNumber(business.phoneNumber, 'US', 'National')}</SpacedSegment>
                            }
                            {business.website &&
                            <SpacedSegment spacing={1}>
                              <Icon name='globe' />&nbsp;
                              <a
                                target='_blank'
                                href={(business.website.startsWith('http://') ? '' : 'http://') + business.website}>
                                {business.website}&nbsp;&nbsp;
                                <Icon name='external' size='small' style={{ position: 'relative', top: '-1px' }} />
                              </a>
                            </SpacedSegment>
                            }
                          </SpacedSegment>
                          <SpacedSegment spacing={4} className='business-description'>{business.description}</SpacedSegment>
                          <SpacedSegment className='business-tags'>
                            {business.serviceCategories.map(category => (
                              <Label key={category} as={Link} to={'/services/' + category} className='business-tag'
                                  content={this.serviceCategories[category].name} icon={this.serviceCategories[category].icon}
                              />
                            ))}
                          </SpacedSegment>
                        </Grid.Column>
                        <Grid.Column largeScreen={5} computer={6} tablet={8} mobile={16}>
                          {business.averageRating > 0
                            ? (
                              <Segment padded textAlign='center'>
                                <Rating
                                  size='huge' icon='star' color='yellow' disabled
                                  defaultRating={Math.round(business.averageRating)} maxRating={5}  />
                                <Divider horizontal>FROM</Divider>
                                <Statistic style={{ margin: 0 }} value={business.totalReviews} label='reviews' />
                              </Segment>
                            )
                            : (
                              <Segment padded compact floated='right' textAlign='center'>
                                <Header size='large'>No Reviews</Header>
                              </Segment>
                            )
                          }
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>

                    <Divider section />

                    <Segment basic loading={isLoadingReviews}>
                      {reviews.length > 0 && <SpacedSegment spacing={4}><Header size='huge'>Reviews</Header></SpacedSegment>}
                      {!reviews.length && !isLoadingReviews && <Header textAlign='center' size='medium'>No reviews</Header>}
                      {reviews.map(review => (
                        <SpacedSegment key={review.id}><Review review={review} /></SpacedSegment>
                      ))}
                    </Segment>

                  </div>

                </Grid.Column>
              </Grid.Row>
            </Grid>
          }
        </Segment>
      </Container>
    );
  }

}

export default withAuth(Business);