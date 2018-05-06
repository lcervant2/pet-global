import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Input.scss';

import ImageSquare from '../Square/Square';
import Button from '../../Button/Button';
import VerticalCenter from '../../VerticalCenter/VerticalCenter';
import Loader from '../../Loader/Loader';

class ImageInput extends Component {

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.openFileInput = this.openFileInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteImage = this.deleteImage.bind(this);

    this.state = {
      file: null,
      preview: null,
      showOptions: false
    };
  }

  componentWillMount() {
    this.setState({
      file: this.props.file,
      preview: this.props.preview
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      file: this.props.file,
      preview: newProps.preview
    });
  }

  openFileInput(e) {
    e.preventDefault();

    this.inputNode.click();
  }

  handleChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          file: file,
          preview: reader.result
        });
        this.props.onChange(this.props.name, {
          file: file,
          preview: reader.result
        });
      };

      reader.readAsDataURL(file);
    }
  }

  onMouseEnter() {
    this.setState({
      showOptions: true
    });
  }

  onMouseLeave() {
    this.setState({
      showOptions: false
    });
  }

  deleteImage(e) {
    this.setState({
      file: null,
      preview: null,
      showOptions: false
    });

    this.props.onChange(this.props.name, null);
  }

  render() {
    const { preview } = this.state;
    const { className, loading } = this.props;

    return (
      <div className={className}>
        <div className='image-input'>
          {preview ? (
            <div className='image-input__preview' onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
              <ImageSquare src={preview} />
              <div className='image-input__options' style={{ display: this.state.showOptions ? 'block' : 'none' }}>
                <Button icon='trash' onClick={this.deleteImage} />
              </div>
            </div>
          ) : (
            <div className='image-input__input'>
              <input ref={node => this.inputNode = node} type='file' onChange={this.handleChange} />
              <Button icon='plus' block onClick={this.openFileInput} />
            </div>
          )}
          {loading &&
          <div className='image-input__loader'>
            <VerticalCenter>
              <Loader />
            </VerticalCenter>
          </div>
          }
        </div>
      </div>
    );
  }

}

ImageInput.propTypes = {
  name: PropTypes.string,
  loading: PropTypes.bool,
  onChange: PropTypes.func
};

ImageInput.defaultProps = {
  loading: false
};

export default ImageInput;