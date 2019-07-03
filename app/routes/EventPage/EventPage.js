import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import EventPageContent from './EventPageContent';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler';
import * as firebase from "firebase";

const eventDefaultIcon = require('../../images/eventDefaultIcon.png')

export default class EventPage extends React.Component {
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
            isAdmin: true,
        };
        this.getEventIcon()
        this.getEventImage()
        this._loading()
    };

    async _loading() {
        let moreInfoPath = "/event/" + this.state.eventId + "/moreInfo"
        await firebase.database().ref(moreInfoPath).once('value')
            .then((addInfo) => this.setState({ moreInfo: addInfo.child("addInfo").val() }))

        let userPath = "/users/" + firebase.auth().currentUser.uid + "/info"
        let isAdmin = await firebase.database().ref(userPath).once("value")
        .then((userInfo) => {
            this.setState({ isAdmin: userInfo.child("admin").val(), isLoading: false })
        })
        .catch((error) => {
            this.setState({ isAdmin: false, isLoading: false })
        })
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

    static navigationOptions = {
        title: 'Event Page',
        headerStyle: { backgroundColor: '#ffcc00' },
    };

    _renderButton = () => (
        !this.state.isAdmin && (<Button
            title="Go to SignUp Page"
            onPress={() => this.props.navigation.navigate('signupEvent', {
                title: this.state.title,
                eventId: this.state.eventId,
                date: this.state.date,
            })} />)
    )

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
                {this._renderButton()}
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