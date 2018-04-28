import React, { Component } from 'react';
import {
  Container,
  Grid,
  Header,
  Segment,
  Statistic,
  Sticky,
  Divider,
  Menu,
  Rating
} from 'semantic-ui-react';
import './Profile.css';

import defaultProfilePicture from '../../images/profile_default.png';

import APIService from '../../services/APIService';

import SpacedSegment from '../../components/SpacedSegment';
import SquareImage from '../../components/SquareImage';
import Review from '../../components/Review';

import { withAuth } from '../../helpers/withAuth';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.loadUser = this.loadUser.bind(this);
    this.loadReviews = this.loadReviews.bind(this);
    this.handleSideMenuClick = this.handleSideMenuClick.bind(this);
    this.handleContextRef = this.handleContextRef.bind(this);

    this.stickyRef = React.createRef();
    this.profileOverviewRef = React.createRef();
    this.reviewsRef = React.createRef();

    this.state = {
      isLoading: true,
      user: null,
      isCurrentUser: false,
      activeItem: 'overview',
      isLoadingReviews: true,
      reviews: []
    };
  }

  componentWillMount() {
    this.loadUser(this.props.match.params.username);
  }

  componentWillReceiveProps(newProps) {
    this.loadUser(newProps.match.params.username);
  }

  loadUser(username) {
    this.setState({
      isLoading: true
    });

    let request;
    if (this.props.currentUser.username === username)
      request = APIService.shared().requestAccount();
    else
      request = APIService.shared().requestUser(username);

    request
      .then(response => {
        this.setState({
          isLoading: false,
          user: response,
          isCurrentUser: this.props.currentUser.username === username
        });

        this.loadReviews(response.id);
      });
  }

  loadReviews(id) {
    this.setState({
      isLoadingReviews: true,
      reviews: []
    });

    APIService.shared().requestUserReviews(id)
      .then(response => {
        this.setState({
          isLoadingReviews: false,
          reviews: response
        });
      });
  }

  handleSideMenuClick(e, { name }) {
    this.setState({
      activeItem: name
    });

    if (name === 'overview')
      this.profileOverviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (name === 'reviews')
      this.reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  handleContextRef(contextRef) {
    this.setState({
      [contextRef.name]: contextRef
    });
  }

  render() {
    const { isLoading, user, activeItem, isLoadingReviews, reviews } = this.state;

    return (
      <Container>
        <Segment loading={isLoading} basic>
          {user &&
            <div ref={this.profileOverviewRef}>
              <Grid>
                <Grid.Row>

                  <Grid.Column width={4}>
                    <Sticky context={this.stickyRef.current} offset={24}>
                      <SpacedSegment spacing={4}>
                        <SquareImage src={user.profilePicture || defaultProfilePicture} alt='Profile Picture' />
                      </SpacedSegment>
                      <SpacedSegment spacing={3}><Header size='medium'>{user.firstName} {user.lastName}</Header></SpacedSegment>
                      <Menu secondary vertical>
                        <Menu.Item name='overview' content='Profile Overview' active={activeItem === 'overview'} onClick={this.handleSideMenuClick} />
                        <Menu.Item name='reviews' active={activeItem === 'reviews'} onClick={this.handleSideMenuClick} />
                      </Menu>
                    </Sticky>
                  </Grid.Column>

                  <Grid.Column width={12}>

                    <div ref={this.stickyRef}>

                      <Grid padded>
                        <Grid.Row>
                          <Grid.Column largeScreen={11} computer={10} tablet={8} mobile={16}>

                            <SpacedSegment spacing={3}><Header size='huge'>{user.firstName} {user.lastName}</Header></SpacedSegment>
                            <SpacedSegment className='profile-details'>
                              {user.address.city}, {user.address.state}
                            </SpacedSegment>
                            <SpacedSegment className='profile-bio'>
                              {user.bio}
                            </SpacedSegment>

                          </Grid.Column>
                          <Grid.Column largeScreen={5} computer={6} tablet={8} mobile={16}>
                            <Segment padded textAlign='center'>
                              <SpacedSegment spacing={0}><Statistic style={{ margin: 0 }} value={user.totalReviews} label='reviews' size='tiny' /></SpacedSegment>
                              <SpacedSegment spacing={0}>
                                <Statistic style={{ margin: 0 }}>
                                  <Statistic.Value>
                                    <Rating
                                      size='huge' icon='star' color='yellow' disabled
                                      defaultRating={Math.round(user.averageRating)} maxRating={5}  />
                                  </Statistic.Value>
                                  <Statistic.Label>average review</Statistic.Label>
                                </Statistic>
                              </SpacedSegment>
                            </Segment>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>

                      <Divider section />

                      <div ref={this.reviewsRef}>

                        <Segment basic loading={isLoadingReviews}>
                          {reviews.length > 0 && <SpacedSegment spacing={4}><Header size='huge'>Reviews</Header></SpacedSegment>}
                          {!reviews.length && !isLoadingReviews && <Header textAlign='center' size='medium'>No reviews</Header>}
                          {reviews.map(review => (
                            <SpacedSegment key={review.id}><Review review={review} showBusiness /></SpacedSegment>
                          ))}
                        </Segment>

                      </div>

                    </div>

                  </Grid.Column>

                </Grid.Row>
              </Grid>
            </div>
          }
        </Segment>
      </Container>
    );
  }

}

export default withAuth(Profile);