import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { CommonActions } from '@react-navigation/native';
import { createLocation, deleteLocation, getAllLocation, getUser } from './utility/ApiWrapper';
import PathInfo from './PathInfo';

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
    start_duration: 0,
    modalVisible: false,
    selectedPath: -1,
    isLoading: true,
    currPathCoord: "",
    netid: props.route.params.netid,
    infected: this.props.route.params.infected,
    myPath: false,
    selectedPathNetid: ""
   };

   this.goToUser = this.goToUser.bind(this)
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

      result = await getUser(this.state.netid);
      risk_lvl = "unknown"
      if (result.type == "LOGIN_SUCCESSFUL") {
          risk_lvl = result.response.data.result.infected == "true" ? "high" : "low";
      }
      console.log(this.state.infected)
      response = await createLocation(
                  allCoord,
                  this.state.netid,
                  risk_lvl,
                  "Walk",
                  allDurations);
      console.log(response);

      // adding to past Routes state TODO MAY REMOVE ONCE DATABASE IS DONE

      this.setState({
        isTracking: false,
        routeCoordinates: [],
        pastRoutes: pastRoutes.concat([{"netid" : this.state.netid,
                                        "route" : routeCoordinates, 
                                        "risk"  : risk_lvl,
                                        "duration" : duration.concat([new Date().getTime() - start_duration])}]),
        duration: []
      });
    }
  }

  async componentDidMount() {
    console.log(this.state.netid)
    let allLocation = await getAllLocation()
    if (allLocation.type == "GET_SUCCESSFUL") {
      // console.log(allLocation.response.data.result.result)
      this.setState({pastRoutes: allLocation.response.data.result.result})
    }
    this.setState({isLoading: false})
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
            this.setState({
              routeCoordinates: routeCoordinates.concat([newCoordinate]),
              duration: duration.concat([new Date().getTime() - start_duration]),
              start_duration: new Date().getTime()
            });
          }
        }

      }
    );
    try {
      setInterval(async () => {
        let updatedLocation = await getAllLocation()
        if (updatedLocation.type == "GET_SUCCESSFUL") {
          // console.log(updatedLocation.response.data.result.result)
          this.setState({pastRoutes: updatedLocation.response.data.result.result})
        }
      }, 30000);
    } catch(e) {
      console.log(e);
    }
  }
  
  followUser = () => {
    if (this.state.isTracking) {
      // TODO make smooth
      this.state.mapRef.current.animateToRegion(this.getMapRegion(), 1);
    }
  }

  goToUser() {
    this.props.navigation.dispatch(
      CommonActions.navigate('User', {
        netid: this.state.netid,
      })
    )
  }

  pressPath = (id) => {
    const { pastRoutes } = this.state;
    allCoord = pastRoutes[id]["route"].map(coord => {
        return coord.latitude + "," + coord.longitude;
      }).join("|");
    isMyPath = pastRoutes[id]["netid"] == this.state.netid
    selectedNetid = pastRoutes[id]["netid"]
    // console.log(pastRoutes)
    console.log(allCoord);
    this.setState({
      modalVisible : true,
      selectedPath: id,
      currPathCoord: allCoord,
      myPath: isMyPath,
      selectedPathNetid: selectedNetid
    });
  }

  deletePath = async () => {
    // TODO add delete path from database here
    const { pastRoutes, selectedPath, currPathCoord } = this.state;
    response = await deleteLocation(currPathCoord, this.state.netid);
    console.log(response);

    pastRoutes.splice(selectedPath, 1);

    this.setState({
      modalVisible : false,
      selectedPath: -1,
      pastRoutes: pastRoutes,
      currPathCoord: ""
    });
  }

  exitModal = () => {
    this.setState({
      modalVisible : false,
      selectedPath: -1,
      currPathCoord: ""
    });
  }

  drawPath = () => {
    if (this.state.routeCoordinates.length != 0) {
      return <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} lineJoin={"miter"} strokeColor={ "black" }/>;
    }
  }

  render() {
    if (this.state.isLoading) {
      return (<ActivityIndicator />)
    } else {
      return (
        <View style={styles.container}>


          <PathInfo deletePath={ this.deletePath } modalVisible={ this.state.modalVisible } netid={ this.state.selectedPathNetid } myPath={this.state.myPath}
                        currPathCoord={ this.state.currPathCoord } exitModal={this.exitModal} navigation={ this.props.navigation }/>

          <MapView ref={this.state.mapRef} provider={PROVIDER_GOOGLE} style={{ ...StyleSheet.absoluteFillObject }} initialRegion={this.getMapRegion()}
                          showsUserLocation={true} showsMyLocationButton={true} onUserLocationChange={this.followUser}>
              { this.state.pastRoutes.map((prop, id) => {
                if (prop["netid"] == this.state.netid) {
                  return <Polyline key={id} coordinates={prop["route"]} strokeWidth={3} lineJoin={"miter"} tappable={ true }
                  strokeColor={ "black" } onPress={ () => this.pressPath(id) }/>
                } else if (prop["risk"] == 'high') {
                  return <Polyline key={id} coordinates={prop["route"]} strokeWidth={3} lineJoin={"miter"} tappable={ true }
                              strokeColor={ "red" } onPress={ () => this.pressPath(id) }/>
                } else if (prop["risk"] == 'low') {
                  return <Polyline key={id} coordinates={prop["route"]} strokeWidth={3} lineJoin={"miter"} tappable={ true }
                              strokeColor={ "#50a100" } onPress={ () => this.pressPath(id) }/>
                } else {
                  return <Polyline key={id} coordinates={prop["route"]} strokeWidth={3} lineJoin={"miter"} tappable={ true }
                              strokeColor={ "yellow" } onPress={ () => this.pressPath(id) }/>
                }
              })}
              { this.drawPath() }
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