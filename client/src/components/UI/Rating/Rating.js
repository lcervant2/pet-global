import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import './Rating.scss';

import Icon from '../Icon/Icon';

class Rating extends Component {

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);

    this.state = {
      rating: 1,
      displayRating: 1
    };
  }

  componentWillMount() {
    this.setState({
      rating: this.props.rating,
      displayRating: this.props.rating
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      rating: newProps.rating,
      displayRating: newProps.rating
    });
  }

  onMouseEnter(value) {
    if (this.props.input) {
      this.setState({
        displayRating: value
      });
    }
  }

  onMouseLeave(e) {
    if (this.props.input) {
      this.setState({
        displayRating: this.state.rating
      });
    }
  }

  onClick(value) {
    if (this.props.input) {
      this.setState({
        rating: value
      });

      this.props.onChange(null, { name: this.props.name, value: value });
    }
  }

  render() {
    const { displayRating } = this.state;
    const { className, maxRating, icon, dark } = this.props;

    const inputClass = classNames('rating', {
      'rating--dark': dark
    }, className);

    const starOffClass = classNames('rating__star');
    const starOnClass = classNames(starOffClass, 'rating__star--on');

    return (
      <div className={inputClass}>
        <div style={{ display: 'inline-block' }} onMouseLeave={this.onMouseLeave}>
          {_.range(Math.round(displayRating)).map(index => (
            <Icon key={index} name={icon} className={starOnClass} onMouseEnter={() => this.onMouseEnter(index + 1)} onClick={() => this.onClick(index + 1)} />
          ))}
          {_.range(Math.round(maxRating) - Math.round(displayRating)).map(index => (
            <Icon key={index + Math.round(displayRating)} name={icon} className={starOffClass} onMouseEnter={() => this.onMouseEnter(index + Math.round(displayRating) + 1)} onClick={() => this.onClick(index + Math.round(displayRating) + 1)} />
          ))}
        </div>
      </div>
    );
  }

}

Rating.propTypes = {
  rating: PropTypes.number,
  maxRating: PropTypes.number,
  icon: PropTypes.string
};

Rating.defaultProps = {
  rating: 3,
  maxRating: 5,
  icon: 'star'
};

export default Rating;