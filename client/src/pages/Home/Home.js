import React, { Component } from 'react'
import {
  Container,
  Input,
  Dropdown,
  Button,
  Grid,
  Form
} from 'semantic-ui-react'
import './Home.css';

import queryString from 'query-string';

import { withAuth } from '../../helpers/withAuth';

class Home extends Component {

  constructor(props) {
    super(props);

    this.updateLocations = this.updateLocations.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);

    this.state = {
      locations: [],
      query: '',
      location: null
    };
  }

  componentWillMount() {
    this.updateLocations(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateLocations(newProps);
  }

  updateLocations(props) {
    let locations = [
      { key: 'none', value: null, text: 'None' }
    ];

    if (props.currentUser) {
      locations.push({
        key: 'user',
        value: props.currentUser.location.latitude + ',' + props.currentUser.location.longitude,
        text: props.currentUser.address.address1 + ', ' + props.currentUser.address.city + ', ' + props.currentUser.address.state
      });
    }

    this.setState({
      locations: locations,
      location: locations[locations.length - 1].value
    });
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: value
    });
  }

  handleSearchSubmit(e) {
    e.preventDefault();

    const query = queryString.stringify({
      query: this.state.query,
      location: this.state.location
    });
    this.props.history.push('/search?' + query);
  }

  render() {
    const { currentUser } = this.props;
    const { locations, location } = this.state;

    return (
      <Container>
        <Grid centered>

          <Grid.Row>
            <Grid.Column width={14} className='home-search'>

              <Form onSubmit={this.handleSearchSubmit}>
                <Input name='query' type='text' placeholder='Search...' action fluid size='large' onChange={this.handleChange}>
                  <input />
                  <Dropdown name='location' selection options={locations}
                            value={location} onChange={this.handleChange} placeholder='Location Filter' />
                  <Button type='submit' primary size='large'>Search</Button>
                </Input>
              </Form>

            </Grid.Column>
          </Grid.Row>

        </Grid>
      </Container>
    );
  }

}

export default withAuth(Home);