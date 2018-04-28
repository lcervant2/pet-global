import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  Grid,
  Label,
  Dropdown,
  Input,
  Icon,
  Message,
  Segment,
  Divider
} from 'semantic-ui-react';
import './SignUp.css';

import APIService from '../../services/APIService';

import { withAuth } from "../../helpers/withAuth";
import { camelCase } from '../../helpers/convertCase';
import states from '../../helpers/states';

class SignUp extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.statesList = _.map(Object.keys(states), state => { return { key: state, text: state, value: state } });

    this.state = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: this.statesList[0].value,
      zipCode: '',
      errors: {},
      isLoading: false
    }
  }

  componentWillMount() {
    if (this.props.isLoggedIn) {
      if (this.props.history.canGoBack)
        this.props.history.goBack();
      else
        this.props.history.push('/');
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isLoading: true,
    });

    APIService.shared().signUp(
      this.state.username,
      this.state.email,
      this.state.password,
      this.state.firstName,
      this.state.lastName,
      this.state.address1,
      this.state.address2,
      this.state.city,
      this.state.state,
      this.state.zipCode
    )
      .then(() => {
        this.props.history.push('/');
      })
      .catch(response => {
        const errorMessages = {};
        if (response.response.status === 400) {
          const errors = camelCase(response.response.data.validations.body);
          errors.forEach(error => {
            if (error.dataPath === '' && error.keyword === 'required') {
              if (error.params.missingProperty === 'username')
                errorMessages.username = 'Username cannot be blank';
              else if (error.params.missingProperty === 'email')
                errorMessages.email = 'Email cannot be blank';
              else if (error.params.missingProperty === 'password')
                errorMessages.password = 'Password cannot be blank';
              else if (error.params.missingProperty === 'first_name')
                errorMessages.firstName = 'First name cannot be blank';
              else if (error.params.missingProperty === 'last_name')
                errorMessages.lastName = 'Last name cannot be blank';
            } else if (error.dataPath === '.address' && error.keyword === 'required') {
              if (error.params.missingProperty === 'address1')
                errorMessages.address1 = 'Address cannot be blank';
              else if (error.params.missingProperty === 'address2')
                errorMessages.address2 = 'Address cannot be blank';
              else if (error.params.missingProperty === 'city')
                errorMessages.city = 'City cannot be blank';
              else if (error.params.missingProperty === 'state')
                errorMessages.state = 'State cannot be blank';
              else if (error.params.missingProperty === 'zip_code')
                errorMessages.zipCode = 'Zip code cannot be blank';
            }
          });
        } else if (response.response.status === 401 && response.response.data.error.code === 'USERNAME_UNAVAILABLE_ERROR') {
          errorMessages.username = 'This username is already taken';
        } else if (response.response.status === 401 && response.response.data.error.code === 'EMAIL_ALREADY_REGISTERED_ERROR') {
          errorMessages.email = 'This email is already associated with another account';
        }
        this.setState({
          errors: errorMessages,
          isLoading: false
        });
      });
  }

  render() {
    const { errors, isLoading } = this.state;

    return (
      <Container className='signup-container'>
        <Grid centered>
          <Grid.Column largeScreen={12} computer={14} tablet={16}>

            <Message
              attached
              header='Sign Up'
              content='Fill out the form below to sign up for a new account.'
              icon='signup'
              size='large'
            />

            <Segment as={Form} onSubmit={this.handleSubmit} loading={isLoading} attached padded clearing>

              <Form.Group widths='equal'>

                <Form.Field required error={errors.firstName !== undefined}>
                  <label>First name</label>
                  <input type='text' name='firstName' placeholder='John' onChange={this.handleChange} />
                  {errors.firstName && <Label basic color='red' pointing>{errors.firstName}</Label>}
                </Form.Field>

                <Form.Field required error={errors.lastName !== undefined}>
                  <label>Last name</label>
                  <input type='text' name='lastName' placeholder='Smith' onChange={this.handleChange} />
                  {errors.lastName && <Label basic color='red' pointing>{errors.lastName}</Label>}
                </Form.Field>

              </Form.Group>

              <Form.Field required error={errors.username !== undefined}>
                <label>Username</label>
                <Input
                  type='text'
                  name='username'
                  placeholder='Username'
                  label={{ basic: true, content: '@' }}
                  labelPosition='left'
                  onChange={this.handleChange}
                />
                {errors.username && <Label basic color='red' pointing>{errors.username}</Label>}
              </Form.Field>

              <Form.Field required error={errors.email !== undefined}>
                <label>Email</label>
                <input type='email' name='email' placeholder='email@domain.com' onChange={this.handleChange} />
                {errors.email && <Label basic color='red' pointing>{errors.email}</Label>}
              </Form.Field>

              <Form.Field required error={errors.password !== undefined}>
                <label>Password</label>
                <input type='password' name='password' placeholder='Password' onChange={this.handleChange} />
                {errors.password && <Label basic color='red' pointing>{errors.password}</Label>}
              </Form.Field>

              <Divider section horizontal>Address</Divider>

              <Form.Field required error={errors.address1 !== undefined}>
                <label>Street Address</label>
                <Input type='text' name='address1' placeholder='Line 1' onChange={this.handleChange} />
                {errors.address1 && <Label basic color='red' pointing>{errors.address1}</Label>}
              </Form.Field>

              <Form.Field error={errors.address2 !== undefined}>
                <Input type='text' name='address2' placeholder='Line 2' onChange={this.handleChange} />
                {errors.address2 && <Label basic color='red' pointing>{errors.address2}</Label>}
              </Form.Field>

              <Form.Group>

                <Form.Field required error={errors.city !== undefined} width={9}>
                  <label>City</label>
                  <input type='text' name='city' placeholder='City' onChange={this.handleChange} />
                  {errors.city && <Label basic color='red' pointing>{errors.city}</Label>}
                </Form.Field>

                <Form.Field required error={errors.state !== undefined} width={3}>
                  <label>State</label>
                  <Dropdown name='state' options={this.statesList} fluid search selection defaultValue={this.statesList[0].value} onChange={this.handleChange} />
                  {errors.state && <Label basic color='red' pointing>{errors.state}</Label>}
                </Form.Field>

                <Form.Field required error={errors.zipCode !== undefined} width={4}>
                  <label>Zip Code</label>
                  <input type='text' name='zipCode' placeholder='Zip Code' onChange={this.handleChange} />
                  {errors.zipCode && <Label basic color='red' pointing>{errors.zipCode}</Label>}
                </Form.Field>

              </Form.Group>

              <Divider hidden />

              <Button type='submit' primary fluid icon='signup' content='Sign Up' size='large' />

            </Segment>

            <Message attached='bottom' warning>
              <Icon name='help' />
              Already have an account? <Link to='/login'>Login here.</Link>
            </Message>

          </Grid.Column>
        </Grid>
      </Container>
    );
  }

}

export default withAuth(SignUp);