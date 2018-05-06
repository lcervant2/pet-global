import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Business.scss';

import ImageSquare from '../UI/Image/Square/Square';
import Rating from '../UI/Rating/Rating';
import Divider from '../UI/Divider/Divider';
import VerticalCenter from '../UI/VerticalCenter/VerticalCenter';

import defaultBusinessPicture from '../../images/business_default.png';

const Business = ({ className, business }) => {
  const inputClass = classNames('business', className);
  const containerClass = classNames('business__container');
  const addressClass = classNames('business__container__address');
  const descriptionClass = classNames('business__container__description');
  const ratingContainerClass = classNames('business__container__rating-container');
  const ratingClass = classNames('business__container__rating-container__rating');

  return (
    <div className={inputClass}>
      <div className={containerClass}>
        <Link to={'/businesses/' + business.id}>
          <ImageSquare src={business.images.length > 0 ? business.images[0].url : defaultBusinessPicture} />
        </Link>
        <div>
          <Link to={'/businesses/' + business.id}><h2>{business.name}</h2></Link>
          <div className={addressClass}>
            {business.distance !== undefined && <span>{Math.round(business.distance * 10) / 10} mi - </span>}
            {business.address.address1}, {business.address.city}
          </div>
          <div className={descriptionClass}>{business.description}</div>
        </div>
        <VerticalCenter>
          {business.totalReviews ? (
            <div className={ratingContainerClass}>
              <Rating rating={business.averageRating} maxRating={5} icon='star' className={ratingClass} />
              <Divider content='FROM' />
              <div>{business.totalReviews} reviews</div>
            </div>
          ) : (
            <div className={ratingContainerClass}>
              <div>No reviews</div>
            </div>
          )}
        </VerticalCenter>
      </div>
    </div>
  );
};

Business.propTypes = {
  business: PropTypes.object
};

export default Business;