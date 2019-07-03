import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import UserListItem from './UserListItem'

// Props passed to this component: array of user objects (names, mobileNo, addInfo, email, imgSrc)

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [...this.props.data, {userInfo:{name:"hi"}, key:1}]
        }
    }

    componentDidMount() {
        this.setState(this.state)
    }

    _renderItem = ({ item }) => {
        return (
            <UserListItem
                userInfo={item.userInfo}
            />
        )
    };

    _keyExtractor = (item, index) => (item.key);

    render() {
        return (
            <FlatList
                data={this.state.data}
                extraData={this.props.extraData}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
            />
        );
    }
}