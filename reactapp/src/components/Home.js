
import React from 'react';
import {connect} from 'react-redux';

import Nav from './Nav'
import { Redirect } from 'react-router';


function Home(props) {

  if(props.token){
    return (
  
      <div>
        <Nav selected="home"/>
        <div className="centerColumn">
          <div className="container">
              <p>Hello {props.token}</p>
          </div>
        </div>
      </div>
   );
  } else {
    return <Redirect to='/' />
  }

}

// export default Home;
function mapStateToProps(state) {
  return { token: state.token }
}

export default connect(
  mapStateToProps,
  null
 )(Home);