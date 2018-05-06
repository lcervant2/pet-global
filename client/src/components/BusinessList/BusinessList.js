import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './BusinessList.scss';

import List from '../UI/List/List';
import ListItem from '../UI/List/Item/Item';
import Business from '../Business/Business';

const BusinessList = ({ className, businesses }) => {
  const inputClass = classNames('business-list', className);
  const businessClass = classNames('business-list__business');

  return (
    <div className={inputClass}>
      <List>
        {businesses.map(business => (
          <ListItem key={business.id} className={businessClass}>
            <Business business={business} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

BusinessList.propTypes = {
  businesses: PropTypes.array
};

BusinessList.defaultProps = {
  businesses: []
};

export default BusinessList;