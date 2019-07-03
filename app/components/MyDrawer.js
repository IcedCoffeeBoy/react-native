import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Button,
    Alert,
    View,
    TextInput,
    DrawerLayoutAndroid,
    ToolbarAndroid,
    TouchableHighlight,
    Image
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';

export default class MyDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
    };

    render() {
        this.state.name = this.props.name;
        //var profileImageSrc = require("../images/blankprofilepicture.png");
        if (this.props.admin) {
            return (
                <View style={{ flex: 1, backgroundColor: '#ffcc00' }}>
                    <View style={styles.welcomeBox}>
                        <Image style={styles.profileImg} source={this.props.profileImgSrc} />
                        <View>
                            <Text style={styles.welcome}>Welcome, {this.state.name}!</Text>
                            <Text style={styles.textNUS}> National University of {'\n'} Singapore</Text>
                        </View>
                    </View>
                    <TouchableHighlight onPress={() => this.props.AddEvent()} underlayColor='#4d2600' activeOpacity={0.9}>
                        <View style={styles.optionsBox}>
                            <Text style={styles.options}>Add Event</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.props.OrgViewEvents()} underlayColor='#4d2600' activeOpacity={0.9}>
                        <View style={styles.optionsBox}>
                            <Text style={styles.options}>View Organised Event</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.props.profile()} underlayColor='#4d2600' activeOpacity={0.9}>
                        <View style={styles.optionsBox}>
                            <Text style={styles.options}>Edit Profile</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.props._logout()} underlayColor='#4d2600' activeOpacity={0.9}>
                        <View>
                            <Text style={styles.options}>Logout</Text>
                        </View>
                    </TouchableHighlight>
                </View >
            )
        }
        else {
            return (
                <View style={{ flex: 1, backgroundColor: '#ffcc00' }}>
                    <View style={styles.welcomeBox}>
                        <Image style={styles.profileImg} source={this.props.profileImgSrc} />
                        <View>
                            <Text style={styles.welcome}>Welcome, {this.state.name}!</Text>
                            <Text style={styles.textNUS}> National University of {'\n'} Singapore</Text>
                        </View>
                    </View>

                    <TouchableHighlight onPress={() => this.props.UserEvent()} underlayColor='#4d3d00' activeOpacity={0.9}>
                        <View style={styles.optionsBox}>
                            <Text style={styles.options}>View Event Joined</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.props.profile()} underlayColor='#4d3d00' activeOpacity={0.9}>
                        <View style={styles.optionsBox}>
                            <Text style={styles.options}>Edit Profile</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.props._logout()} underlayColor='#4d3d00' activeOpacity={0.9}>
                        <View style={styles.optionsBox}>
                            <Text style={styles.options}>Logout</Text>
                        </View>
                    </TouchableHighlight>
                </View >
            )
        }
    }
}

const styles = StyleSheet.create({
    welcomeBox: {
        height: 100,
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#e6b800'
    },
    profileImg: {
        width: 80,
        height: 80,
        borderRadius: 80,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
        marginLeft: 10,
    },
    textNUS: {
        fontStyle: 'italic',
        fontSize: 15
    },
    optionsBox: {
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    options: {
        fontSize: 18,
        margin: 8
    }
})