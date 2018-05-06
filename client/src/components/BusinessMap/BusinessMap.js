import React, { Component } from 'react';
import classNames from 'classnames';
import './BusinessMap.scss';

import GoogleMapReact from 'google-map-react';

import Loader from '../UI/Loader/Loader';
import Icon from '../UI/Icon/Icon';

const BusinessMarker = () => <Icon name='map-marker-alt' className='business-map__marker' />;

class BusinessMap extends Component {

  constructor(props) {
    super(props);

    this.calculateCenter = this.calculateCenter.bind(this);

    this.state = {
      center: {
        lat: 38.852306,
        lng: -77.3368575
      }
    };
  }

  componentWillMount() {
    this.calculateCenter(this.props.businesses);
  }

  componentWillReceiveProps(newProps) {
    this.calculateCenter(newProps.businesses);
  }

  calculateCenter(businesses) {
    if (businesses && businesses.length > 0) {
      let lat = 0;
      let lng = 0;
      businesses.forEach(business => {
        lat += business.location.latitude;
        lng += business.location.longitude;
      });
      this.setState({
        center: {
          lat: lat / businesses.length,
          lng: lng / businesses.length
        }
      });
    }
  }

  render() {
    const { center } = this.state;
    const { className, style, businesses } = this.props;

    const inputClass = classNames('business-map', className);

    return (
      <div className={inputClass} style={style}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDx5HMdGrzVDuRmg4jSLe6NG2ERWCuhAkw' }}
          defaultCenter={center}
          defaultZoom={12}
        >
          {businesses.map(business => (
            <BusinessMarker
              key={business.id}
              lat={business.location.latitude}
              lng={business.location.longitude}
            />
          ))}
        </GoogleMapReact>
      </div>
    );
  }

}

export default BusinessMap;