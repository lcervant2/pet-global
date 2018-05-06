import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './ReviewList.scss';

import Panel from '../UI/Panel/Panel';
import List from '../UI/List/List';
import ListItem from '../UI/List/Item/Item';
import Review from '../Review/Review';

const ReviewList = ({ className, reviews }) => {
  const inputClass = classNames('review-list', className);

  return (
    <div className={inputClass}>
      <List>
        {reviews.map(review => (
          <ListItem key={review.id}>
            <Review review={review} showBusiness={false} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.array
};

ReviewList.defaultProps = {
  reviews: []
};

export default ReviewList;