import React from 'react';
import classNames from 'classnames';
import './Message.scss';

const Message = ({ className, title, content, success, error }) => {
  const inputClass = classNames('message', {
    'message--success': success,
    'message--error': error
  }, className);

  const titleClass = classNames('message__title');
  const contentClass = classNames('message__content');

  return (
    <div className={inputClass}>
      {title && <div className={titleClass}>{title}</div>}
      {content && <div className={contentClass}>{content}</div>}
    </div>
  );
};

export default Message;