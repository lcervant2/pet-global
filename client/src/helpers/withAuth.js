import React, { Component } from 'react';
import APIService from '../services/APIService';

export function withAuth(WrappedComponent) {
  return class extends Component {

    constructor(props) {
      super(props);

      this.onUserUpdate = this.onUserUpdate.bind(this);

      this.state = {
        isLoggedIn: false,
        currentUser: false
      };
    }

    componentWillMount() {
      this.setState({
        isLoggedIn: APIService.shared().isLoggedIn(),
        currentUser: APIService.shared().getCurrentUser()
      });

      APIService.shared().addListener(this.onUserUpdate);
    }

    componentWillUnmount() {
      APIService.shared().removeListener(this.onUserUpdate);
    }

    componentWillReceiveProps(newProps) {
      this.setState({
        isLoggedIn: APIService.shared().isLoggedIn(),
        currentUser: APIService.shared().getCurrentUser()
      });
    }

    onUserUpdate(newUser) {
      this.setState({
        isLoggedIn: APIService.shared().isLoggedIn(),
        currentUser: APIService.shared().getCurrentUser()
      });
    }

    render() {
      return <WrappedComponent isLoggedIn={this.state.isLoggedIn} currentUser={this.state.currentUser} {...this.props} />;
    }

  };
};