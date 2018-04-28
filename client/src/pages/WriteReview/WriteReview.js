import _ from 'lodash';
import React, { Component } from 'react';
import {
  Container,
  Grid,
  Form,
  Button,
  Message,
  Segment,
  Rating,
  Divider,
  Header,
  TextArea,
  Checkbox,
  Dropdown
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import defaultBusinessImage from '../../images/business_default.png';

import SquareImage from '../../components/SquareImage';
import SpacedSegment from '../../components/SpacedSegment';
import ErrorMessage from '../../components/ErrorMessage';

import 'react-datepicker/dist/react-datepicker.css';
import './WriteReview.css';

import APIService from '../../services/APIService';

import serviceCategories from '../../helpers/serviceCategories';

class WriteReview extends Component {

  constructor(props) {
    super(props);

    this.serviceCategories = _.map(serviceCategories, category => ({ text: category.name, value: category.value, key: category.value }));

    this.loadBusiness = this.loadBusiness.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      business: null,
      isLoading: false,
      isLoadingBusiness: true,
      overallRating: 3,
      priceRating: 3,
      customerServiceRating: 3,
      qualityRating: 3,
      description: '',
      serviceCategories: [],
      transactionOccurred: false,
      repeatCustomer: false,
      date: moment(),
      error: null
    }
  }

  componentWillMount() {
    this.loadBusiness(this.props.match.params.id);
  }

  componentWillReceiveProps(newProps) {
    this.loadBusiness(newProps.match.params.id);
  }

  loadBusiness(id) {
    this.setState({
      business: null,
      isLoadingBusiness: true
    });

    APIService.shared().requestBusiness(id)
      .then(response => {
        this.setState({
          business: response,
          isLoadingBusiness: false
        });
      })
      .catch(err => console.error(err));
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: value
    });
  }

  handleRatingChange(e, { name, rating }) {
    this.setState({
      [name]: rating
    });
  }

  handleCheckboxChange(e, { name, checked }) {
    this.setState({
      [name]: checked
    });
  }

  handleDateChange(date) {
    this.setState({
      date: date
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isLoading: true
    });

    APIService.shared().postReview({ businessId: this.props.match.params.id, ...this.state })
      .then(response => this.props.history.push('/businesses/' + this.props.match.params.id))
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
    const { error, isLoading, business, isLoadingBusiness, overallRating, priceRating, customerServiceRating, qualityRating, date } = this.state;

    return (
      <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column largeScreen={12} computer={14} tablet={16}>

              {error && <ErrorMessage message={error.message} title={error.title} />}

              <Segment basic style={{ padding: 0, margin: 0 }} loading={isLoadingBusiness}>

                {business &&
                  <div>

                    <Message attached>
                      <Message.Content>
                        <Message.Header style={{ marginBottom: '1em' }}>Write a review for</Message.Header>
                        <SquareImage
                          src={business.images.length ? business.images[0].url : defaultBusinessImage}
                          style={{
                            display: 'inline-block',
                            height: '32px',
                            width: '32px',
                            verticalAlign: 'middle',
                            marginRight: '8px' }}
                        />
                        <div style={{ display: 'inline-block', lineHeight: '32px', position: 'relative', top: '3px' }}>
                          <Header
                            style={{ display: 'inline-block' }}
                            size='small' content={business.name} />
                        </div>
                      </Message.Content>
                    </Message>

                    <Segment as={Form} attached onSubmit={this.handleSubmit} style={{ padding: '2.5em' }} loading={isLoading}>

                      <SpacedSegment spacing={4}>
                        <Header size='medium'>Overall Rating</Header>
                        <Rating name='overallRating' defaultRating={overallRating} maxRating={5}
                                size='huge' icon='star' onRate={this.handleRatingChange} />
                      </SpacedSegment>

                      <SpacedSegment spacing={4}>
                        <Header size='medium'>Price</Header>
                        <Rating name='priceRating' defaultRating={priceRating} maxRating={5}
                                size='huge' icon='star' onRate={this.handleRatingChange} />
                      </SpacedSegment>

                      <SpacedSegment spacing={4}>
                        <Header size='medium'>Customer Service</Header>
                        <Rating name='customerServiceRating' defaultRating={customerServiceRating} maxRating={5}
                                size='huge' icon='star' onRate={this.handleRatingChange} />
                      </SpacedSegment>

                      <SpacedSegment spacing={6}>
                        <Header size='medium'>Quality</Header>
                        <Rating name='qualityRating' defaultRating={qualityRating} maxRating={5}
                                size='huge' icon='star' onRate={this.handleRatingChange} />
                      </SpacedSegment>

                      <SpacedSegment spacing={4}>
                        <Form.Field>
                          <label>Description</label>
                          <TextArea autoHeight placeholder='Tell us about your experience...'
                                    style={{ minHeight: 100 }} name='description' onChange={this.handleChange} />
                        </Form.Field>
                      </SpacedSegment>

                      <SpacedSegment spacing={6}>
                        <Form.Field>
                          <label>What service(s) were you trying to receive?</label>
                          <Dropdown name='serviceCategories' placeholder='Services'
                                    multiple selection options={this.serviceCategories}
                                    onChange={this.handleChange}
                          />
                        </Form.Field>
                      </SpacedSegment>

                      <SpacedSegment spacing={3}><Checkbox name='transactionOccurred' label='I bought something/paid for a service' onChange={this.handleCheckboxChange} /></SpacedSegment>
                      <SpacedSegment spacing={6}><Checkbox name='repeatCustomer' label='I would go back again' onChange={this.handleCheckboxChange} /></SpacedSegment>

                      <SpacedSegment spacing={6}>
                        <Form.Field>
                          <label>When was this?</label>
                          <DatePicker name='date' selected={date} onChange={this.handleDateChange} />
                        </Form.Field>
                      </SpacedSegment>

                      <Button type='submit' primary size='large' fluid icon='write' content='Write Review' />

                    </Segment>

                  </div>
                }

              </Segment>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

}

export default WriteReview;