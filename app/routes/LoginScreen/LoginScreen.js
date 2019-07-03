import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  AsyncStorage,
  Alert,
  TouchableHighlight,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { NavigationActions } from 'react-navigation';
import * as firebase from "firebase";
import Firebase from "../../firebase/Firebase";
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false
    }
    Firebase.initialise();
  }

  //Load for existing email and password
  componentDidMount = () => {
    AsyncStorage.getItem('email').then((value) => {
      this.setState({ email: value });
    });
    AsyncStorage.getItem('password').then((value) => {
      this.setState({ password: value });
    });
  }

  static navigationOptions = {
    header: null
  };

  // Login function
  loginMain = () => {
    return this.props
      .navigation
      .dispatch(NavigationActions.reset(
        {
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Event' })
          ]
        }));
  }

  login = async () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
      try {
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
        //Stores Email and password upon successful login 
        AsyncStorage.setItem('email', this.state.email);
        AsyncStorage.setItem('password', this.state.password);

        if (firebase.auth().currentUser.emailVerified) {
          this.loginMain()
        }
        else {
          this.setState({ isLoading: false })
          Alert.alert("Proffer", "Email not verified \nKindly verify your NUS email.", [
            {
              text: "Resend confirmation email",
              onPress: this.resendEmailVerification
            },
            { text: "ok" },
          ])
        }
      } catch (error) {
        this.setState({ isLoading: false })
        alert(error.toString())
      }
    }
  }

  resendEmailVerification = () => {
    firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        Alert.alert("Proffer", "Verification email sent.")
      })
      .catch((error) => {
        Alert.alert("Proffer", "Error sending verification email.")
      })
  }

  render() {
    return (

      <Image
        style={styles.imgcontainer}
        source={require('../../images/bluebackground1.png')}
      >
        <View style={styles.container}>
          <Text style={styles.welcome}>
            proffer
          </Text>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              style={{ width: 100, height: 100 }}
              source={require('../../images/handshake.png')}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextField
              baseColor='white'
              textColor='white'
              fontSize={18}
              label='NUS Email'
              value={this.state.email}
              onChangeText={(text) => this.setState({ email: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextField
              baseColor='white'
              textColor='white'
              fontSize={18}
              label='Password'
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>
          <TouchableHighlight style={styles.rounded} onPress={() => this.login()}>
            <View>
              <Text style={{ textAlign: 'center', fontSize: 20, color: 'black' }}> Login </Text>
            </View>
          </TouchableHighlight>

          <View style={{ alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Register')}>
              <View style={styles.signup}>
                <Text style={{ alignItems: 'center', textDecorationLine: 'underline', fontSize: 20, color: 'white' }}>
                  Sign up
              </Text>
                <Spinner visible={this.state.isLoading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <Text style={styles.instructions}>
            Register using NUS email{'\n'}
            Proffer is an app for you to help others
        </Text>
        </View >
      </Image>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    color: '#ffcc00',
    fontFamily: 'monospace',
    textShadowOffset: { width: 4, height: 4 }
  },
  rounded: {
    height: 40,
    borderRadius: 20,
    margin: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#ffcc00',
  },
  inputContainer: {
    paddingTop: -10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    margin: 5,
    backgroundColor: 'rgba(255, 255, 255,0.1)',
  },

  signup: {
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  instructions: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 5,
    marginTop: 20,
  },
  imgcontainer: {
    flex: 1,
    resizeMode: 'cover',
    width: null,
    height: null
  }
});

