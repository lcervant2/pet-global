import _ from 'lodash';
import React, { Component } from 'react';
import {
  Container,
  Grid,
  Form,
  Button,
  Input,
  Dropdown,
  Segment,
  Message,
  TextArea
} from 'semantic-ui-react';

import { AsYouType } from 'libphonenumber-js';

import SpacedSegment from '../../components/SpacedSegment';
import ErrorMessage from '../../components/ErrorMessage';

import APIService from '../../services/APIService';

import states from '../../helpers/states';
import serviceCategories from '../../helpers/serviceCategories';
import { withAuth } from '../../helpers/withAuth';

class RegisterBusiness extends Component {

  constructor(props) {
    super(props);

    this.states = _.map(Object.keys(states), state => ({ key: state, value: state, text: state }));
    this.serviceCategories = _.map(serviceCategories, category => ({ key: category.value, value: category.value, text: category.name }));

    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: '',
      description: '',
      phoneNumber: '',
      email: '',
      website: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      serviceCategories: [],
      isLoading: false,
      error: null,
      image: null
    };
  }

  handleChange(e, { name, value }) {
    if (name === 'phoneNumber') {
      // format old input
      const oldFormatter = new AsYouType('US');
      const oldFormatted = oldFormatter.input(this.state.phoneNumber);
      // check if new value is one less than the old value (meaning user pressed backspace key)
      if (value.length === oldFormatted.length - 1) {
        // delete a number
        const oldNationalNumber = oldFormatter.getNationalNumber();
        this.setState({
          phoneNumber: new AsYouType('US').input(oldNationalNumber.slice(0, oldNationalNumber.length - 1))
        });
      } else {
        this.setState({
          phoneNumber: new AsYouType('US').input(value)
        });
      }
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  handleFileChange(e) {
    const files = e.target.files || e.dataTransfer.files;
    if (!files.length) {
      this.setState({
        image: null
      });
    } else {
      this.setState({
        image: files[0]
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isLoading: true
    });

    APIService.shared().registerBusiness(this.state)
      .then(response => {
        if (this.state.image) {
          return APIService.shared().uploadBusinessPicture(response.id, this.state.image);
        } else {
          return response;
        }
      })
      .then(response => {
        this.props.history.push('/businesses/' + response.id);
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          error: {
            title: 'An unknown error occurred'
          }
        });
      });
  }

  render() {
    const { isLoading, error, phoneNumber } = this.state;

    return (
      <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column largeScreen={12} computer={14} tablet={16}>

              {error && <ErrorMessage title={error.title} message={error.message} />}

              <Message
                attached
                header='Register a Business' />

              <Segment as={Form} attached padded onSubmit={this.handleSubmit} loading={isLoading}>

                <SpacedSegment spacing={6}>

                  <Form.Field>
                    <label>Name</label>
                    <Input type='text' name='name' placeholder="John's Pet Place" onChange={this.handleChange} />
                  </Form.Field>

                  <Form.Field>
                    <label>Description</label>
                    <TextArea name='description' placeholder='Describe your business...' style={{ minHeight: 100 }} onChange={this.handleChange} />
                  </Form.Field>

                  <Form.Field>
                    <label>Email</label>
                    <Input type='email' name='email' placeholder='contact@yourbusiness.com' onChange={this.handleChange} />
                  </Form.Field>

                  <Form.Field>
                    <label>Phone Number</label>
                    <Input type='text' name='phoneNumber' value={phoneNumber} placeholder='+1 (555) 555-5555' onChange={this.handleChange} />
                  </Form.Field>

                  <Form.Field>
                    <label>Website</label>
                    <Input type='text' name='website' placeholder='yourbusiness.com' onChange={this.handleChange} />
                  </Form.Field>

                </SpacedSegment>

                <SpacedSegment spacing={6}>

                  <Form.Field>
                    <label>Address</label>
                    <Input type='text' name='address1' placeholder='Address line 1' onChange={this.handleChange} />
                  </Form.Field>

                  <Form.Field>
                    <Input type='text' name='address2' placeholder='Address line 2' onChange={this.handleChange} />
                  </Form.Field>

                  <Form.Group widths='equal'>

                    <Form.Field>
                      <label>City</label>
                      <Input type='text' name='city' placeholder='City' onChange={this.handleChange} />
                    </Form.Field>

                    <Form.Field>
                      <label>State</label>
                      <Dropdown name='state' search selection defaultValue={this.states[0].value} options={this.states} onChange={this.handleChange} />
                    </Form.Field>

                    <Form.Field>
                      <label>Zip Code</label>
                      <Input type='text' name='zipCode' placeholder='Zip code' onChange={this.handleChange} />
                    </Form.Field>

                  </Form.Group>

                </SpacedSegment>

                <SpacedSegment spacing={6}>

                  <Form.Field>
                    <label>Service Categories</label>
                    <Dropdown name='serviceCategories' multiple selection options={this.serviceCategories} onChange={this.handleChange} placeholder='Select a category...' />
                  </Form.Field>

                </SpacedSegment>

                <SpacedSegment spacing={6}>

                  <Form.Field>
                    <label>Image <em>(optional)</em></label>
                    <Input type='file' name='image' onChange={this.handleFileChange} />
                  </Form.Field>

                </SpacedSegment>

                <Button type='submit' primary size='large' content='Register Business' fluid />

              </Segment>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

}

export default withAuth(RegisterBusiness);