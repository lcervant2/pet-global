import React, { Component } from 'react';
import classNames from 'classnames';
import './Dropdown.scss';

import Icon from '../../Icon/Icon';
import MenuDropdownContent from './Content/Content';

class MenuDropdown extends Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.node = null;
    this.contentNode = null;

    this.state = {
      showing: false
    };
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      this.setState({
        showing: !this.state.showing
      });

      return;
    }

    setTimeout(() => {
      this.setState({
        showing: false
      });
    }, 100);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  render() {
    let { children, className } = this.props;

    const inputClass = classNames('menu__dropdown', {
      'menu__dropdown--showing': this.state.showing
    }, className);

    // grab the content
    let content = null;
    React.Children.forEach(children, child => {
      if (child.type && child.type.displayName === 'MenuDropdownContent') {
        content = child;
      }
    });

    // remove the content
    children = children.filter(child => child !== content);

    const displayClass = classNames('menu__dropdown__display', {
      'menu__dropdown__display--showing': this.state.showing
    });

    return (
      <div className={inputClass}>
        <div ref={node => this.node = node} className={displayClass}>{children}&nbsp;&nbsp;&nbsp;<Icon name='caret-down' /></div>
        {content && <MenuDropdownContent ref={node => this.contentNode = node} {...content.props} />}
      </div>
    );
  }

}

export default MenuDropdown;