import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Alert } from 'react-native';
import EventList from '../../components/EventList/EventList';
import firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler';

const eventDefaultIcon = require('../../images/eventDefaultIcon.png');

export default class OrganiserViewEventList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            isLoading: true
        }
        this.data = [];
        this.getEventList()
            .then(() => { this.setState({ isLoading: false, events: this.data }) })
            .catch(() => { this.setState({ isLoading: false, events: this.data }) })
    }

    static navigationOptions = {
        title: 'View Organised Events',
        headerStyle: { backgroundColor: '#ffcc00' },
    };

    getEventList() {
        let userEventsPath = "/users/" + firebase.auth().currentUser.uid + "/organise";
        return firebase.database().ref(userEventsPath).once('value')
            .then((snapshot) => {
                let promises = [];
                snapshot.forEach((child) => {
                    promises.push(this.getEventInfo(child.key))
                })
                return Promise.all(promises)
            });
    }

    getEventInfo = (eventKey) => {
        return new Promise((resolve, reject) => {
            let eventPath = "/event/" + eventKey + "/basicInfo";
            firebase.database().ref(eventPath).once('value')
                .then((snapshot) => {
                    let eventInfo = snapshot.val();
                    let eventObj = {
                        title: eventInfo.title,
                        date: eventInfo.date,
                        desc: eventInfo.desc,
                        eventId: eventKey,
                        time: eventInfo.time,
                    }
                    this.getEventIcon(eventKey)
                        .then((imgSrc) => {
                            eventObj.eventIconSrc = imgSrc
                            this.data.push(eventObj)
                            resolve(true)
                        })
                    //resolve(eventObj)
                })
                .catch((error) => {
                    Alert.alert("Proffer", "Error encountered while accessing event database.")
                    reject(error)
                })
        })
    }

    getEventIcon = (key) => {
        return new Promise((resolve, reject) => {
            ImageHandler.downloadImage('images/events/' + key + '/icon')
                .then((uri) => {
                    resolve({ uri: uri })
                })
                .catch((error) => {
                    resolve(eventDefaultIcon)
                })
        })
    }

    sortingFunction = (first, second) => {
        return first.eventId - second.eventId;
    }

    _onPress = (event) => {
        this.props.navigation.navigate('OrgEventView', {
            eventBaseInfo: {
                eventId: event.eventId,
                title: event.title,
                date: event.date,
                time: event.time,
                desc: event.desc,
            }
        });
    };

    render() {
        let eventListView = <View />;

        if (this.state.events.length == 0 && !this.state.isLoading) {
            eventListView = (
                <View style={styles.centeredContainer}>
                    <Text style={styles.textNoEventsFound}>No events found.</Text>
                </View>
            );
        } else {
            eventListView = <EventList data={this.state.events.sort(this.sortingFunction)} onPress={this._onPress} />;
        }

        return (
            <View style={styles.container}>
                <View style={{ margin: 20 }}>
                    <Spinner visible={this.state.isLoading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                    <Text style={{ fontSize: 16 }} >
                        Here, you can view the events which you're organising.
                    </Text>
                </View>
                {eventListView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    button: {
    },
    textNoEventsFound: {
        textAlign: 'center',
        fontSize: 16,
    }

});