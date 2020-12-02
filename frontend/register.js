import { StatusBar } from 'expo-status-bar';
// import React from 'react';
import React, { useState, Component } from "react";
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity} from 'react-native';
import { login, createUser } from './utility/ApiWrapper'
import { CommonActions } from '@react-navigation/native';


export default class RegistrationScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            name: "",
            email: "",
            password: "",
            toggle: false,
        };
        this.register = this.register.bind(this)
    }

    static navigationOptions = {
        title: 'Map',
    };

    async register() {
        console.log(this.state.email)
        result = await createUser(this.state.username, this.state.name, this.state.email, this.state.password, "False");
        console.log(result);
        this.props.navigation.dispatch(
            CommonActions.navigate({
              name: 'Map',
            })
          );
    }

    // const [isEnabled, setIsEnabled] = useState(false);
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    render() {
        return (
            <View style={styles.container}>
            <Text style = {styles.initText}>Signup for CoVisualizer!</Text>
            <TextInput 
                style = {styles.input}
                placeholder = "Username"
            />
            <TextInput 
                style = {styles.input}
                placeholder = "Name"
            />
            <TextInput 
                style = {styles.input}
                placeholder = "Email"
            />
            <TextInput 
                style = {styles.input}
                placeholder = "Password"
                secureTextEntry
            />
            <Text style = {styles.switchText}>Infected?</Text>
            <View style={styles.tswitch}>
                <Switch
                    trackColor={{ false: "#00FF2A", true: "#D82020" }}
                    // thumbColor={isEnabled ? "#000000" : "#f4f3f4"}
                    thumbColor = {this.state.toggle ? "#000000" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) => this.setState({toggle: value})}
                    value={this.state.toggle}
                />
            </View>
            <Text style = {styles.switchText}>No   Yes</Text>
            <View style = {styles.btnContainer}>
                <TouchableOpacity style = {styles.btns} onPress = {this.register}><Text style = {styles.btnText}>Register</Text></TouchableOpacity>
            </View>
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
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  btns: {
    backgroundColor: "#13294B",
    padding: 15,
    width: "100%",
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  switchText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 6,
    color: "#fff",
  },
  botswitchText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 6,
    color: "#fff",
  },
  tswitch: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center"
  },
});