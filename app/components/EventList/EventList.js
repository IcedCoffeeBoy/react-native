import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import EventListItem from './EventListItem'


export default class EventList extends React.Component {
    constructor(props) {
        super(props);
    }

    _renderItem = ({ item }) => {
        return (
            <EventListItem
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
        let data = this.props.data;
        return (
            <FlatList
                data={data}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}

            />
        );
    }
}

