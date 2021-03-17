import React from 'react';

import Nav from './Nav'

function Messages() {

  return (
      <div>
          <Nav selected="msg"/>
          <div className="centerColumn">
            <div className="container">
                <p>Messages</p>
            </div>
          </div>
      </div>
  );
}

export default Messages;
