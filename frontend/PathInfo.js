import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';


class PathInfo extends React.Component {

  constructor(props) {
   super(props);
   this.state = {
   	visible: this.props.modalVisible
   };
  }

  componentDidUpdate(prevProps) {
  	if (prevProps.modalVisible != this.state.visible) {
	    this.setState({
				visible: this.props.modalVisible,
				selectedPath: this.selectedPath
			});
  	}
  }

	render() {
		return (
					<Modal animationType="fade" transparent={true} visible={this.state.visible} >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity style = {styles.deleteBtn} onPress={this.props.deletePath} >
                  <Text> Delete Path </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
			)
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

