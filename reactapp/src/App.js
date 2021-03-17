import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import "./App.css"

import Login from './components/Login';
import Quizz from './components/Quizz';
import QuizzOptionnal from './components/QuizzOptionnal';
import QuizzAvatar from './components/QuizzAvatar'
import Home from './components/Home';
import Messages from './components/Messages';
import Profil from './components/Profil';

import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

import token from './reducers/token';


function App() {
  
  const store = createStore(combineReducers({token}));
  
  return (
    <Provider store={store}>
      <Router>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/quizz" component={Quizz}/>
        <Route path="/quizzOptionnal/:id" component={QuizzOptionnal}/>
        <Route path="/quizzAvatar/:id" component={QuizzAvatar}/>
        <Route path="/home" component={Home}/>
        <Route path="/messages" component={Messages}/>
        <Route path="/profil" component={Profil}/>
      </Switch>
      </Router>
    </Provider>
  );
}

export default App;