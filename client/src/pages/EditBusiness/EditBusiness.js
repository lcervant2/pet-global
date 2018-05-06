import _ from 'lodash';
import React, { Component } from 'react';
import './EditBusiness.scss';

import Container from '../../components/UI/Container/Container';
import Message from '../../components/UI/Message/Message';
import Form from '../../components/UI/Form/Form';
import FormField from '../../components/UI/Form/Field/Field';
import FormGroup from '../../components/UI/Form/Group/Group';
import FormSection from '../../components/UI/Form/Section/Section';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import ImageInput from '../../components/UI/Image/Input/Input';
import Panel from '../../components/UI/Panel/Panel';
import PanelHeader from '../../components/UI/Panel/Header/Header';
import Loader from '../../components/UI/Loader/Loader';

import { AsYouType } from 'libphonenumber-js';

import APIService from '../../services/APIService';

import serviceCategories from '../../helpers/serviceCategories';
import { withAuth } from '../../helpers/withAuth';

class EditBusiness extends Component {

  constructor(props) {
    super(props);

    this.serviceCategories = _.map(serviceCategories, category => ({ key: category.value, value: category.value, text: category.name }));

    this.loadBusiness = this.loadBusiness.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      isLoading: false,
      isPosting: false,
      error: null,
      business: {
        id: null,
        name: '',
        description: '',
        phoneNumber: '',
        email: '',
        website: '',
        address: {
          address1: '',
          address2: '',
          city: '',
          state: 'VA',
          zipCode: ''
        },
        serviceCategories: [],
      },
      images: [{ file: null, preview: null }],
      imageCount: 0,
      deleteImages: []
    };
  }

  componentWillMount() {
    const { businessId } = this.props.match.params;
    if (businessId)
      this.loadBusiness(businessId);
  }

  componentWillReceiveProps(newProps) {
    const { businessId } = newProps.match.params;
    if (businessId)
      this.loadBusiness(businessId);
  }

  loadBusiness(id) {
    this.setState({
      loading: true,
      error: null
    });

    APIService.shared().requestBusiness(id)
      .then(response => {
        const images = _.concat(_.map(response.images, image => ({ id: image.id, preview: image.url, file: null })), { file: null, review: null });
        this.setState({
          isLoading: false,
          business: response,
          images: images,
          imageCount: images.length - 1
        });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.setState({
            isLoading: false,
            business: null
          });
        } else {
          this.setState({
            isLoading: false,
            error: {
              title: 'An unknown error occurred'
            }
          });
        }
      })
  }

  handleChange(e, { name, value }) {
    if (name === 'phoneNumber') {
      // format old input
      const formatter = new AsYouType('US');
      let old = formatter.input(this.state.business.phoneNumber);

      // check if new value is one less than the old value (meaning user pressed backspace key)
      if (value.length === old.length - 1) {
        // delete a number
        old = formatter.getNationalNumber();
        old = old.slice(0, old.length - 1);
        this.setState({
          business: Object.assign({}, this.state.business, { phoneNumber: new AsYouType('US').input(old) })
        });
      } else {
        this.setState({
          business: Object.assign({}, this.state.business, { phoneNumber: new AsYouType('US').input(value) })
        });
      }
    } else if (name.startsWith('address.')) {
      name = name.replace('address.', '');
      this.setState({
        business: Object.assign({}, this.state.business, {
          address: Object.assign({}, this.state.business.address, { [name]: value })
        })
      });
    } else {
      this.setState({
        business: Object.assign({}, this.state.business, { [name]: value })
      });
    }
  }

  handleCheckboxChange(e) {
    const value = e.target.value;
    const checked = e.target.checked;
    if (checked && !this.state.business.serviceCategories.includes(value)) {
      this.setState({
        business: Object.assign({}, this.state.business, {
          serviceCategories: this.state.business.serviceCategories.concat(value)
        })
      });
    } else if (!checked && this.state.business.serviceCategories.includes(value)) {
      this.setState({
        business: Object.assign({}, this.state.business, {
          serviceCategories: this.state.business.serviceCategories.filter(category => category !== value)
        })
      });
    }
  }

  handleImageChange(name, image) {
    if (image) {
      // ensure images has enough available space
      let images = this.state.images;
      if (this.state.imageCount + 2 > images.length) {
        // push an empty image
        images.push({ file: null, preview: null });
      }
      // get the image index using the name
      const imageIndex = parseInt(name.replace('image_', ''));
      // change the value for the image in images array
      images[imageIndex] = image;
      // set the state
      this.setState({
        images: images,
        imageCount: this.state.imageCount + 1
      });
    } else {
      const images = this.state.images;
      // get the image index using the name
      const imageIndex = parseInt(name.replace('image_', ''));
      // check if image is a network image - if it is add the id to the list of images to delete
      if (images[imageIndex].id) {
        this.setState({
          deleteImages: this.state.deleteImages.concat(images[imageIndex].id)
        });
      }
      // shift all of the images down one starting at the image index
      for (let i = imageIndex; i < this.state.imageCount; i++)
        images[i] = images[i + 1];
      // remove the last one
      images.pop();
      // set the state
      this.setState({
        images: images,
        imageCount: this.state.imageCount - 1
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isPosting: true
    });

    let request = null;
    if (this.state.business.id)
      request = APIService.shared().updateBusiness(this.state.business);
    else
      request = APIService.shared().registerBusiness(this.state.business);

    request
      .then(response => {
        // loop through images and upload each one if it contains a file
        let upload = Promise.resolve(response); // default to just returning the response
        for (let i = 0; i < this.state.imageCount; i++) {
          // chain each upload to the upload promise
          if (this.state.images[i].file)
            upload = upload.then(() => APIService.shared().uploadBusinessPicture(response.id, this.state.images[i].file));
        }
        // loop through delete images and delete
        let deletion = upload;
        for (let i = 0; i < this.state.deleteImages.length; i++) {
          deletion = deletion.then(() => APIService.shared().deleteBusinessPicture(response.id, this.state.deleteImages[i]));
        }
        return deletion;
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
    const { isLoading, error, business, images, isPosting } = this.state;

    // if (!isLoading && !business)
    //   return <NotFound />;

    return (
      <div className='edit-business-page'>
        <Container>
          <div className='edit-business-page__form'>
            {error && <Message title={error.title} message={error.message} error />}

            {!isLoading ? (
              <Panel padded>
                <PanelHeader title={business.id ? 'Update ' + business.name : 'Register a Business'} />

                <Form onSubmit={this.handleSubmit}>
                  <FormSection>
                    <FormField>
                      <label>Name</label>
                      <Input type='text' name='name' value={business.name} placeholder="John's Pet Place" onChange={this.handleChange} />
                    </FormField>
                    <FormField>
                      <label>Description</label>
                      <Input name='description' value={business.description} placeholder='Describe your business...' onChange={this.handleChange} />
                    </FormField>
                    <FormField>
                      <label>Email</label>
                      <Input type='email' name='email' value={business.email} placeholder='contact@yourbusiness.com' onChange={this.handleChange} />
                    </FormField>
                    <FormField>
                      <label>Phone Number</label>
                      <Input type='text' name='phoneNumber' value={business.phoneNumber} placeholder='+1 (555) 555-5555' onChange={this.handleChange} />
                    </FormField>
                    <FormField>
                      <label>Website</label>
                      <Input type='text' name='website' value={business.website} placeholder='yourbusiness.com' onChange={this.handleChange} />
                    </FormField>
                  </FormSection>
                  <FormSection>
                    <FormField>
                      <label>Address</label>
                      <Input type='text' name='address.address1' value={business.address.address1} placeholder='Address line 1' onChange={this.handleChange} />
                    </FormField>
                    <FormField>
                      <Input type='text' name='address.address2' value={business.address.address2} placeholder='Address line 2' onChange={this.handleChange} />
                    </FormField>
                    <FormGroup>
                      <FormField>
                        <label>City</label>
                        <Input type='text' name='address.city' value={business.address.city} placeholder='City' onChange={this.handleChange} />
                      </FormField>
                      <FormField>
                        <label>State</label>
                        <Input type='text' name='address.state' value={business.address.state} placeholder='State' onChange={this.handleChange} />
                      </FormField>
                      <FormField>
                        <label>Zip Code</label>
                        <Input type='text' name='address.zipCode' value={business.address.zipCode} placeholder='Zip code' onChange={this.handleChange} />
                      </FormField>
                    </FormGroup>
                  </FormSection>
                  <FormSection>
                    <FormField>
                      <label>Service Categories</label>
                      {this.serviceCategories.map(category => (
                        <div key={category.value} className='checkbox'>
                          <input
                            type='checkbox'
                            name='serviceCategories'
                            value={category.value}
                            onClick={this.handleCheckboxChange}
                            checked={business.serviceCategories.includes(category.value)}
                          />
                          <label>{category.text}</label>
                        </div>
                      ))}
                    </FormField>
                  </FormSection>
                  <FormSection>
                    <FormField>
                      <label>Images</label>
                      {images.map((image, imageIndex) => (
                        <ImageInput
                          key={'image_' + imageIndex}
                          name={'image_' + imageIndex}
                          className='edit-business-page__form__image-input'
                          onChange={this.handleImageChange}
                          file={image.file}
                          preview={image.preview}
                        />
                      ))}
                    </FormField>
                  </FormSection>
                  <FormSection />
                  <FormSection>
                    <FormField>
                      <Button type='submit' primary block loading={isPosting}>{business.id ? 'Update Business' : 'Register Business'}</Button>
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

export default withAuth(EditBusiness);