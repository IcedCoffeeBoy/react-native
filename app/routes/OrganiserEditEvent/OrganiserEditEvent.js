import React from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TextInput,
    View,
    FlatList,
    Button,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    DatePickerAndroid,
    TimePickerAndroid,
} from 'react-native';
import * as firebase from "firebase";
import { TextField } from 'react-native-material-textfield';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler';
import { NavigationActions } from 'react-navigation';

const eventDefaultIcon = require('../../images/eventDefaultIcon.png')

// WARNING: DELETING IMAGES DOES NOT REMOVE FILE FROM STORAGE!!! WILL CAUSE SEVERE STORAGE PROBLEMS IN THE LONG RUN

export default class OrganiserEditEvent extends React.Component {
    constructor(props) {
        super(props);
        let navParams = this.props.navigation.state.params
        this.state = {
            title: navParams.eventBaseInfo.title,
            date: navParams.eventBaseInfo.date,
            desc: navParams.eventBaseInfo.desc,
            time: navParams.eventBaseInfo.time,
            organisationName: "",
            addInfo: navParams.moreInfo,
            eventId: navParams.eventBaseInfo.eventId,
            eventImageSrc: navParams.eventImageSrc,
            eventIconSrc: navParams.eventIconSrc,
            eventImageChanged: false,
            eventIconChanged: false,
            isLoading: false,
        };
    }

    static navigationOptions = {
        title: 'Edit Event',
        headerStyle: { backgroundColor: '#ffcc00' },
    };

    isInfoInvalid = () => {
        return (this.state.title.length == 0 ||
            this.state.date.length == 0 ||
            this.state.desc.length == 0 ||
            this.state.time.length == 0
        )
    }

    onPress = () => {
        if (!this.state.isLoading) {
            if (this.isInfoInvalid()) {
                Alert.alert("Proffer admin", "Please fill in all the required informations!")
            }
            else {
                this.setState({ isLoading: true });
                firebase.database().ref("/event/" + this.state.eventId + "/basicInfo").update({
                    title: this.state.title,
                    date: this.state.date,
                    desc: this.state.desc,
                    time: this.state.time
                })
                    .then(() =>
                        firebase.database().ref("/event/" + this.state.eventId + "/moreInfo").update({
                            addInfo: this.state.addInfo,
                        })
                    )
                    .then(() =>
                        this.uploadAllImages()
                    )
                    .then(() => {
                        this.setState({ isLoading: false })
                        Alert.alert("Proffer", "Event successfully edited!",
                            [{ text: "ok", onPress: this.returnToOrgEventList }],
                            { onDismiss: this.returnToOrgEventList });
                    })
                    .catch((error) => {
                        Alert.alert("Proffer", "Error while editing event!");
                    })
            }
        }
    };

    returnToOrgEventList = () => {
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

    uploadAllImages = async () => {
        if (this.state.eventIconChanged) {
            let eventPath = 'events/' + this.state.eventId + '/icon'
            try {
                await ImageHandler.uploadImage(this.state.eventIconSrc.uri, eventPath)
            } catch (error) {
                alert("Image upload error")
            }

        }
        if (this.state.eventImageChanged) {
            let eventPath = 'events/' + this.state.eventId + '/image'
            if (this.state.eventImageSrc.uri === "") { // Image was removed
                await ImageHandler.deleteImage(eventPath)
            } else {
                try {
                    await ImageHandler.uploadImage(this.state.eventImageSrc.uri, eventPath)
                } catch (error) {
                    alert("Image upload error")
                }
            }
        }
        if (!this.state.eventIconChanged && !this.state.eventImageChanged) {
            return
        }
    }

    getServerTimestamp = () => {
        return new Promise((resolve, reject) => {
            firebase.database().ref("/Timestamp").set({
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
                firebase.database().ref("/Timestamp").once('value').then((data) => {
                    this.setState({
                        eventId: 9999999999999 - data.val().timestamp
                    })
                    resolve(this.state.eventId)
                })
                    .catch((error) => reject(error.message));
            })
                .catch((error) => reject(error.message));
        })
    }

    getEventDate = async () => {
        try {
            let dateObj = this.unnecessaryParsingFunction("date", this.state.date)
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date(dateObj.year, dateObj.month - 1, dateObj.day)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                this.setState({ date: day + "/" + (month + 1) + "/" + year })
            }
        } catch ({ code, message }) {
            alert("Date picker error: " + message);
        }
    }

