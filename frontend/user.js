import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { updateUser, login } from './utility/ApiWrapper'
import { CommonActions } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native'

export default class UserScreen extends React.Component {
    constructor(props) {
        super(props)

        netid = this.props.route.params.netid;
        this.state = {
            phone: "N/A",
            isOn: false,
            netid: netid,
            email: "N/A",
            name: "N/A"
        }
        this.updateInfected = this.updateInfected.bind(this);
    }

    async componentDidMount() {
        result = await login(this.state.netid);
        if (result.type == "LOGIN_SUCCESSFUL") {
            data = result.response.data.result;
            console.log(data)
            this.setState({
                phone: data.phone,
                isOn: data.infected == "true" ? true : false,
                email: data.email,
                name: data.name
            });
        }
    }

    async updateInfected() {
        console.log(this.state.isOn)
        this.setState({isOn: !this.state.isOn})
        console.log(this.state.isOn)
        result = await updateUser(this.state.netid, !this.state.isOn + "");
        console.log(result)
    }

    render() {
        //Get username from backend and set it to variable username
        //Get email from backend and set it to variable email
        return (
            <View style={styles.container}>
              <Text style = {styles.initText}>Name: { this.state.name }</Text>
              <Text style = {styles.initText}>NetId: { this.state.netid }</Text>
              <Text style = {styles.initText}>Email: { this.state.email }</Text>
              <Text style = {styles.initText}>Phone: { this.state.phone }</Text>
              
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