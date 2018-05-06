import React, { Component } from 'react'
import './Home.scss';

import Container from '../../components/UI/Container/Container';
import Form from '../../components/UI/Form/Form';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import VerticalCenter from '../../components/UI/VerticalCenter/VerticalCenter';
import Image from '../../components/UI/Image/Image';

import qs from 'qs';

import { withAuth } from '../../helpers/withAuth';

import background from '../../images/home_background.jpg';
import logo from '../../images/logo_white.svg';

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

    const query = qs.stringify({
      query: this.state.query,
      location: this.state.location
    });
    this.props.history.push('/search?' + query);
  }

  render() {
    return (
      <div className='home-page' >
        <Container>
          <VerticalCenter>
            <div className='home-page__form'>
              <Image src={logo} />
              <div className='home-page__slogan'>Local petcare gone global</div>

              <Form onSubmit={this.handleSearchSubmit}>
                <Input name='query' type='text' placeholder='Search...' icon='search' onChange={this.handleChange} action={<Button primary onClick={this.handleSearchSubmit}>Search</Button>} />
              </Form>
            </div>
          </VerticalCenter>
        </Container>
      </div>
    );
  }

}

export default withAuth(Home);