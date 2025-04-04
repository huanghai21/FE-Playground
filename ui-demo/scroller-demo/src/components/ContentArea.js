import React from 'react';
import './ContentArea.css';

function ContentArea({ content }) {
  return (
    <div className="content-area">
      <h2>{content.title}</h2>
      {content.description.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export default ContentArea;
