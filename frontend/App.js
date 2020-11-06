import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";



// hardcoded to start in UIUC
const LATITUDE = 40.1020;
const LONGITUDE = -88.2272;
// the size of the region displayed
const LAT_VIEW_DELTA = 0.009;
const LNG_VIEW_DELTA = 0.009;

// the delta before we update their position
// CAN BE CHANGED WITH TESTING
const LATITUDE_DELTA  = 0.0001;
const LONGITUDE_DELTA = 0.0001;

class Path extends React.Component {


  // tracking: boolean to indicate whether to start tracking or not
  // routeCoordinates: array of coordinates the person has been to
  // duration: array of ints the person has spent at the coordinates
  // zip them together to combine
  constructor(props) {
   super(props);
   this.state = {
    tracking: false,
    latitude: LATITUDE,
    longitude: LONGITUDE,
    error: null,
    routeCoordinates: [],
    duration: []
   };
  }

  getMapRegion = () => ({
   latitude: this.state.latitude,
   longitude: this.state.longitude,
   latitudeDelta: LAT_VIEW_DELTA,
   longitudeDelta: LNG_VIEW_DELTA
  });

  setTracking = () => {
    console.log(this.state);
    const { latitude, longitude } = this.state;
    this.setState({
      tracking: true,
      routeCoordinates: [ {latitude, longitude } ],
      duration: []
    });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      // only runs once
      position => {
        // console.log(this.state);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 }
    );

    navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const { routeCoordinates } = this.state;

        if ((Math.abs(latitude - this.state.latitude) > LATITUDE_DELTA || Math.abs(longitude - this.state.longitude) > LONGITUDE_DELTA)) {
          const newCoordinate = {  latitude,  longitude  };
          this.setState({
            latitude,
            longitude,
          });
          if (this.state.tracking) {
            this.setState({
              routeCoordinates: routeCoordinates.concat([newCoordinate])
            });
          }
        }

      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView provider={PROVIDER_GOOGLE} style={{ ...StyleSheet.absoluteFillObject }} region={this.getMapRegion()}>
            <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
            <Marker coordinate={this.getMapRegion()} />
        </MapView>

        <Button 
          title="Start Tracking"
          onPress={ this.setTracking }/>
      </View>
    );  
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default Path;