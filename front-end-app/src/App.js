import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import MapSearch from './components/MapSearch';

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={MapSearch}/>
      </div>
    )
  }
}

export default App;
