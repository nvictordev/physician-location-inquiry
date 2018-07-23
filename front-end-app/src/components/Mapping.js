import React, { Component } from 'react'

class Mapping extends Component {
  componentDidMount() {
    window.initMap = this.initMap;
    loadMap(
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyAGJbp_3gN-93tizIua--RgRmjCtpB3wLw&callback=initMap'
    );
  }

  initMap = () => {
    let self = this;
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 30.2727757, lng: -97.7522372},
      zoom: 15,
      mapTypeControl: false
    });
  }

  render() {
    const { lat, lng } = this.props
    return (
      <div id="map">
        Loading Map....
      </div>
    )
  }
}

export default Mapping;

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