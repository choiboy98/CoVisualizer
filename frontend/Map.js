import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { CommonActions } from '@react-navigation/native';

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

class Map extends React.Component {


  // TODO if adding date, look into combining pastDuration, pastRoutes, and date into one array of objects
  // isTracking: boolean to indicate whether to start isTracking or not
  // routeCoordinates: array of coordinates the person has been to
  // duration: array of ints the person has spent at the coordinates
  // zip them together to combine
  // start_duration: the time that the person entered a new coord
  constructor(props) {
   super(props);
   this.state = {
    mapRef: React.createRef(),
    isTracking: false,
    latitude: LATITUDE,
    longitude: LONGITUDE,
    routeCoordinates: [],
    duration: [],
    pastRoutes: [],
    pastDuration: [],
    start_duration: 0,
   };

   this.goToUser = this.goToUser.bind(this)
  }


  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LAT_VIEW_DELTA,
    longitudeDelta: LNG_VIEW_DELTA
  });

  setTracking = () => {
    const { latitude, longitude, pastRoutes, routeCoordinates, duration, pastDuration, start_duration} = this.state;
    console.log("easter egg");
    // console.log(this.state)
    if (!this.state.isTracking) {
      this.setState({
        isTracking: true,
        routeCoordinates: [ {latitude, longitude } ],
        start_duration: new Date().getTime()
      });
    } else {
      this.setState({
        isTracking: false,
        routeCoordinates: [],
        pastRoutes: pastRoutes.concat([routeCoordinates]),
        duration: [],
        pastDuration: pastDuration.concat([duration.concat([new Date().getTime() - start_duration])])
      });
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      // only runs once
      position => {
        // console.log(this.state);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 }
    );

    navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const { routeCoordinates, duration, start_duration} = this.state;

        if ((Math.abs(latitude - this.state.latitude) > LATITUDE_DELTA || Math.abs(longitude - this.state.longitude) > LONGITUDE_DELTA)) {
          const newCoordinate = {  latitude,  longitude  };
          this.setState({
            latitude,
            longitude,
          });
          if (this.state.isTracking) {
            curr_time = new Date().getTime();
            this.setState({
              routeCoordinates: routeCoordinates.concat([newCoordinate]),
              duration: duration.concat([curr_time - start_duration]),
              start_duration: curr_time
            });
          }
        }

      }
    );
  }

  followUser = () => {
    if (this.state.isTracking) {
      // TODO make smooth
      this.state.mapRef.current.animateToRegion(this.getMapRegion(), 1);
    }
  }

  goToUser() {
    this.props.navigation.dispatch(
      CommonActions.navigate({
        name: 'User',
      })
    )
  }

  render() {


    return (
      <View style={styles.container}>
        <MapView ref={this.state.mapRef} provider={PROVIDER_GOOGLE} style={{ ...StyleSheet.absoluteFillObject }} initialRegion={this.getMapRegion()}
                        showsUserLocation={true} showsMyLocationButton={true} onUserLocationChange={this.followUser}>
            { this.state.pastRoutes.map((prop, key) => {
              return <Polyline key={key} coordinates={prop} strokeWidth={3} lineJoin={"miter"} tappable={true}
                            strokeColor={ "red" }/>
            })}
            <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} lineJoin={"miter"} strokeColor={ "red" }/>
        </MapView>

        <TouchableOpacity style = {styles.toggleTrackingBtn} onPress={this.setTracking} >
          <Text>{ this.state.isTracking ? "Turn Off Tracking" : "Turn On Tracking" }</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.toggleUserBtn} onPress={this.goToUser } >
          <Text>User</Text>
        </TouchableOpacity>
      </View>
    );  
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E84A27',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTrackingBtn : {
    position: 'absolute',
    right: 30,
    top: 50,
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    fontSize: 30,
    fontWeight: "bold"
  },
  toggleUserBtn : {
    position: 'absolute',
    left: 30,
    top: 50,
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    fontSize: 30,
    fontWeight: "bold"
  }
});


export default Map;