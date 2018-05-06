import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Directions.scss';

import qs from 'qs';

import GoogleMapReact from 'google-map-react';

import { formatNumber } from 'libphonenumber-js';

import Panel from '../../UI/Panel/Panel';
import Icon from '../../UI/Icon/Icon';
import Button from '../../UI/Button/Button';

const AnyReactComponent = () => <Icon name='map-marker-alt' className='business-details__directions__map__marker' />;

const BusinessDetailsDirections = ({ className, business }) => {
  const inputClass = classNames('business-details__directions', className);

  return (
    <div className={inputClass}>
      <Panel>
        <div className='business-details__directions__map'>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDx5HMdGrzVDuRmg4jSLe6NG2ERWCuhAkw' }}
            defaultCenter={{ lat: business.location.latitude, lng: business.location.longitude }}
            defaultZoom={16}
          >
            <AnyReactComponent
              lat={business.location.latitude}
              lng={business.location.longitude}
              text={business.name}
            />
          </GoogleMapReact>
        </div>
        <table>
          <tbody>
            <tr>
              <td><Icon name='map-marker-alt' /></td>
              <td className='business-details__directions__address'>
                {business.address.address1}<br />
                {business.address.address2 && <span>{business.address.address2}<br /></span>}
                {business.address.city}, {business.address.state} {business.address.zipCode}
              </td>
            </tr>
            {business.phoneNumber && <tr>
              <td><Icon name='phone' /></td>
              <td>{formatNumber(business.phoneNumber, 'US', 'National')}</td>
            </tr>}
            {business.email && <tr>
              <td><Icon name='envelope' /></td>
              <td>{business.email}</td>
            </tr>}
            {business.website && <tr>
              <td><Icon name='globe' /></td>
              <td><a target='_blank' href={business.website.startsWith('http') ? business.website : 'http://' + business.website}>{business.website}</a></td>
            </tr>}
          </tbody>
        </table>
        <a target='_blank' href={'https://www.google.com/maps/dir/?api=1&' + qs.stringify({ destination: business.formattedAddress })}><Button icon='map' block>Get Directions</Button></a>
        <a href={'mailto://' + business.email}><Button icon='envelope' block>Contact</Button></a>
      </Panel>
    </div>
  );
};

BusinessDetailsDirections.propTypes = {
  business: PropTypes.object
};

BusinessDetailsDirections.defaultProps = {
  business: {}
};

export default BusinessDetailsDirections;