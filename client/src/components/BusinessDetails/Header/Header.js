import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Header.scss';

import Icon from '../../UI/Icon/Icon';
import Rating from '../../UI/Rating/Rating';
import Divider from '../../UI/Divider/Divider';
import Panel from '../../UI/Panel/Panel';
import Button from '../../UI/Button/Button';

import { formatNumber } from 'libphonenumber-js';

import { withAuth } from '../../../helpers/withAuth';

const BusinessDetailsHeader = ({ className, business, currentUser }) => {
  const inputClass = classNames('business-details__header', className);

  const infoClass = classNames('business-details__header__info');
  const descClass = classNames('business-details__header__desc');
  const ratingClass = classNames('business-details__header__rating');

  return (
    <div className={inputClass}>
      <div>
        <h1>{business.name}</h1>
        {/*<div className={infoClass}>*/}
          {/*<div><Icon name='building' /> {business.formattedAddress}</div>*/}
          {/*{business.email && <div><Icon name='envelope' /> {business.email}</div>}*/}
          {/*{business.phoneNumber && <div><Icon name='phone' /> {formatNumber(business.phoneNumber, 'US', 'National')}</div>}*/}
          {/*{business.website && <div><Icon name='globe' /> <a target='_blank' href={business.website.startsWith('http') ? business.website : 'http://' + business.website}>{business.website}</a></div>}*/}
        {/*</div>*/}
        <div className={descClass}>{business.description}</div>
        {currentUser.id === business.user &&
          <div className='business-details__header__user-options'>
            <Link to={'/businesses/' + business.id + '/edit'}><Button icon='edit'>Edit</Button></Link>
          </div>
        }
      </div>
      <div className={ratingClass}>
        {business.totalReviews > 0 ? (
          <Panel>
            <Rating rating={business.averageRating} maxRating={5} icon='star' />
            <Divider content='FROM' />
            {business.totalReviews} Reviews
          </Panel>
        ) : (
          <Panel>
            No Reviews
          </Panel>
        )}

        <Link to={'/businesses/' + business.id + '/review'}><Button primary block icon='pencil-alt'>Write a Review</Button></Link>
      </div>
    </div>
  );
};

BusinessDetailsHeader.propTypes = {
  business: PropTypes.object
};

BusinessDetailsHeader.defaultProps = {
  business: {}
};

export default withAuth(BusinessDetailsHeader);