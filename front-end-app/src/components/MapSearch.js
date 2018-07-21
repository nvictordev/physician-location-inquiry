import React, {Component} from 'react';
import axios from 'axios';

class MapSearch extends Component {
  state = {
    firstNameQuery: '', 
    names: [],
    errorMessage: false
  }
  componentDidMount() {
    this.getNames();
  }
  getNames = () => {
    axios.get(`http://localhost:5001/search`)
      .then(res => res.data)
      .then((contacts) => {
        this.setState({
          names: contacts.map((contact) => {
            return contact.lastName;
          })
        })
      })
  }

  render() {
    const { firstNameQuery, names, errorMessage } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Physician Location</h1>
        </header>
        <p className="App-intro">
          Find your physician's location by filling the name below:
        </p>
        <div>
          <form action='http://localhost:5001/search' methond='GET'>
            <input type="text"
              name="search"
              placeholder="First Name"
              value={firstNameQuery}
              onChange={e => this.updateSearch(e.target.value)}/>
          </form>
        </div>
        <div>
          {names}
        </div>
      </div>
    );
  }
}

export default MapSearch;