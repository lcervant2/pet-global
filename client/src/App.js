import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Service from './pages/Service';
import Settings from './pages/Settings';
import Business from './pages/Business';
import WriteReview from './pages/WriteReview';
import RegisterBusiness from './pages/RegisterBusiness';
import Businesses from './pages/Businesses';
import Search from './pages/Search';

import APIService from './services/APIService';

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      APIService.shared().isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class App extends Component {
  render() {
    return (
      <Router>
        <ScrollToTop>
          <div className='root-wrapper'>
            <div className='page-wrapper'>
              <Nav />
              <Switch>
                <Route exact path="/" component={Home} />\
                <Route path="/login" component={Login} />
                <Route path="/signup" component={SignUp} />
                <PrivateRoute path='/settings' component={Settings} />
                <Route path="/services/:name" component={Service} />
                <Route path="/profile/:username" component={Profile} />
                <PrivateRoute path='/businesses/register' component={RegisterBusiness} />
                <PrivateRoute path='/businesses/:id/review' component={WriteReview} />
                <Route path='/businesses/:id' component={Business} />
                <PrivateRoute path='/businesses' component={Businesses} />
                <Route path='/search' component={Search} />
                <Redirect to='/' />
              </Switch>
            </div>
            <Footer />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;