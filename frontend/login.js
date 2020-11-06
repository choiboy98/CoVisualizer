import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { login, createUser } from './utility/ApiWrapper'
import { CommonActions } from '@react-navigation/native';


export default class LoginScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: ""
        }
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }
    static navigationOptions = {
        title: 'Login',
    };

    async login() {
        console.log(this.state.email)
        result = await login(this.state.email);
        console.log(result);
        this.props.navigation.dispatch(
            CommonActions.navigate({
              name: 'Map',
            })
          );
    }

    async register() {
        console.log(this.state.email)
        result = await createUser(this.state.email, this.state.email, this.state.email, this.state.email, "False");
        console.log(result);
        this.props.navigation.dispatch(
            CommonActions.navigate({
              name: 'Map',
            })
          );
    }

    render() {
        return (
            <View style={styles.container}>
              <Text style = {styles.initText}>Login to CoVisualizer!</Text>
              <TextInput 
                style = {styles.input}
                placeholder = "Username"
                value={this.state.email} 
                onChangeText={(text) => this.setState({ email: text})}
              />
              <TextInput 
                style = {styles.input}
                placeholder = "Password"
                secureTextEntry
                value={this.state.password} 
                onChangeText={(text) => this.setState({ password: text})}
              />
              <View style = {styles.btnContainer}>
                <TouchableOpacity style = {styles.btns} onPress={this.login}><Text style = {styles.btnText}>Login</Text></TouchableOpacity>
                <TouchableOpacity style = {styles.btns} onPress={this.register}><Text style = {styles.btnText}>Register</Text></TouchableOpacity>
              </View>
              <StatusBar style="auto" />
            </View>
          );
    }

    checkLogin = () => {
        const { navigate } = this.props.navigation;
        if(username == "user" && password == "pass"){
            navigate('Home')
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