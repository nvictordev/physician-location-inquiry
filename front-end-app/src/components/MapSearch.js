import React, {Component} from 'react';
import axios from 'axios';

class MapSearch extends Component {
  state = {
    firstNameQuery: '',
    middleNameQuery: '',
    lastNameQuery: '',
    names: [],
    selectedName: '',
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

  clickedName = (name) => {
    this.clearState();
    let nameElement = name.toString().split(' ');
    if (nameElement.length === 2) {
      this.setState({
        firstNameQuery: nameElement[0],
        lastNameQuery: nameElement[1]
      })
    } else if (nameElement.length === 3) {
      this.setState({
        firstNameQuery: nameElement[0],
        middleNameQuery: nameElement[1],
        lastNameQuery: nameElement[2]
      })
    }
  }

  clearState = () => {
    this.setState({
      firstNameQuery: '',
      middleNameQuery: '',
      lastNameQuery: ''
    })
  }

  handleClear = () => {
    this.clearState();
    this.setState({ names: [] })
  }

  handleSubmit = (firstNameQuery, middleNameQuery, lastNameQuery) => {
    axios.get(`http://localhost:5001/address`, {params: {firstName: firstNameQuery, middleName: middleNameQuery, lastName: lastNameQuery}})
    .then(res => res.data)
    .then(addressRes => {
      let address = addressRes.street + ' ' + addressRes.city + ' ' + addressRes.state + ' ' + addressRes.zipCode;
      let encodedAddress = encodeURIComponent(address);
      return this.geocodeAddress(encodedAddress);
    })
  }

  geocodeAddress = (address) => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAGJbp_3gN-93tizIua--RgRmjCtpB3wLw`)
    .then(res => res.data)
    .then(location => {
      return {
        lat: location.results[0].geometry.location.lat,
        lng: location.results[0].geometry.location.lng
      }
    })
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
            name="lastSearch"
            placeholder="Last Name"
            value={lastNameQuery}
            onChange={e => this.getNames(firstNameQuery, middleNameQuery, e.target.value)}/>
          <input type="submit" value='Submit' onClick={() => this.handleSubmit(firstNameQuery, middleNameQuery, lastNameQuery)}/>
          <input type="reset" value='Clear' onClick={() => this.handleClear()}/>
        </div>
        <div>
          <ul>
            {names.map(((name, i) => {
              return (
              <li key={i} onClick={() => this.clickedName(name)}>
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