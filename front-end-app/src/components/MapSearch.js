import React, {Component} from 'react';
import axios from 'axios';

class MapSearch extends Component {
  state = {
    firstNameQuery: '',
    middleNameQuery: '',
    lastNameQuery: '',
    names: [],
    errorMessage: false
  }

  getNames = (firstNameQuery, middleNameQuery, lastNameQuery) => {
    this.setState({ firstNameQuery, middleNameQuery, lastNameQuery })
    if (firstNameQuery || middleNameQuery || lastNameQuery) {
      axios.get(`http://localhost:5001/search`, {params: {firstName: firstNameQuery, middleName: middleNameQuery, lastName: lastNameQuery}})
      .then(res => res.data)
      .then((contacts) => {
        this.setState({
          names: contacts.map((contact) => {
            if (contact.middleName) {
              return contact.firstName + ' ' + contact.middleName + ' ' + contact.lastName;
            } else {
              return contact.firstName + ' ' + contact.lastName;
            }
          })
        })
      })
    } else {
      this.setState({ names: [] })
    }
  }

  render() {
    const { firstNameQuery, middleNameQuery, lastNameQuery, names, errorMessage } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Physician Location</h1>
        </header>
        <p className="App-intro">
          Find your physician's location by filling the name below:
        </p>
        <div>
          <input type="text"
            name="firstSearch"
            placeholder="First Name"
            value={firstNameQuery}
            onChange={e => this.getNames(e.target.value, middleNameQuery, lastNameQuery)}/>
          <input type="text"
            name="middleSearch"
            placeholder="Middle Name"
            value={middleNameQuery}
            onChange={e => this.getNames(firstNameQuery, e.target.value, lastNameQuery)}/>
          <input type="text"
            name="secondSearch"
            placeholder="Last Name"
            value={lastNameQuery}
            onChange={e => this.getNames(firstNameQuery, middleNameQuery, e.target.value)}/>
        </div>
        <div>
          <ul>
            {names.map(((name, i) => {
              return (
              <li key={i}>
                {name}
              </li>
              )
            }))}
          </ul>
        </div>
      </div>
    );
  }
}

export default MapSearch;