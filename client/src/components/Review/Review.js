import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Review.scss';

import defaultProfilePicture from '../../images/profile_default.png';
import defaultBusinessPicture from '../../images/business_default.png';

import Image from '../UI/Image/Image';
import ImageSquare from '../UI/Image/Square/Square';
import Button from '../UI/Button/Button';
import Rating from '../UI/Rating/Rating';

import APIService from '../../services/APIService';

import formatDate from "../../helpers/formatDate";
import { withAuth } from '../../helpers/withAuth';

class Review extends Component {

  constructor(props) {
    super(props);

    this.deleteReview = this.deleteReview.bind(this);

    this.state = {
      isDeletingReview: false
    };
  }

  deleteReview(e) {
    e.preventDefault();

    this.setState({
      isDeletingReview: true
    });

    APIService.shared().deleteReview(this.props.review.id)
      .then(response => {
        this.props.history.push(this.props.location.pathname);
      });
  }

  render() {
    const { isDeletingReview } = this.state;
    const { className, review, currentUser, isLoggedIn, showBusiness } = this.props;

    const inputClass = classNames('review', className);

    return (
      <div className={inputClass}>

        {isLoggedIn && currentUser.id === review.user.id &&
          <div className='review__options'>
            <Link to={'/reviews/' + review.id + '/edit'}><Button block>Edit</Button></Link>
            <Button block onClick={this.deleteReview} loading={isDeletingReview}>Delete</Button>
          </div>
        }

        <div className='review__rating'>
          <Rating icon='star' rating={review.overallRating} maxRating={5} />
          <Link to={'/profile/' + review.user.username}>
            <strong>
              <Image avatar src={review.user.profilePicture || defaultProfilePicture} />
              {review.user.firstName} {review.user.lastName}
            </strong>
          </Link>
        </div>

        <div className='review__date'>
          <small>Visited on {formatDate(review.date)}</small>
        </div>

        {showBusiness &&
        <div className='review__business'>
          <Link to={'/businesses/' + review.business.id}>
            <ImageSquare src={review.business.images.length ? review.business.images[0].url : defaultBusinessPicture} />
            {review.business.name}
          </Link>
        </div>
        }

        <div className='review__ratings'>
          <strong>Price: </strong>
          <Rating rating={review.priceRating} maxRating={5} dark />
          <br />

          <strong>Customer Service: </strong>
          <Rating rating={review.customerServiceRating} maxRating={5} dark />
          <br />

          <strong>Quality: </strong>
          <Rating rating={review.qualityRating} maxRating={5} dark />
        </div>

        <div className='rating__description'>
          {review.description}
        </div>

      </div>
    );
  }

}

Review.propTypes = {
  showBusiness: PropTypes.bool,
  review: PropTypes.object
};

Review.defaultProps = {
  showBusiness: false
};

export default withRouter(withAuth(Review));