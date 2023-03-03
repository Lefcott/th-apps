/** @format */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import placeholder from '../assets/images/placeholder.svg';

export default class Thumbnail extends Component {
  static propTypes = {
    src: PropTypes.string,
    style: PropTypes.object,
  };

  addDefaultSrc = (ev) => {
    ev.target.src = placeholder;
    ev.target.style.width = '100%';
  };

  render() {
    const { src, style } = this.props;
    return (
      <img
        src={src || placeholder}
        style={style}
        onError={this.addDefaultSrc}
        alt="thumbnail"
      />
    );
  }
}
