import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import * as firebase from "firebase";
import Firebase from "../../firebase/Firebase";
import { TextField } from 'react-native-material-textfield';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler'
import RNFetchBlob from 'react-native-fetch-blob';

const userDefaultImage = require('../../images/blankprofilepicture.png');

export default class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            name: "",
            mobileNo: "",
            email: "",
            showAdminBtn: false,
            imgSrc: userDefaultImage,
            changedImage: false,
        }
        this._loading();
    }

    async _loading() {
        let userPath = "/users/" + firebase.auth().currentUser.uid + "/info";
        ImageHandler.getUserProfilePic()
            .then((url) => {
                this.setState({ imgSrc: { uri: url } });
            })
        await firebase.database().ref(userPath).once('value').then(
            (userData) => {
                let email = userData.val().email === undefined ? "" : userData.val().email
                this.setState({
                    name: userData.val().name,
                    mobileNo: userData.val().mobileNo,
                    showAdminBtn: !userData.val().admin,
                    email: email,
                });
            });
        this.setState({ isLoading: false })
    }

    static navigationOptions = {
        title: 'Profile Page',
        headerStyle: { backgroundColor: '#ffcc00' },
    };

    async _updateProfile() {
        if (this.checkValidEntry()) {
            let userPath = "/users/" + firebase.auth().currentUser.uid + "/info";
            try {
                await firebase.database().ref(userPath).update({
                    name: this.state.name,
                    mobileNo: this.state.mobileNo,
                    email: this.state.email,
                });
                if (this.state.changedImage) {
                    ImageHandler.uploadImage(this.state.imgSrc.uri);
                }
                Alert.alert("Proffer", "Sucessfully updated profile!",
                    [{ text: "ok", onPress: () => this.props.navigation.goBack() }])
            }
            catch (error) {
                alert(error.toString())
            }
        }
    }

    getImg = () => {
        ImageHandler.getImage()
            .then((uri) => {
                this.setState({ imgSrc: { uri }, changedImage: true });
            })
    }

    checkValidEntry = () => {
        if (!/^[a-zA-Z\s]*$/.test(this.state.name) && this.state.name.length != 0) {
            Alert.alert("Proffer", "Please enter a valid name.");
            return false;
        } else if (!(this.state.mobileNo >= 8000000 && this.state.mobileNo <= 99999999)) {
            Alert.alert("Proffer", "Please enter a valid mobile number.")
            return false;
        } else if (this.state.email === "") {
            return true
        } else if (!(/[^\s@]+@[^\s@]+\.[^\s@]+/.test(this.state.email))) {
            Alert.alert("Proffer", "Please enter a valid preferred email or leave it blank to use your NUS email.");
            return false;
        } else {
            return true;
        }
    }

    applyOrganiser = () => {
        Alert.alert("Proffer", "Are you sure you want to be an organiser? Organisers can create and manage events, but cannot join any events!",
            [{
                text: 'Yes',
                onPress: this.applyOrganiserConfirm
            }, {
                text: 'No',
                onPress: () => { }
            }]);
    }
    applyOrganiserConfirm = async () => {
        let userPath = "/users/" + firebase.auth().currentUser.uid + "/info";
        try {
            await firebase.database().ref(userPath).update({
                admin: true,
            });
            Alert.alert("Congratulations!", "You are now an organiser! Try creating some events!",
                [{ text: "ok", onPress: this.returnToMain }])
        }
        catch (error) {
            alert(error.toString())
        }
    }

    returnToMain = () => {
        this.props
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
        let adminButton = this.state.showAdminBtn ? (
            <Button
                title="apply to be an organiser"
                color='lightgray'
                onPress={this.applyOrganiser}
            />
        ) : null
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }} >
                    <TouchableWithoutFeedback
                        style={{ width: 150, height: 150, borderRadius: 75, alignSelf: 'center' }}
                        onPress={this.getImg}
                    >
                        <Image
                            style={{ width: 150, height: 150, borderRadius: 75 }}
                            source={this.state.imgSrc}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.textfieldContainer} >
                    <TextField
                        label="Name"
                        value={this.state.name}
                        onChangeText={(text) => this.setState({ name: text })}
                    />
                    <TextField
                        label="Mobile No."
                        keyboardType={'numeric'}
                        value={this.state.mobileNo}
                        onChangeText={(text) => this.setState({ mobileNo: text })}
                    />
                    <TextField
                        label="Preferred Email"
                        keyboardType={'email-address'}
                        value={this.state.email}
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                </View>
                {adminButton}
                <Button
                    title="Update profile"
                    color='blue'
                    onPress={() => this._updateProfile()}
                /> 
            </ScrollView>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
        color: 'purple',
    },
    name: {
        fontSize: 20,

    },
    textfieldContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
    }
})




