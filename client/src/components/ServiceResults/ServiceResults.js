import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ServiceResults.scss';

import BusinessList from '../BusinessList/BusinessList';
import Icon from '../UI/Icon/Icon';
import Loader from '../UI/Loader/Loader';
import BusinessMap from '../BusinessMap/BusinessMap';

import APIService from '../../services/APIService';

import { capitalize } from '../../helpers/capitalize';

class ServiceResults extends Component {

  constructor(props) {
    super(props);

    this.icons = {
      'retail': 'shopping-basket',
      'grooming': 'shower',
      'training': 'star',
      'caretaker': 'male',
      'hotels_and_spas': 'plane',
      'insurance': 'money-bill-alt',
      'relocation': 'truck',
      'veterinary': 'user-md',
      'emergency': 'hospital'
    };

    this.loadBusinesses = this.loadBusinesses.bind(this);

    this.state = {
      businesses: [],
      isLoading: true
    };
  }

  componentWillMount() {
    this.loadBusinesses(this.props.serviceName);
  }

  componentWillReceiveProps(newProps) {
    this.loadBusinesses(newProps.serviceName);
  }

  loadBusinesses(serviceName) {
    this.setState({
      isLoading: true
    });

    APIService.shared().requestSearch({ serviceCategories: [serviceName] })
      .then(response => {
        this.setState({
          isLoading: false,
          error: null,
          businesses: response
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          businesses: [],
          error: {
            title: 'An unknown error occurred.',
            content: 'Please try again later.'
          }
        });
      });
  }

  render() {
    const { isLoading, businesses } = this.state;
    const { className, serviceName } = this.props;

    const inputClass = classNames('service-results', className);
    const headerClass = classNames('service-results__header');

    return (
      <div className={inputClass}>
        {isLoading && <Loader />}
        {!isLoading && <BusinessList businesses={businesses} />}
        {!isLoading && <BusinessMap />}
      </div>
    );
  }

}

ServiceResults.propTypes = {
  serviceName: PropTypes.string
};

ServiceResults.defaultProps = {
  serviceName: 'retail'
};

export default ServiceResults;