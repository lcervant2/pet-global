import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SpacedSegment.css';

class SpacedSegment extends Component {

  render() {
    const { children, spacing, padding, style, ...rest } = this.props;

    return (
      <div style={{ margin: `0 0 calc(${spacing} * 0.5em) 0`, padding: `calc(${padding} * 0.5em)`, ...style }} {...rest}>
        {children}
      </div>
    );
  }

}

SpacedSegment.propTypes = {
  spacing: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  padding: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
};

SpacedSegment.defaultProps = {
  children: (<div></div>),
  spacing: 2,
  padding: 0
};

export default SpacedSegment;