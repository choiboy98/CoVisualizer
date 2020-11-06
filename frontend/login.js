import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

export class LoginScreen extends React.Component {
    static navigationOptions = {
        title: 'Login',
    };
    render() {
        return (
            <View style={styles.container}>
              <Text style = {styles.initText}>Login to CoVisualizer!</Text>
              <TextInput 
                style = {styles.input}
                placeholder = "Username"
              />
              <TextInput 
                style = {styles.input}
                placeholder = "Password"
                secureTextEntry
              />
              <View style = {styles.btnContainer}>
                <TouchableOpacity style = {styles.btns}><Text style = {styles.btnText}>Login</Text></TouchableOpacity>
                <TouchableOpacity style = {styles.btns}><Text style = {styles.btnText}>Register</Text></TouchableOpacity>
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
}
