import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { login, createUser } from './utility/ApiWrapper'
import { CommonActions } from '@react-navigation/native';


export default class UserScreen extends Components {
    constructor(props) {
        super(props)

        this.state = {
            phoneNum: "",
            description: ""
        }
    }
    render() {
        //Get username from backend and set it to variable username
        //Get email from backend and set it to variable email
        return (
            <View style={styles.container}>
              <Text style = {styles.initText}>Username: username goes here</Text>
              <Text style = {styles.initText}>Email: email goes here</Text>
    
              <TextInput 
                style = {styles.input}
                placeholder = "Phone Number"
                secureTextEntry
                value={this.state.phoneNum} 
                onChangeText={(text) => this.setState({ password: text})}
              />
              <Text style = {styles.initText}>User Description:</Text>
              <TextInput 
                style = {styles.input}
                placeholder = "Write a little bit about yourself here"
                secureTextEntry
                value={this.state.phoneNum} 
                onChangeText={(text) => this.setState({ password: text})}
              />
              
              <StatusBar style="auto" />
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