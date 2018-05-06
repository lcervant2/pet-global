import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Service from './pages/Service';
import Settings from './pages/Settings';
import Business from './pages/Business';
import EditReview from './pages/EditReview';
import EditBusiness from './pages/EditBusiness';
import Search from './pages/Search';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Terms from './pages/Terms';
import BusinessServices from './pages/BusinessServices';

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

  constructor(props) {
    super(props);

    this.state = {
      headerHeight: 0
    };
  }

  componentDidMount() {
    const headerHeight = this.headerNode.clientHeight;
    this.setState({ headerHeight });
  }

  render() {
    let headerHeight = 0;
    if (this.headerNode)
      headerHeight = this.headerNode.clientHeight;

    return (
      <Router>
        <ScrollToTop>
          <div ref={node => this.headerNode = node} className='header-wrapper'>
            <Header />
          </div>
          <div style={{ marginTop: headerHeight }}>
            <Switch>
              <Route exact path="/" component={Home} />\
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route path='/about' component={About} />
              <Route path='/terms' component={Terms} />
              <Route path='/password/forgot' component={ForgotPassword} />
              <Route path='/password/reset' component={ResetPassword} />
              <PrivateRoute path='/settings' component={Settings} />
              <Route path="/services/:name" component={Service} />
              <Route path='/services' component={BusinessServices} />
              <Route path="/profile/:username" component={Profile} />
              <PrivateRoute path='/businesses/register' component={EditBusiness} />
              <PrivateRoute path='/businesses/:businessId/edit' component={EditBusiness} />
              <PrivateRoute path='/businesses/:businessId/review' component={EditReview} />
              <Route path='/businesses' component={Business} />
              <PrivateRoute path='/reviews/:reviewId/edit' component={EditReview} />
              <Route path='/search' render={props => <Search {...props} headerHeight={headerHeight} />} />
            </Switch>
          </div>
          <Switch>
            <Route path='/search' render={props => <div></div>} />
            <Route path='/' component={Footer} />
          </Switch>
        </ScrollToTop>
      </Router>
    );
  }

}

export default App;