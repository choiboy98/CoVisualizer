import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { getLocation } from './utility/ApiWrapper';
import { CommonActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import Tags from 'react-native-tags';

class PathInfo extends React.Component {

  constructor(props) {
   super(props);
   this.state = {
   	visible: this.props.modalVisible,
    currPathCoord: this.props.currPathCoord,
    pathName: "N/A",
    netid: "N/A",
    risk: "N/A",
    fetching: false,
    myPath: this.props.myPath
   };
  }

  componentDidUpdate(prevProps) {
  	if ( prevProps.modalVisible != this.state.visible ||
          (prevProps.currPathCoord != this.state.currPathCoord && this.props.currPathCoord != "")) {
      // console.log(this.props.myPath)
      this.getPathInfo(this.props.currPathCoord, this.props.netid, this.props.modalVisible, this.props.myPath);
  	}
  }

  deletePath = () => {
    this.setState({
      visible: false,
      currPathCoord: "",
      pathName: "N/A",
      netid: "N/A",
      risk: "N/A"
    });
    this.props.deletePath();
  }

  setModalVisible = () => {
    this.setState({
      visible: false,
    });
    this.props.exitModal();
  }

  getPathInfo = async (currPathCoord, netid, modalVisible, myPath) => {
    if (modalVisible && !this.state.fetching) {
      this.setState({ fetching: true });
      let data = await getLocation(currPathCoord, netid)
      this.setState({ fetching: false });
      if (data.type == "GET_SUCCESSFUL") {
        results = data.response.data.result;
        this.setState({
          pathName: results.location_name,
          netid: results.net_id,
          risk: results.risk
        });
      } else {
        console.log("error");
        console.log(data)
      }
    }
    this.setState({
      visible: modalVisible,
      currPathCoord: currPathCoord,
      myPath: myPath
    });
  }

  tag = () => {
    this.props.navigation.dispatch(
        CommonActions.navigate('Tagging', {
        })
      );
    this.setModalVisible();
  }

	render() {
    if (this.state.myPath) {
  		return (
          <View>
  					<Modal animationType="fade" transparent={true} visible={this.state.visible} >
              <TouchableOpacity 
                style={styles.centeredView} 
                activeOpacity={1} 
                onPressOut={this.setModalVisible}
              >
                <View style={styles.modalView}>
                  <View style={styles.descriptionView}>
                    <Text>NetID: {this.state.netid}</Text>
                    <Text>Path Name: { this.state.pathName }</Text>
                    <Text>Risk: { this.state.risk }</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.tagView} onPress={this.tag}>
                    <Text>Add Tags</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style = {styles.deleteBtn} onPress={this.props.deletePath} >
                    <Text> Delete Path </Text>
                  </TouchableOpacity>
              </View>
              </TouchableOpacity>
            </Modal>
          </View>
  			)
      } else {
          return (
              <View>
                <Modal animationType="fade" transparent={true} visible={this.state.visible} >
                  <TouchableOpacity 
                    style={styles.centeredView} 
                    activeOpacity={1} 
                    onPressOut={this.setModalVisible}
                  >
                    <View style={styles.modalView}>

                      <View style={styles.descriptionView}>
                        <Text>Risk: { this.state.risk }</Text>
                      </View>
                  </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            )
        }
	}

}

const styles = StyleSheet.create({
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
  descriptionView: {
    margin: 5
  },
  tagView: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  }
});

export default PathInfo;

