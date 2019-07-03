import React from 'react';
import { StyleSheet, Text, Image, View, TouchableWithoutFeedback } from 'react-native';

// Props passed to this component: userInfo {name, email, addInfo, mobileNo, imgSrc}
const userDefaultImage = require('../../images/blankprofilepicture.png');

export default class UserListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    selectUser = () => {
        /*
        this.props.onPress({
            eventId: this.props.eventId,
            title: this.props.title,
            date: this.props.date,
            time:this.props.time,
            desc: this.props.desc
        });
        */
    }

    render() {
        let imgSrc = this.props.imgSrc.uri === "" ? userDefaultImage : this.props.imgSrc
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={this.selectUser}
                >
                    <View>
                        {/* Title bar (includes icon, title, date) */}
                        <UserListItemTitle
                            name={this.props.userInfo.name}
                            mobileNo={"Phone No.: " +this.props.userInfo.mobileNo}
                            profilePicSrc={imgSrc}
                        />

                        {/* Content (includes description, organiser, etc */}
                        <UserItemContent addInfo={"Additional Info:\n" + this.props.userInfo.addInfo} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

class UserListItemTitle extends React.Component {
    render() {
        return (
            <View style={styles.containerTitle}>
                <Image 
                    style={styles.image}
                    source={this.props.profilePicSrc}
                />

                <View style={styles.title}>
                    <Text style={styles.titleText}>{this.props.name}</Text>
                    <Text style={styles.dateText}>{this.props.mobileNo}</Text>
                </View>
            </View>
        );
    }
}

class UserItemContent extends React.Component {
    render() {
        return (
            <View style={styles.containerDesc}>
                <Text>{this.props.addInfo}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin:5,
        backgroundColor:'white',
        borderRadius:8
    },
    containerTitle: {
        flex: 1,
        flexDirection: 'row',
    },
    titleText: {
        fontWeight: 'bold',
    },
    dateText: {
        fontStyle: 'italic',
    },
    containerDesc: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        maxHeight: 50
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
});