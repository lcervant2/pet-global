import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import BusinessList from '../../components/BusinessList/BusinessList';

import APIService from '../../services/APIService';

import { withAuth } from '../../helpers/withAuth';

class Businesses extends Component {

  constructor(props) {
    super(props);

    this.loadBusinesses = this.loadBusinesses.bind(this);

    this.state = {
      isLoading: true,
      businesses: []
    };
  }

  componentWillMount() {
    if (this.props.isLoggedIn)
      this.loadBusinesses(this.props.currentUser.id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isLoggedIn)
      this.loadBusinesses(newProps.currentUser.id);
  }

  loadBusinesses(id) {
    this.setState({
      isLoading: true,
      businesses: []
    });

    APIService.shared().requestUserBusinesses(id)
      .then(response => {
        this.setState({
          isLoading: false,
          businesses: response
        });
      });
  }

  render() {
    const { isLoading, businesses } = this.state;

    return (
      <BusinessList businesses={businesses} />
    );
  }

}

export default withAuth(Businesses);