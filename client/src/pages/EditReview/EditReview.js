import _ from 'lodash';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import defaultBusinessImage from '../../images/business_default.png';

import Container from '../../components/UI/Container/Container';
import Panel from '../../components/UI/Panel/Panel';
import PanelHeader from '../../components/UI/Panel/Header/Header';
import Form from '../../components/UI/Form/Form';
import FormField from '../../components/UI/Form/Field/Field';
import FormGroup from '../../components/UI/Form/Group/Group';
import FormSection from '../../components/UI/Form/Section/Section';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Rating from '../../components/UI/Rating/Rating';
import Message from '../../components/UI/Message/Message';
import Loader from '../../components/UI/Loader/Loader';

import 'react-datepicker/dist/react-datepicker.css';
import './EditReview.scss';

import APIService from '../../services/APIService';

import serviceCategories from '../../helpers/serviceCategories';

class EditReview extends Component {

  constructor(props) {
    super(props);

    this.serviceCategories = _.map(serviceCategories, category => ({ text: category.name, value: category.value, key: category.value }));

    this.loadReview = this.loadReview.bind(this);
    this.loadBusiness = this.loadBusiness.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      isLoading: true,
      isPostingReview: false,
      error: null,
      business: null,
      review: {
        id: null,
        overallRating: 0,
        priceRating: 0,
        customerServiceRating: 0,
        qualityRating: 0,
        description: '',
        serviceCategories: [],
        transactionOccurred: false,
        repeatCustomer: false,
        date: moment()
      }
    }
  }

  componentWillMount() {
    if (this.props.match.params.reviewId)
      this.loadReview(this.props.match.params.reviewId);
    else
      this.loadBusiness(this.props.match.params.businessId);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.reviewId)
      this.loadReview(newProps.match.params.reviewId);
    else
      this.loadBusiness(newProps.match.params.businessId);
  }

  loadBusiness(id) {
    this.setState({
      isLoading: true,
      error: null
    });

    APIService.shared().requestBusiness(id)
      .then(response => {
        this.setState({
          business: response,
          isLoading: false
        });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.setState({
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false,
            error: {
              title: 'An unknown error occurred.'
            }
          });
        }
      });
  }

  loadReview(id) {
    this.setState({
      isLoading: true,
      error: null
    });

    APIService.shared().requestReview(id)
      .then(response => {
        const { business, ...review } = response;
        this.setState({
          isLoading: false,
          business: business,
          review: {
            ...review,
            date: moment(review.date)
          }
        });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.setState({
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false,
            error: {
              title: 'An unknown error occurred.'
            }
          });
        }
      });
  }

  handleChange(e, { name, value, rating, checked, date }) {
    this.setState({
      review: Object.assign({}, this.state.review, { [name]: checked !== undefined ? checked : (value || rating || date) })
    });
  }

  handleCheckboxChange(e) {
    const value = e.target.value;
    const checked = e.target.checked;
    if (checked && !this.state.review.serviceCategories.includes(value)) {
      this.setState({
        review: Object.assign({}, this.state.review, {
          serviceCategories: this.state.review.serviceCategories.concat(value)
        })
      });
    } else if (!checked && this.state.review.serviceCategories.includes(value)) {
      this.setState({
        review: Object.assign({}, this.state.review, {
          serviceCategories: this.state.review.serviceCategories.filter(category => category !== value)
        })
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isPostingReview: true
    });

    let request = null;
    if (!this.state.review.id)
      request = APIService.shared().postReview({ businessId: this.state.business.id, ...this.state.review });
    else
      request = APIService.shared().updateReview(this.state.review);

    request
      .then(response => this.props.history.push('/businesses/' + this.state.business.id))
      .catch(err => {
        this.setState({
          isPostingReview: false,
          error: {
            title: 'An unknown error occurred'
          }
        });
      });
  }

  render() {
    // if (!isLoading && !this.state.business)
    //   return <NotFound />

    const { error, review, isPostingReview, business, isLoading } = this.state;

    return (
      <div className='edit-review-page'>
        <Container>
          <div className='edit-review-page__form'>

            {error && <Message error content={error.message} title={error.title} />}

            {business ? (
            <Panel padded>
              <PanelHeader title={(review.id ? 'Edit review for ' : 'Write review for ') + business.name} />

              <Form onSubmit={this.handleSubmit}>
                <FormSection>
                  <FormField>
                    <label>Overall Rating</label>
                    <Rating name='overallRating' input rating={review.overallRating} maxRating={5} icon='star' onChange={this.handleChange} />
                  </FormField>
                  <FormField>
                    <label>Price</label>
                    <Rating name='priceRating' input rating={review.priceRating} maxRating={5} icon='star' onChange={this.handleChange} />
                  </FormField>
                  <FormField>
                    <label>Customer Service</label>
                    <Rating name='customerServiceRating' input rating={review.customerServiceRating} maxRating={5} icon='star' onChange={this.handleChange} />
                  </FormField>
                  <FormField>
                    <label>Quality</label>
                    <Rating name='qualityRating' input rating={review.qualityRating} maxRating={5} icon='star' onChange={this.handleChange} />
                  </FormField>
                </FormSection>
                <FormSection>
                  <FormField>
                    <label>Description</label>
                    <Input type='text' name='description' value={review.description} onChange={this.handleChange} />
                  </FormField>
                </FormSection>
                <FormSection>
                  <FormField>
                    <label>What service(s) were you trying to receive?</label>
                    {this.serviceCategories.map(category => (
                      <div key={category.value} className='checkbox'>
                        <input
                          type='checkbox'
                          name='serviceCategories'
                          value={category.value}
                          onClick={this.handleCheckboxChange}
                          checked={review.serviceCategories.includes(category.value)}
                        />
                        <label>{category.text}</label>
                      </div>
                    ))}
                  </FormField>
                </FormSection>
                <FormSection>
                  <FormField className='checkbox checkbox--bold'>
                    <input
                      type='checkbox'
                      name='transactionOccurred'
                      checked={review.transactionOccurred} onClick={e => {
                        this.handleChange(e, {
                          name: e.target.name,
                          checked: e.target.checked
                        });
                      }}
                    />
                    <label>I bought something/paid for a service</label>
                  </FormField>
                  <FormField className='checkbox checkbox--bold'>
                    <input
                      type='checkbox'
                      name='repeatCustomer'
                      checked={review.repeatCustomer} onClick={e => {
                      this.handleChange(e, {
                        name: e.target.name,
                        checked: e.target.checked
                      });
                    }}
                    />
                    <label>I would go back again</label>
                  </FormField>
                </FormSection>
                <FormSection>
                  <FormField>
                    <label>When was this?</label>
                    <DatePicker name='date' selected={review.date} onChange={this.handleChange} />
                  </FormField>
                </FormSection>
                <FormSection />
                <FormSection>
                  <FormField>
                    <Button type='submit' block primary icon='pen' loading={isPostingReview}>{review.id ? 'Update Review' : 'Write Review'}</Button>
                  </FormField>
                </FormSection>
              </Form>
            </Panel>
            ) : (
              <Panel padded>
                <Loader />
              </Panel>
            )}

          </div>

        </Container>
      </div>
    );
  }

}

export default EditReview;