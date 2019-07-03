import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Alert } from 'react-native';
import firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler';
import EventPageContent from './EventPageContent';
import { NavigationActions } from 'react-navigation';

/*
eventBaseInfo consists of
    eventId: event.eventId,
    title: event.title,
    date: event.date,
    time: event.time,
    desc: event.desc
*/

const eventDefaultIcon = require('../../images/eventDefaultIcon.png')

export default class OrganiserViewEventPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventBaseInfo: this.props.navigation.state.params.eventBaseInfo,
            isLoading: true,
            moreInfo: "",
            eventIconSrc: eventDefaultIcon,
            eventImageSrc: { uri: "" },
        };
        this.getEventIcon()
        this.getEventImage()
        this._loading()
    };

    static navigationOptions = {
        title: 'View Event',
        headerStyle: { backgroundColor: '#ffcc00' },
    };

    async _loading() {
        let moreInfoPath = "/event/" + this.state.eventBaseInfo.eventId + "/moreInfo"
        await firebase.database().ref(moreInfoPath).once('value').then((addInfo) =>
        { this.setState({ moreInfo: addInfo.child("addInfo").val() }) })
        this.setState({ isLoading: false })
    }

    getEventIcon = () => {
        ImageHandler.downloadImage('images/events/' + this.state.eventBaseInfo.eventId + '/icon')
            .then((uri) => {
                this.setState({ eventIconSrc: { uri } })
            })
    }

    getEventImage = () => {
        ImageHandler.downloadImage('images/events/' + this.state.eventBaseInfo.eventId + '/image')
            .then((uri) => {
                this.setState({ eventImageSrc: { uri } })
            })
    }

    deleteEventPrompt = () => {
        Alert.alert("WARNING", "Are you sure you want to delete this event? All event information will be permanently lost!",
            [{ text: "Yes", onPress: this.deleteEvent }, { text: "No", onPress: () => { } }]);
    }

    deleteEvent = () => {
        // Bye bye event
        // First step: remove event from events listing
        // Second step: remove event from user's created events
        // Third step: remove event images
        let eventPath = '/event/' + this.state.eventBaseInfo.eventId
        let userEventPath = "/users/" + firebase.auth().currentUser.uid + "/organise/" + this.state.eventBaseInfo.eventId
        firebase.database().ref(eventPath).remove()
            .then(() =>
                firebase.database().ref(userEventPath).remove()
            )
            .catch((error) => {
                alert("Something went wrong while deleting the event.")
            })
            .then(() => {
                ImageHandler.deleteImage('images/events/' + this.state.eventBaseInfo.eventId + '/icon')
            })
            .then(() => {
                ImageHandler.deleteImage('images/events/' + this.state.eventBaseInfo.eventId + '/image')
            })
            .then(() => {
                Alert.alert("Proffer", "Event successfully deleted!",
                    [{ text: "OK", onPress: this.returnToMain }]);
            })
            .catch((error) => {
                console.log("Error Detected!")
            })
    }

    returnToMain = () => {
        this.props
            .navigation
            .dispatch(NavigationActions.reset(
                {
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Event' }),
                        NavigationActions.navigate({ routeName: 'OrgViewEvents' })
                    ]
                }));
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <EventPageContent
                        eventBaseInfo={this.state.eventBaseInfo}
                        moreInfo={this.state.moreInfo}
                        eventIconSrc={this.state.eventIconSrc}
                        eventImageSrc={this.state.eventImageSrc}
                    />
                </ScrollView>
                <Spinner
                    visible={this.state.isLoading}
                    textContent={"Loading..."}
                    textStyle={{ color: '#FFF' }}
                />
                <Button
                    title="View Signed Up Users"
                    onPress={() => this.props.navigation.navigate('ViewSignedUps', {
                        eventId: this.state.eventBaseInfo.eventId,
                    })} />
                <Button
                    title="Edit Event"
                    onPress={() => this.props.navigation.navigate('OrgEventEdit', {
                        eventBaseInfo: this.state.eventBaseInfo,
                        moreInfo: this.state.moreInfo,
                        eventIconSrc: this.state.eventIconSrc,
                        eventImageSrc: this.state.eventImageSrc,
                    })} />
                <Button
                    title="Delete Event"
                    onPress={this.deleteEventPrompt} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    button: {
    },

});

