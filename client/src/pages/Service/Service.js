import React, { Component } from 'react';
import './Service.scss';

import ServiceResults from '../../components/ServiceResults/ServiceResults';

class Service extends Component {

  componentWillMount() {
    const { name } = this.props.match.params;
    this.props.history.push('/search?serviceCategories[0]=' + name);
  }

  render() {
    const { name } = this.props.match.params;

    return (
      <div className='service-page'>
        <ServiceResults serviceName={name} />
      </div>
    );
  }

}

export default Service;