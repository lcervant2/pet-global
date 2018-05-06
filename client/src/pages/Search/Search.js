import _ from 'lodash';
import React, { Component } from 'react';
import './Search.scss';

import BusinessList from '../../components/BusinessList/BusinessList';
import Form from '../../components/UI/Form/Form';
import Input from '../../components/UI/Input/Input';
import Rating from '../../components/UI/Rating/Rating';
import BusinessMap from '../../components/BusinessMap/BusinessMap';
import Loader from '../../components/UI/Loader/Loader';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/UI/Button/Button';

import { geolocated } from 'react-geolocated';
import qs from 'qs';

import APIService from '../../services/APIService';

import serviceCategories from '../../helpers/serviceCategories';

import { withAuth } from '../../helpers/withAuth';

class Search extends Component {

  constructor(props) {
    super(props);

    this.serviceCategories = _.map(serviceCategories, category => ({ key: category.value, value: category.value, text: category.name }));
    this.ratingFilters = [
      { key: '0', value: null, text: 'None' },
      { key: '1', value: '1', text: '1' },
      { key: '2', value: '2', text: '2' },
      { key: '3', value: '3', text: '3' },
      { key: '4', value: '4', text: '4' },
      { key: '5', value: '5', text: '5' }
    ];

    this.updateMapTop = this.updateMapTop.bind(this);
    this.updateLocations = this.updateLocations.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      query: '',
      serviceCategories: [],
      minimumRating: null,
      isLoading: false,
      results: [],
      message: null,
      location: null,
      locations: [],
      geolocationFinished: false,
      queryHeight: 0,
      mapTop: 0
    };
  }

  componentWillMount() {
    this.updateLocations(this.props, true);

    // parse query string
    const query = qs.parse(this.props.location.search.slice(1), { arrayFormat: 'index' });
    this.setState(query);
  }

  componentDidMount() {
    this.updateMapTop(this.props.headerHeight);

    // run initial search if query is present
    if (this.props.location.search.length)
      this.handleSubmit();
  }

  componentWillReceiveProps(newProps) {
    this.updateMapTop(newProps.headerHeight);
    this.updateLocations(newProps);
  }

  updateMapTop(headerHeight) {
    this.setState({
      mapTop: headerHeight + this.queryNode.getBoundingClientRect().height
    });
  }

  updateLocations(props, initialUpdate = false) {
    let locations = [
      { key: 'none', value: null, text: 'None' }
    ];
    let setDefault = false;

    if (props.currentUser) {
      locations.push({
        key: 'user',
        value: props.currentUser.location.latitude + ',' + props.currentUser.location.longitude,
        text: props.currentUser.address.address1 + ', ' + props.currentUser.address.city + ', ' + props.currentUser.address.state
      });
    } else if (props.isGeolocationEnabled && props.coords) {
      locations.push({
        key: 'browser',
        value: props.coords.latitude + ',' + props.coords.longitude,
        text: 'Current Location'
      });

      if (!this.state.geolocationFinished) {
        this.setState({
          geolocationFinished: true
        });
        setDefault = true;
      }
    }

    this.setState({
      locations: locations,
      location: (initialUpdate || setDefault) ? locations[locations.length - 1].value : this.state.location
    });
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    if (e)
      e.preventDefault();

    const query = qs.stringify({
      query: this.state.query,
      serviceCategories: this.state.serviceCategories,
      minimumRating: this.state.minimumRating,
      location: this.state.location
    }, { arrayFormat: 'index' });
    this.props.history.push('/search?' + query);

    console.log(this.state);

    this.setState({
      isLoading: true,
      results: []
    });

    APIService.shared().requestSearch({
      query: this.state.query,
      serviceCategories: this.state.serviceCategories,
      minimumRating: this.state.minimumRating,
      location: this.state.location
    })
      .then(response => {
        this.setState({
          isLoading: false,
          results: response.slice(0, 20),
          message: !response.length ? 'No results' : null
        });
      });
  }

  render() {
    const { query, serviceCategories, minimumRating, isLoading, results, message, locations, location, mapTop } = this.state;
    const { headerHeight } = this.props;

    return (
      <div className='search-page'>

        <div ref={node => this.queryNode = node} className='search-page__query' style={{ top: headerHeight + 'px' }}>
          <Form onSubmit={this.handleSubmit}>
            <Input type='text' value={query} name='query' placeholder='Search...' onChange={this.handleChange} action={<Button type='button' secondary onClick={this.handleSubmit}>Search</Button>} icon='search' />
          </Form>
        </div>

        {isLoading && <Loader />}
        <div>
          {!isLoading && message &&
            <div className='search-page__message'>
              {message}
            </div>
          }
          {!isLoading && !message && <BusinessList businesses={results} />}
          <Footer />
        </div>
        {!isLoading && <BusinessMap businesses={results} style={{ top: mapTop + 'px', width: '100%', height: (window.innerHeight - mapTop) + 'px' }} />}


      </div>
    );
  }

}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(withAuth(Search));

