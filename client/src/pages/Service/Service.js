import React, { Component } from 'react';
import {
  Container,
  Header,
  Icon,
  Loader,
  Segment,
  Pagination
} from 'semantic-ui-react';
import { capitalize } from '../../helpers/capitalize';
import './Service.css';

import Business from '../../components/Business';
import SpacedSegment from "../../components/SpacedSegment/SpacedSegment";

import APIService from '../../services/APIService';

class Service extends Component {

  constructor(props) {
    super(props);

    this.loadBusinesses = this.loadBusinesses.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.icons = {
      'retail': 'shopping basket',
      'grooming': 's15',
      'training': 'star',
      'caretaker': 'male',
      'hotels_and_spas': 'bar',
      'insurance': 'money',
      'relocation': 'truck',
      'veterinary': 'doctor',
      'emergency': 'hospital'
    };

    this.state = {
      isLoading: true,
      businesses: [],
      activePage: 1
    };
  }

  componentWillMount() {
    this.loadBusinesses(this.props.match.params.name);
  }

  componentWillReceiveProps(newProps) {
    this.loadBusinesses(newProps.match.params.name);
  }

  loadBusinesses(serviceName) {
    this.setState({
      isLoading: true
    });
    APIService.shared().requestSearch('', [serviceName])
      .then(response => {
        this.setState({
          isLoading: false,
          businesses: response,
          activePage: 1
        });
      });
  }

  handlePageChange(e, { activePage }) {
    this.setState({
      activePage: activePage
    });
  }

  render() {
    const { name } = this.props.match.params;
    const { isLoading, businesses, activePage } = this.state;

    return (
      <Container className='service-container'>
        <Header as='h1' icon textAlign='center' className='service-header'>
          <Icon name={this.icons[name]} circular />
          <Header.Content>
            {capitalize(name.replace(/_/g, ' '))}
          </Header.Content>
        </Header>

        {!isLoading
          ? (
            <div>
              <Segment textAlign='center' basic>
                <Pagination
                  activePage={activePage}
                  totalPages={Math.ceil(businesses.length / 20)}
                  onPageChange={this.handlePageChange}
                />
              </Segment>

              {businesses.slice((activePage - 1) * 20, activePage * 20).map(business => (
                <SpacedSegment spacing={3} key={business.id}><Business business={business} /></SpacedSegment>
              ))}

              <Segment textAlign='center' basic>
                <Pagination
                  activePage={activePage}
                  totalPages={Math.ceil(businesses.length / 20)}
                  onPageChange={this.handlePageChange}
                />
              </Segment>
            </div>
          )
          : (
            <Loader active inline='centered' />
          )
        }
      </Container>
    );
  }

}

export default Service;