import React from 'react';
import './LongText.scss';

function LongText({ children }) {
  return (
    <div className="long-text" title={children}>{children}</div>
  );
}

export default LongText;

