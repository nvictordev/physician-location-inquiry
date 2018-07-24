import React, {Component} from 'react'
import axios from 'axios'

class MapSearch extends Component {
  state = {
    firstNameQuery: '',
    middleNameQuery: '',
    lastNameQuery: '',
    names: [],
    selectedName: '',
    lat: '',
    lng: '',
    map: '',
    showMarker: false,
    errorMessage: false,
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadMap(
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyAGJbp_3gN-93tizIua--RgRmjCtpB3wLw&callback=initMap'
    );
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 30.2727757, lng: -97.7522372},
      zoom: 15,
      mapTypeControl: true
    });
    this.setState({ map: map })
  }

  Marker = () => {
    let marker = new window.google.maps.Marker({
      position: { lat: parseFloat(this.state.lat), lng: parseFloat(this.state.lng) },
      title: 'Physician',
      animation: window.google.maps.Animation.DROP
    });
    if (this.state.showMarker === true) {
      this.state.map.setCenter(marker.getPosition())
      marker.setMap(this.state.map);
    } else if (this.state.showMarker === false) {
      marker.setMap(null);
    }
  } 

  getNames = (firstNameQuery, middleNameQuery, lastNameQuery) => {
    this.setState({ firstNameQuery, middleNameQuery, lastNameQuery })
    if (firstNameQuery || middleNameQuery || lastNameQuery) {
      axios.get(`http://localhost:5001/search`, 
        {params: {firstName: firstNameQuery, middleName: middleNameQuery, lastName: lastNameQuery}})
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
      .catch(e => this.setState({
        errorMessage: true,
      }))
    } else {
      this.setState({ names: [], errorMessage: false, serverError: false })
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
    } else if (nameElement.length > 2) {
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
      lastNameQuery: '',
      names: []
    })
  }

  handleClear = () => {
    this.clearState();
    this.setState({ 
      showMarker: false,
      errorMessage: false
    }, this.Marker);
  }

  handleSubmit = (firstNameQuery, middleNameQuery, lastNameQuery) => {
    if (firstNameQuery && lastNameQuery) {
      this.setState({ errorMessage: false, names: [] });
      axios.get(`http://localhost:5001/address`, 
        {params: {firstName: firstNameQuery, middleName: middleNameQuery, lastName: lastNameQuery}})
      .then(res => res.data)
      .then(addressRes => {
        let address = addressRes.street + ' ' + addressRes.city + ' ' + addressRes.state + ' ' + addressRes.zipCode;
        let encodedAddress = encodeURIComponent(address);
        this.geocodeAddress(encodedAddress);
      })
      .catch(e => this.setState({
        errorMessage: true,
        showMarker: false
      }))
    } else {
      this.setState({ errorMessage: true})
    }
  }

  geocodeAddress = (address) => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAGJbp_3gN-93tizIua--RgRmjCtpB3wLw`)
    .then(res => res.data)
    .then(location => {
      this.setState({
          lat: location.results[0].geometry.location.lat,
          lng: location.results[0].geometry.location.lng,
          showMarker: true
      }, this.Marker)
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
          <input type="submit" value='Submit' onClick={() => 
            this.handleSubmit(firstNameQuery, middleNameQuery, lastNameQuery)}/>
          <input type="reset" value='Clear' onClick={() => this.handleClear()}/>
        </div>
        <div className="Search-modal">
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
        { errorMessage && (
          <section>
            <h4>No Name/Address was found</h4>
          </section>
        )}
        <section>
          <div id="map">
            Loading Map
          </div>
        </section>
      </div>
    );
  }
}

export default MapSearch;

function loadMap(src) {
  const ref = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  script.onerror = function () {
    document.write('Error occured when loading map');
  };
  ref.parentNode.insertBefore(script, ref);
}