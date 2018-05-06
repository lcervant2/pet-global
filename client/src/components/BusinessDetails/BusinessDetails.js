import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './BusinessDetails.scss';

import Container from '../UI/Container/Container';
import Loader from '../UI/Loader/Loader';
import ImageSquare from '../UI/Image/Square/Square';
import Icon from '../UI/Icon/Icon';
import Panel from '../UI/Panel/Panel';
import ReviewList from '../ReviewList/ReviewList';

import BusinessDetailsHeader from './Header/Header';
import BusinessDetailsDirections from './Directions/Directions';

import defaultBusinessPicture from '../../images/business_default.png';

import APIService from '../../services/APIService';

import { withAuth } from '../../helpers/withAuth';

class BusinessDetails extends Component {

  constructor(props) {
    super(props);

    this.loadBusiness = this.loadBusiness.bind(this);
    this.loadReviews = this.loadReviews.bind(this);

    this.state = {
      business: null,
      isLoading: true,
      reviews: [],
      isLoadingReviews: true,
      error: null
    };
  }

  componentWillMount() {
    this.loadBusiness(this.props.match.params.id);
  }

  componentWillReceiveProps(newProps) {
    this.loadBusiness(newProps.match.params.id);
  }

  loadBusiness(businessId) {
    this.setState({
      isLoading: true
    });

    APIService.shared().requestBusiness(businessId)
      .then(response => {
        this.setState({
          isLoading: false,
          business: response,
          error: null
        });

        this.loadReviews(businessId);
      })
      .catch(error => {
        if (error.response.status === 404) {

        } else {
          this.setState({
            isLoading: false,
            business: null,
            error: {
              title: 'An unknown error occurred',
              content: 'Please try again later'
            }
          });
        }
      });
  }

  loadReviews(businessId) {
    this.setState({
      isLoadingReviews: true
    });

    APIService.shared().requestBusinessReviews(businessId)
      .then(response => {
        this.setState({
          isLoadingReviews: false,
          reviews: response,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          isLoadingReviews: false,
          reviews: [],
          error: {
            title: 'An unknown error occurred',
            content: 'Please try again later'
          }
        });
      });
  }

  render() {
    const { business, isLoading, reviews, isLoadingReviews } = this.state;
    const { className } = this.props;

    const inputClass = classNames('business-details', className);

    return (
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div className={inputClass}>
            <div>
              <Panel noPadding>
                <div className='business-details__image-grid'>
                  {business.images.slice(0, 5).map(image => (
                    <ImageSquare src={image.url} />
                  ))}
                </div>
                <BusinessDetailsHeader business={business} />
              </Panel>

              <BusinessDetailsDirections business={business} className='business-details__directions--mobile' />

              {reviews.length === 0 ? (
                <Panel className='business-details__reviews business-details__reviews--loading' padded>
                  {isLoadingReviews ? (
                    <Loader />
                  ) : (
                    <h3>No Reviews</h3>
                  )}
                </Panel>
              ) : (
                <Panel className='business-details__reviews' noPadding>
                  <ReviewList reviews={reviews} />
                </Panel>
              )}
            </div>
            <div className='business-details__directions'>
              <BusinessDetailsDirections business={business} />
            </div>
          </div>
        )}
      </Container>
    );
  }

}

export default withAuth(BusinessDetails);