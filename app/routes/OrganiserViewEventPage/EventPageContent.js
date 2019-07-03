import React from 'react';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';

export default class EventPageContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventDetails: "",
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <EventPageContentTitle
                    title={this.props.eventBaseInfo.title}
                    date={this.props.eventBaseInfo.date}
                    time={this.props.eventBaseInfo.time}
                    desc={this.props.eventBaseInfo.desc}
                    eventIconSrc={this.props.eventIconSrc}
                />
                <View style={styles.lineView} />
                <EventImage
                    eventImageSrc={this.props.eventImageSrc}
                />
                <EventDescription
                    moreInfo={this.props.moreInfo}
                />
            </View>
        );
    }
}

class EventImage extends React.Component {
    render() {
        if (this.props.eventImageSrc.uri !== "") {
            return (
                <Image
                    style={styles.imageContainer}
                    source={this.props.eventImageSrc}
                />
            );
        } else {
            return <View />
        }
    }
}

class EventDescription extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.contentContainer}>
                <Text style={{ fontWeight: 'bold' }}>
                    Full Event Description: {'\n'}
                </Text>
                <Text>
                    {this.props.moreInfo}{'\n\n\n '}
                </Text>
            </View>
        );
    }
};

class EventPageContentTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.titleContainer}>
                <Image
                    style={styles.titleImage}
                    source={this.props.eventIconSrc}
                />
                <View style={styles.titleTextContainer}>
                    <Text style={styles.titleText}>
                        {this.props.title}
                    </Text>
                    <Text style={styles.titleDateText}>
                        {this.props.date}, {this.props.time}
                    </Text>
                    <Text style={styles.desc}>{this.props.desc}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        margin: 10
    },
    desc: {
        fontSize: 13,
        fontStyle: 'italic'
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        flexDirection: 'row',
    },
    titleImage: {
        borderRadius: 50,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
        height: 100,
        width: 100,
    },
    titleTextContainer: {
        flex: 1,
        marginTop: 20,
    },
    lineView: {
        height: 1,
        backgroundColor: 'black',
        marginBottom: 15,
    },
    imageContainer: {
        height: 240,
        marginTop: 15,
        marginBottom: 15,
    },

    // Text Styles
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    titleDateText: {
        fontSize: 16,
        color: 'gray',
    },
    titleOrgText: {
        fontSize: 16,
        color: 'black',
    }
});