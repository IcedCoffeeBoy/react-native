import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, ScrollView, Button, Alert } from 'react-native';
import * as firebase from "firebase";
import Firebase from "../../firebase/Firebase";
import { TextField } from 'react-native-material-textfield';
import { StackNavigator, NavigationActions } from 'react-navigation';

export default class SignupEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            title: this.props.navigation.state.params.title,
            eventId: this.props.navigation.state.params.eventId,
            date: this.props.navigation.state.params.date,
            mobileNo: "",
            email: "",
            addInfo: ""
        };
        this.isPressed = false;
        this._loading();
    };

    _loading() {
        let userPath = "/users/" + firebase.auth().currentUser.uid + "/info";
        firebase.database().ref(userPath).once('value').then(
            (userData) => {
                this.setState({
                    username: userData.val().name,
                    mobileNo: userData.val().mobileNo,
                    email: userData.val().email
                });
            });
    };

    static navigationOptions = {
        title: "Sign for Event",
        headerStyle: { backgroundColor: '#ffcc00' },
    }

    async _signup() {
        if (!this.isPressed) {
            this.isPressed = true;
            if (this.checkValidEntry()) {
                var eventPath = "/event/" + this.state.eventId + "/users/" + firebase.auth().currentUser.uid;
                var userPath = "/users/" + firebase.auth().currentUser.uid + "/events/" + this.state.eventId;
                try {
                    await firebase.database().ref(eventPath).set({
                        name: this.state.username,
                        mobileNo: this.state.mobileNo,
                        email: this.state.email,
                        addInfo: this.state.addInfo,
                    }).then(
                        () => firebase.database().ref(userPath).update({
                            eventId: this.state.eventId
                        })
                        );
                    this.isPressed = false;
                    Alert.alert("Proffer", "Sucessfully signed up!",
                        [{ text: "ok", onPress: () => this.loginMain() }])
                }
                catch (error) {
                    alert(error.toString())
                    this.isPressed = false;
                }
            }
        }
    }

    checkValidEntry = () => {
        // Checks all the text fields and ensures that their inputs are valid
        // Test mobile number within 8... to 9...
        let result = this.state.mobileNo >= 80000000 && this.state.mobileNo <= 99999999;
        if (!result) {
            Alert.alert("Error", "Please enter a valid mobile number.");
            return false;
        }
        // Test preferred email to ensure that it is either blank or valid email form
        result = this.state.email === "" || /[^\s@]+@[^\s@]+\.[^\s@]+/.test(this.state.email);
        if (!result) {
            Alert.alert("Error", "Please enter a valid preferred email or leave it blank to use your NUS email.");
            return false;
        }
        // Return true if all conditions pass
        return true;
    }

    loginMain() {
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

    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                        <View style={{ alignItems: 'stretch' }}>
                            <Text style={styles.name}> Name: {this.state.username} </Text>
                            <View style={{ flex: 1, alignItems: 'stretch' }}>
                                <TextField
                                    label="Mobile No."
                                    value={this.state.mobileNo}
                                    onChangeText={(text) => this.setState({ mobileNo: text })}
                                />
                                <TextField
                                    label="Prefered Email"
                                    keyboardType={'email-address'}
                                    value={this.state.email}
                                    onChangeText={(text) => this.setState({ email: text })}
                                />
                                <Text style={styles.addInfo}> Additional information: </Text>
                                <View style={{ flex: 1, backgroundColor: '#D0D3D4', margin: 10, borderWidth: 0.5, borderColor: 'black' }}>
                                    <TextInput
                                        value={this.state.addInfo}
                                        multiline={true}
                                        numberOfLines={9}
                                        onChangeText={(text) => this.setState({ addInfo: text })}
                                        style={{ textAlignVertical: 'top' }}
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>

                        </View>
                    </KeyboardAvoidingView>
                </View>
                <Button
                    title='Sign Up for event'
                    color='blue'
                    onPress={() => this._signup()}
                />
            </ScrollView>

        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        height: '100%',

    },
    name: {
        fontSize: 20,
        textAlign: 'left',
    },

    addInfo: {
        fontSize: 15,
        fontFamily: 'Roboto',
        marginTop: 10,
    }
});