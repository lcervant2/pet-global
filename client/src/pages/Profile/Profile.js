import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Profile.scss';

import Container from '../../components/UI/Container/Container';
import Panel from '../../components/UI/Panel/Panel';
import ImageSquare from '../../components/UI/Image/Square/Square';
import Button from '../../components/UI/Button/Button';
import Loader from '../../components/UI/Loader/Loader';
import ReviewList from '../../components/ReviewList/ReviewList';
import Rating from '../../components/UI/Rating/Rating';

import defaultProfilePicture from '../../images/profile_default.png';

import APIService from '../../services/APIService';

import { withAuth } from '../../helpers/withAuth';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.loadUser = this.loadUser.bind(this);
    this.loadReviews = this.loadReviews.bind(this);

    this.state = {
      isLoading: true,
      user: null,
      isCurrentUser: false,
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

  render() {
    const { isLoading, user, isLoadingReviews, reviews } = this.state;

    return (
      <div className='profile-page'>
        <Container>

          {isLoading ? (
            <Loader />
          ) : (
            <div className="profile-page__main">

              <div>

                <Panel padded>
                  <div className='profile-page__main__header'>
                    <div>
                      <ImageSquare src={user.profilePicture || defaultProfilePicture} />
                    </div>
                    <div className='profile-page__main__header__details'>
                      <h1>{user.firstName} {user.lastName}</h1>
                      <p>{user.address.city}, {user.address.state}</p>
                      <p>{user.bio}</p>
                    </div>
                  </div>
                </Panel>

                {isLoadingReviews ? (
                  <Panel padded className='profile-page__main__reviews'>
                    <Loader />
                  </Panel>
                ) : (
                  <Panel noPadding className='profile-page__main__reviews'>
                    <ReviewList reviews={reviews} />
                  </Panel>
                )}

              </div>

              <div>
                <div className='profile-page__main__stat'>
                  <Panel padded>
                    <Rating rating={user.averageRating} maxRating={5} icon='star' />
                    <h3>Average Rating</h3>
                  </Panel>
                </div>
                <div className='profile-page__main__stat'>
                  <Panel padded>
                    {user.totalReviews}
                    <h3>Reviews</h3>
                  </Panel>
                </div>
              </div>

            </div>
          )}

        </Container>
      </div>
    );
  }

}

export default withAuth(Profile);