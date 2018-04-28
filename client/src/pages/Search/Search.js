import _ from 'lodash';
import React, { Component } from 'react';
import {
  Container,
  Form,
  Input,
  Button,
  Header,
  Divider,
  Segment,
  Dropdown,
  Grid
} from 'semantic-ui-react';

import { geolocated } from 'react-geolocated';
import queryString from 'query-string';

import SpacedSegment from '../../components/SpacedSegment';
import Business from '../../components/Business';

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
      geolocationFinished: false
    };
  }

  componentWillMount() {
    this.updateLocations(this.props, true);

    // parse query string
    const query = queryString.parse(this.props.location.search, { arrayFormat: 'index' });
    this.setState(query);
  }

  componentDidMount() {
    // run initial search if query is present
    if (this.props.location.search.length)
      this.handleSubmit();
  }

  componentWillReceiveProps(newProps) {
    this.updateLocations(newProps);
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

    const query = queryString.stringify({
      query: this.state.query,
      serviceCategories: this.state.serviceCategories,
      minimumRating: this.state.minimumRating,
      location: this.state.location
    }, { arrayFormat: 'index' });
    this.props.history.push({ pathname: '/search', search: query });

    this.setState({
      isLoading: true,
      results: []
    });

    APIService.shared().requestSearch(this.state.query, this.state.serviceCategories, this.state.minimumRating, this.state.location)
      .then(response => {
        this.setState({
          isLoading: false,
          results: response.slice(0, 50),
          message: !response.length ? 'No results' : null
        });
      });
  }

  render() {
    const { query, serviceCategories, minimumRating, isLoading, results, message, locations, location } = this.state;

    return (
      <Container>

        <Grid centered>
          <Grid.Row>
            <Grid.Column width={16}>

              <Segment as={Form} onSubmit={this.handleSubmit} textAlign='center'>

                <Form.Group inline widths='equal'>

                  <Form.Field width={8}>
                    <Input type='text' name='query' value={query} onChange={this.handleChange} placeholder='Search...' />
                    <Button type='submit' primary content='Search' />
                  </Form.Field>

                </Form.Group>

                <Divider horizontal>Filters</Divider>

                <Form.Group inline style={{ display: 'block', margin: '0px auto' }}>

                  <Form.Field style={{ display: 'inline-block' }}>
                    <label>Categories</label>
                    <Dropdown name='serviceCategories' multiple selection
                              options={this.serviceCategories} onChange={this.handleChange}
                              value={serviceCategories} placeholder='Category Filter'
                    />
                  </Form.Field>

                  <Form.Field style={{ display: 'inline-block' }}>
                    <label>Minimum Rating</label>
                    <Dropdown name='minimumRating' selection
                              options={this.ratingFilters} onChange={this.handleChange}
                              value={minimumRating} placeholder='Rating Filter'
                    />
                  </Form.Field>

                  <Form.Field style={{ display: 'inline-block' }}>
                    <label>Location</label>
                    <Dropdown name='location' selection
                              options={locations} onChange={this.handleChange}
                              value={location} placeholder='Location Filter'
                    />
                  </Form.Field>

                </Form.Group>

              </Segment>

              <Divider section />

              <Segment basic loading={isLoading}>
                {message !== null &&
                <Header size='medium' textAlign='center'>{message}</Header>
                }
                {results.map(result => (
                  <SpacedSegment spacing={3} key={result.id}><Business business={result} /></SpacedSegment>
                ))}
              </Segment>

            </Grid.Column>
          </Grid.Row>
        </Grid>

      </Container>
    );
  }

}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(withAuth(Search));

