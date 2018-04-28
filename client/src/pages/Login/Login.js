import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Form,
  Button ,
  Input,
  Segment,
  Message,
  Divider,
  Icon,
  Grid
} from 'semantic-ui-react';

import ErrorMessage from '../../components/ErrorMessage';

import APIService from "../../services/APIService";

import { withAuth } from '../../helpers/withAuth';

class Login extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      username: '',
      password: '',
      isLoading: false,
      error: null
    };
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

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      isLoading: true
    });

    APIService.shared().login(this.state.username, this.state.password)
      .then(() => {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        this.props.history.push(from);
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          error: {
            title: 'Incorrect username or password'
          }
        });
      });
  }

  render() {
    const { error, isLoading } = this.state;

    return (
      <Container>

        <Grid centered>
          <Grid.Column largeScreen={12} computer={14} tablet={16}>

            {error && <ErrorMessage title={error.title} message={error.message} />}

            <Message
              attached
              header='Login'
              content='Enter your username and password to login.'
              icon='sign in'
              size='large'
            />

            <Segment as={Form} onSubmit={this.handleLogin} loading={isLoading} attached padded>

              <Form.Field required>
                <label>Username/Email:</label>
                <Input placeholder='Username/Email' name='username' onChange={this.handleChange} />
              </Form.Field>

              <Form.Field required>
                <label>Password:</label>
                <Input placeholder='Password' name='password' type='password' onChange={this.handleChange} />
              </Form.Field>

              <Divider hidden />

              <Button type='submit' icon='sign in' content='Login' primary fluid size='large' />

            </Segment>

            <Message attached='bottom' warning>
              <Icon name='help' />
              <span>
                Don't have an account? <Link to='/signup'>Sign up here.</Link>
              </span>
            </Message>

            <Segment basic textAlign='center'>
              Can't get into your account? <Link to='/password/reset'>Reset your password.</Link>
            </Segment>

          </Grid.Column>
        </Grid>

      </Container>
    )
  }

}

export default withAuth(Login);