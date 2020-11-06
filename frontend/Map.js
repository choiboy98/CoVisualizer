import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import {createLocation} from './utility/ApiWrapper';



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
    modalVisible: false
   };
  }


  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LAT_VIEW_DELTA,
    longitudeDelta: LNG_VIEW_DELTA
  });

  setTracking = async () => {
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
      // add to database here
      allCoord = routeCoordinates.map(coord => {
        return coord.latitude + "," + coord.longitude;
      }).join("|");
      allDurations = duration.concat([new Date().getTime() - start_duration]).join("|");
      console.log("sending call");
      response = await createLocation(
                  allCoord,
                  "placeholder",
                  "unknown",
                  "----",
                  allDurations);
      console.log(response);

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
            // add old location to the database
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

  pressPath = (e) => {
    console.log(e.target)
    this.setState({
      modalVisible : true
    });
  }

  render() {


    return (
      <View style={styles.container}>

        <Modal animationType="fade" transparent={true} visible={this.state.modalVisible} onRequestClose={() => {this.setModalVisible(false)}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>

            </View>
          </View>
        </Modal>
        <MapView ref={this.state.mapRef} provider={PROVIDER_GOOGLE} style={{ ...StyleSheet.absoluteFillObject }} initialRegion={this.getMapRegion()}
                        showsUserLocation={true} showsMyLocationButton={true} onUserLocationChange={this.followUser}>
            { this.state.pastRoutes.map((prop, id) => {
              return <Polyline key={id} coordinates={prop} strokeWidth={3} lineJoin={"miter"} tappable={ true }
                            strokeColor={ "red" } onPress={ this.pressPath }/>
            })}
            <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} lineJoin={"miter"} strokeColor={ "red" }/>
        </MapView>


        <TouchableOpacity style = {styles.toggleTrackingBtn} onPress={this.setTracking} >
          <Text>{ this.state.isTracking ? "Turn Off Tracking" : "Turn On Tracking" }</Text>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});


export default Map;