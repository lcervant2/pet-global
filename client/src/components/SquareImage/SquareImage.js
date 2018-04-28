import React, { Component } from 'react';
import './SquareImage.css';

class SquareImage extends Component {

  render() {
    const { src, ...rest } = this.props;

    return (
      <div {...rest}>
        <div className='square-image'>
          <div style={{backgroundImage: `url(${src})`}} />
        </div>
      </div>
    );
  }

}

export default SquareImage;