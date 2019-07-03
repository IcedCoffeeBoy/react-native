import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, FlatList, Alert, Modal } from 'react-native';
import firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler';
import UserListItem from './UserListItem';
import { NavigationActions } from 'react-navigation';

// Navigation Props passed to this screen: eventId

const userDefaultImage = require('../../images/blankprofilepicture.png');

export default class OrganiserViewSignedUps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.navigation.state.params.eventId,
            data: [],
            isLoading: true,
        }
        this.getEventUserList()
    }

    static navigationOptions = {
        title: 'View Signed Up users',
        headerStyle: { backgroundColor: '#ffcc00' },
    };

    getEventUserList = () => {
        let eventUserPath = "/event/" + this.state.eventId + "/users";
        let promises = [];
        firebase.database().ref(eventUserPath).once('value')
            .then((snapshot) => {
                snapshot.forEach((child) => {
                    this.getUserInfo(child.val(), child.key)
                        .then((userObj) => {
                            this.setState({ data: [...this.state.data, userObj] })
                        })
                })
            });
    }

    getUserInfo = (info, key) => {
        return new Promise((resolve, reject) => {
            // Get signed up info first
            let userObj = { userInfo: info }
            userObj.key = key

            ImageHandler.downloadImage("images/users/" + key + "/profile")
                .then((url) => {
                    userObj.imgSrc = { uri: url }
                    resolve(userObj)
                })
                .catch((error) => {
                    userObj.imgSrc = { uri: "" }
                    resolve(userObj)
                })
        })
    }

    _renderItem = ({ item }) => {
        return (
            <UserListItem
                userInfo={item.userInfo}
                imgSrc={item.imgSrc}
            />
        )
    };

    _keyExtractor = (item, index) => (item.key);

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#D0D3D4',
    },
    modal: {
        width: 80,
        height: 240
    }
});