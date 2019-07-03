import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import MainEventListItem from './MainEventListItem'


export default class MainEventList extends React.Component {
    _renderItemSignedUp = ({ item }) => {
        return (
            <MainEventListItem
                title={item.title}
                date={item.date}
                desc={item.desc}
                eventId={item.eventId}
                time={item.time}
                onPress={this.props.onPressSignedUp}
                eventIconSrc={item.eventIconSrc}
            />
        )
    };

    _renderItem = ({ item }) => {
        return (
            <MainEventListItem
                title={item.title}
                date={item.date}
                desc={item.desc}
                eventId={item.eventId}
                time={item.time}
                onPress={this.props.onPress}
                eventIconSrc={item.eventIconSrc}
            />
        )
    };

    _keyExtractor = (item, index) => (item.eventId);

    render() {
        if (this.props.dataUser.length == 0) {
            let data = this.props.data;
            return (
                <FlatList
                    data={data}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                />
            )
        }
        else {
            let data = this.props.data;
            let dataUser = this.props.dataUser;
            return (
                <ScrollView>
                    <View style={styles.separatorSignUp}>
                        <Text style={styles.textSignUp}>Events Signed Up </Text>
                    </View>
                    <FlatList
                        data={dataUser}
                        renderItem={this._renderItemSignedUp}
                        keyExtractor={this._keyExtractor}
                    />
                    <View style={styles.separatorEvent}>
                        <Text style={styles.textEvent}>Events available</Text>
                    </View>
                    <FlatList
                        data={data}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                    />
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    separatorSignUp: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4d2600',
    },
    separatorEvent: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#804000'
    },
    textSignUp: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    textEvent: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    }
})
