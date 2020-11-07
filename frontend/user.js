import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { updateUser } from './utility/ApiWrapper'
import { CommonActions } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native'

export default class UserScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            phoneNum: "",
            description: "",
            isOn: false,
            email: "Test"
        }
        this.updateInfected = this.updateInfected.bind(this);
    }

    async updateInfected() {
        console.log(this.state.isOn)
        this.setState({isOn: !this.state.isOn})
        console.log(this.state.isOn)
        result = await updateUser(this.state.email, !this.state.isOn + "");
    }

    render() {
        //Get username from backend and set it to variable username
        //Get email from backend and set it to variable email
        return (
            <View style={styles.container}>
              <Text style = {styles.initText}>Username: username goes here</Text>
              <Text style = {styles.initText}>Email: email goes here</Text>
              
              <ToggleSwitch
                isOn={this.state.isOn}
                onColor="green"
                offColor="red"
                label="Infected?"
                labelStyle={{ color: "black", fontWeight: "900" }}
                size="large"
                onToggle={this.updateInfected}
                />
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
    initText: {
        fontSize: 28,
        textAlign: 'center',
        margin: 10,
        color: "#fff",
    },
    input: {
        width: "85%",
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 10,
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },
    btns: {
        backgroundColor: "#13294B",
        padding: 15,
        width: "45%",
    },
    btnText: {
        color: "#fff",
        fontSize: 20,
        textAlign: "center",
    }

});