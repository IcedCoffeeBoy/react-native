import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ToolbarAndroid
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import * as firebase from "firebase";
import Firebase from "../../firebase/Firebase";
import Spinner from 'react-native-loading-spinner-overlay';
import EventList from '../../components/EventList/EventList';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler';

const eventDefaultIcon = require('../../images/eventDefaultIcon.png');

export default class UserEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: []
        };
        this.eventId = [];
        this.data = [];
        this._loading();
    }

    static navigationOptions = {
        title: 'Event Signed Up',
        headerStyle: { backgroundColor: '#ffcc00' },
    };

    async _loading() {
        let userPath = "/users/" + firebase.auth().currentUser.uid + "/events";
        await firebase.database().ref(userPath).once('value').then(
            (eventData) => {
                let promises = [];
                eventData.forEach((eventChild) => {
                    promises.push(new Promise((resolve, reject) => {
                        this.getEventIcon(eventChild.key)
                        .then((imgSrc) => {
                            firebase.database().ref("/event/" + eventChild.key + "/basicInfo").once('value')
                            .then(                               (eventInfo) => {
                                    let eventObj = eventInfo.val()
                                    eventObj.eventIconSrc = imgSrc;
                                    this.setState({ data: [...this.state.data, eventObj] }, ()=>resolve(true));
                                }
                            )
                            .catch((error) => {
                                resolve(true)
                            })
                        })
                        .catch((error) => {
                            resolve(true)
                        })
                    }))
                    this.getEventIcon(eventChild.key)
                        .then((imgSrc) => {
                            firebase.database().ref("/event/" + eventChild.key + "/basicInfo").once('value').then(
                                (eventInfo) => {
                                    let eventObj = eventInfo.val()
                                    eventObj.eventIconSrc = imgSrc;
                                    this.setState({ data: [...this.state.data, eventObj] });
                                }
                            )
                        })

                });
            }
        )
        this.setState({ isLoading: false })
    }

    getEventIcon = (eventId) => {
        return new Promise((resolve, reject) => {
            ImageHandler.downloadImage('images/events/' + eventId + '/icon')
                .then((uri) => {
                    resolve({ uri })
                })
                .catch((error) => {
                    resolve(eventDefaultIcon)
                })
        })
    }

    gotoEventPage = () => {
        this.props.navigation.navigate('EventPageSignedUp', eventInfo)
    }

    _renderLoad = () => (
        <View style={{ flex: 1 }}>
            <Spinner visible={true} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
        </View>
    );

    _renderContent = () => (
        <EventList data={this.state.data} onPress={this.gotoEventPage} />
    );

    render() {
        let content = this.state.isLoading ? this._renderLoad() : this._renderContent();
        return (
            <View style={styles.container}>
                {content}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        backgroundColor: '#D0D3D4',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});