    getEventTime = async () => {
        try {
            let timeObj = this.unnecessaryParsingFunction("time", this.state.time)
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: timeObj.hour,
                minute: timeObj.minute,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                hour = (hour < 10 ? "0" : "") + hour
                minute = (minute < 10 ? "0" : "") + minute
                this.setState({ time: hour + minute + " hrs" })
            }
        } catch ({ code, message }) {
            alert("Time picker error: " + message);
        }
    }

    unnecessaryParsingFunction(type, value) {
        if (type === "date") {
            let parsedDate = value.split("/")
            return { day: parsedDate[0], month: parsedDate[1], year: parsedDate[2] }
        } else if (type === "time") {
            let parsed = value.split(" ")
            let time = parseInt(parsed[0])
            return { hour: (time / 100) >> 0, minute: time % 100 }
        }
    }

    addImg = () => {
        ImageHandler.getImageFromLibrary("Select Image")
            .then((uri) => {
                this.setState({ eventImageSrc: { uri } });
            })
    }

    getIcon = () => {
        ImageHandler.getImageFromLibrary()
            .then((uri) => {
                this.setState({ eventIconSrc: { uri } });
            })
    }

    promptRemoveImg = () => {
        Alert.alert("Proffer", "Remove image?",
            [{
                text: "Yes", onPress: () => this.setState({ eventImageChanged: true, eventImageSrc: { uri: "" } })
            }, { text: "No" }])
    }

    renderEventImage = () => {
        if (this.state.eventImageSrc.uri === "") {
            return (
                <View style={[styles.emptyImageContainer]}>
                    <TouchableOpacity
                        style={styles.centeredContainer}
                        onPress={this.addImg}
                    >
                        <Text style={{ textAlign: 'center' }}>
                            Press here to add an image for your event
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={[styles.bottomImageContainer]}>
                    <TouchableOpacity
                        style={styles.bottomImageContainer}
                        onPress={this.addImg}
                        onLongPress={this.promptRemoveImg}
                    >
                        <Image
                            style={styles.centeredContainer}
                            source={this.state.eventImageSrc}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1 }}>
                    <Spinner visible={this.state.isLoading} textContent={"Editing Event..."} textStyle={{ color: '#FFF' }} />
                </View>
                <View style={styles.topImageContainer} >
                    <TouchableWithoutFeedback
                        style={{ width: 150, height: 150, alignItems: 'center', justifyContent: 'center' }}
                        onPress={this.getIcon}
                    >
                        <Image
                            style={{ width: 150, height: 150, borderRadius: 75 }}
                            source={this.state.eventIconSrc}
                        />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.container} >
                    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.pagetitle}>Event Information</Text>
                        </View>
                        {this.renderEventImage()}
                        <TextField
                            maxLength={128}
                            label="Enter Organisation Name"
                            value={this.state.organisationName}
                            onChangeText={(organisationName) => this.setState({ organisationName })}
                        />
                        <TextField
                            maxLength={128}
                            label="Enter event name"
                            value={this.state.title}
                            onChangeText={(title) => this.setState({ title })}
                        />
                        <TouchableWithoutFeedback
                            style={{ width: "100%" }}
                            onPress={this.getEventDate}
                        >
                            <View style={{ marginTop: 30 }}>
                                <Text style={{ fontSize: 16 }} >Enter event date</Text>
                                <Text style={{ fontSize: 16 }} >{this.state.date + " "}</Text>
                                <View style={{ height: 1, width: "100%", backgroundColor: 'lightgray', marginTop: 5 }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            style={{ width: "100%" }}
                            onPress={this.getEventTime}
                        >
                            <View style={{ marginTop: 30 }}>
                                <Text style={{ fontSize: 16 }} >Enter event time</Text>
                                <Text style={{ fontSize: 16 }} >{this.state.time + " "}</Text>
                                <View style={{ height: 1, width: "100%", backgroundColor: 'lightgray', marginTop: 5 }} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TextField
                            maxLength={256}
                            label="Enter event summary"
                            value={this.state.desc}
                            onChangeText={(desc) => this.setState({ desc })}
                            multiline={true}
                        />
                        <Text style={styles.addInfo}> Full information </Text>
                        <View style={{ flex: 1, backgroundColor: '#D0D3D4', margin: 10, borderWidth: 0.5, borderColor: 'black' }}>
                            <TextInput
                                value={this.state.addInfo}
                                multiline={true}
                                maxLength={4096}
                                numberOfLines={9}
                                value={this.state.addInfo}
                                onChangeText={(text) => this.setState({ addInfo: text })}
                                style={{ textAlignVertical: 'top' }}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <Button
                            title="Edit Event"
                            onPress={this.onPress}
                        />
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'white',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagetitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    addInfo: {
        fontSize: 15,
        fontFamily: 'Roboto',
        marginTop: 10,
    },
    topImageContainer: {
        padding: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyImageContainer: {
        height: 120,
        borderColor: 'gray',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 20,
    },
    bottomImageContainer: {
        height: 240,
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 20,
    }
});