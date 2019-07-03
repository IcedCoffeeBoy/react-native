import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Alert } from 'react-native';
import EventPageContent from './EventPageContent';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler';
import * as firebase from "firebase";
import { NavigationActions } from 'react-navigation';

const eventDefaultIcon = require('../../images/eventDefaultIcon.png')

export default class EventPageSignedUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            title: this.props.navigation.state.params.title,
            eventId: this.props.navigation.state.params.eventId,
            date: this.props.navigation.state.params.date,
            time: this.props.navigation.state.params.time,
            desc: this.props.navigation.state.params.desc,
            moreInfo: "",
            eventIconSrc: eventDefaultIcon,
            eventImageSrc: { uri: "" },
        };
        this.getEventIcon()
        this.getEventImage()
        this._loading()
    };

    async _loading() {
        let moreInfoPath = "/event/" + this.state.eventId + "/moreInfo"
        await firebase.database().ref(moreInfoPath).once('value').then((addInfo) =>
        { this.setState({ moreInfo: addInfo.child("addInfo").val() }) })
        this.setState({ isLoading: false })
    }

    getEventIcon = () => {
        ImageHandler.downloadImage('images/events/' + this.state.eventId + '/icon')
            .then((uri) => {
                this.setState({ eventIconSrc: { uri } })
            })
    }

    getEventImage = () => {
        ImageHandler.downloadImage('images/events/' + this.state.eventId + '/image')
            .then((uri) => {
                this.setState({ eventImageSrc: { uri } })
            })
    }

    promptLeaveEvent = () => {
        Alert.alert("Proffer", "Are you sure you want to leave the event?",
            [{
                text: 'Yes',
                onPress: this.leaveEvent
            }, {
                text: 'No',
                onPress: () => { }
            }]);
    }

    leaveEvent = async () => {
        // Database entries to delete:
        // From user path side, delete event info
        try {
            let userEventEntryPath = "users/" + firebase.auth().currentUser.uid + "/events/" + this.state.eventId
            await firebase.database().ref(userEventEntryPath).remove()
            // From event path side, delete user info
            let eventUserEntryPath = "event/" + this.state.eventId + "/users/" + firebase.auth().currentUser.uid
            await firebase.database().ref(eventUserEntryPath).remove()
            Alert.alert("Proffer", "Successfully left event.",
                [{
                    text: 'OK',
                    onPress: this.returnToMain
                }], {
                    onDismiss: this.returnToMain
                });
        } catch (error) {
            Alert.alert("Proffer", "Error leaving event!")
        }
    }


    static navigationOptions = {
        title: 'Event Page',
        headerStyle: { backgroundColor: '#ffcc00' },
    };

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
        return (
            <View style={styles.container}>
                <ScrollView>
                    <EventPageContent
                        title={this.state.title}
                        date={this.state.date}
                        eventId={this.state.eventId}
                        time={this.state.time}
                        moreInfo={this.state.moreInfo}
                        desc={this.state.desc}
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
                    title="Leave event"
                    onPress={this.promptLeaveEvent} />
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