import React from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';

export default class EventListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    gotoEvent = () => {
        this.props.onPress({
            eventId: this.props.eventId,
            title: this.props.title,
            date: this.props.date,
            time: this.props.time,
            desc: this.props.desc
        });
    }



    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={this.gotoEvent}
                >
                    <View>
                        {/* Title bar (includes icon, title, date) */}
                        <EventListItemTitle title={this.props.title} date={this.props.date} eventIconSrc={this.props.eventIconSrc}/>

                        {/* Content (includes description, organiser, etc */}
                        <EventListItemContent desc={this.props.desc} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

class EventListItemTitle extends React.Component {
    render() {
        return (
            <View style={styles.containerTitle}>
                <Image
                    style={styles.image}
                    source={this.props.eventIconSrc}
                />

                <View style={styles.title}>
                    <Text style={styles.titleText}>{this.props.title}</Text>
                    <Text style={styles.dateText}>{this.props.date}</Text>
                </View>
            </View>
        );
    }
}

class EventListItemContent extends React.Component {
    render() {
        return (
            <View style={styles.containerDesc}>
                <Text>{this.props.desc}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 8
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