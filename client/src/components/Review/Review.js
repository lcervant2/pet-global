import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Segment,
  Rating,
  Image,
  Label,
  Button,
  Header
} from 'semantic-ui-react';
import './Review.css';

import defaultProfilePicture from '../../images/profile_default.png';
import defaultBusinessPicture from '../../images/business_default.png';

import SpacedSegment from '../SpacedSegment';
import SquareImage from '../SquareImage';

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
    const { review, currentUser, isLoggedIn, showBusiness } = this.props;

    return (
      <Segment padded>

        {isLoggedIn && currentUser.id === review.user.id &&
          <Button size='mini' floated='right' color='red' content='Delete' onClick={this.deleteReview} loading={isDeletingReview} />
        }

        <SpacedSegment spacing={0}>
          <Rating
            color='yellow' disabled size='huge' icon='star'
            defaultRating={review.overallRating} maxRating={5}
            style={{ display: 'inline-block', marginRight: '0.6em' }}
          />
          <Link
            to={'/profile/' + review.user.username}
            style={{ display: 'inline-block', padding: 0, margin: 0, position: 'relative', bottom: '0.4em', color: 'inherit' }}>
            <strong>
              <Image avatar size='mini' src={review.user.profilePicture || defaultProfilePicture} alt=''
                     style={{ width: '24px', height: '24px', marginRight: '8px' }} />
              <span style={{ position: 'relative', top: '1px' }} >{review.user.firstName} {review.user.lastName}</span>
            </strong>
          </Link>
        </SpacedSegment>

        <SpacedSegment spacing={3}>
          <small>Visited on {formatDate(review.date)}</small>
        </SpacedSegment>

        {showBusiness &&
        <SpacedSegment spacing={4}>
          <Link to={'/businesses/' + review.business.id}>
            <SquareImage src={review.business.images.length ? review.business.images[0].url : defaultBusinessPicture}
                         style={{ display: 'inline-block', width: '32px', height: '32px', verticalAlign: 'middle', marginRight: '8px' }} />
            <div style={{ display: 'inline-block', lineHeight: '32px', position: 'relative', top: '2px' }}>
              <Header size='small' style={{ margin: 0, padding: 0 }}>{review.business.name}</Header>
            </div>
          </Link>
        </SpacedSegment>
        }

        <SpacedSegment spacing={3}>
          <strong>Price: </strong>
          <Rating size='small' disabled defaultRating={review.priceRating} maxRating={5} />
          <br />

          <strong>Customer Service: </strong>
          <Rating size='small' disabled defaultRating={review.customerServiceRating} maxRating={5} />
          <br />

          <strong>Quality: </strong>
          <Rating size='small' disabled defaultRating={review.qualityRating} maxRating={5} />
        </SpacedSegment>

        <SpacedSegment spacing={(review.transactionOccured || review.repeatCustomer) ? 4 : 0}>
          {review.description}
        </SpacedSegment>

        {(review.transactionOccured || review.repeatCustomer) &&
          <SpacedSegment spacing={0}>
            {review.transactionOccurred && <Label icon='dollar' content='Money Spent' />}
            {review.transactionOccurred && <span>&nbsp;&nbsp;&nbsp;</span>}
            {review.repeatCustomer && <Label icon='repeat' content='Would Return' />}
          </SpacedSegment>
        }

      </Segment>
    );
  }

}

Review.defaultProps = {
  showBusiness: false
};

export default withRouter(withAuth(Review));