import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';


export default class EventAddImageScroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageList: this.props.imageList,
        }
    }

    _renderItem = ({ item }) => {
        return (
            <EventImageItem
                key={item.key}
                imgSrc={{ uri: item.uri }}
            />
        );
    };

    renderFooter = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={this.props.addImg}
                >
                    <Text style={{ fontSize: 40 }}> + </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderEventScroll = () => {
        if (this.props.imageList.length === 0) {
            return (
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.container}
                        onPress={this.props.addImg}
                    >
                        <Text>
                            Press here to add images for your event
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <FlatList
                    data={this.state.imageList}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    horizontal={true}
                    padding={5}
                    extraData={this.props.extraData}
                />
            )
        }
    }

    render() {
        return (
            <View style={styles.container}> 
                {this.renderEventScroll()}
            </View>
        );
    }
}

class EventImageItem extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.placeholderImageStyle}>
                <Image
                    style={styles.contentContainer}
                    source={this.props.imgSrc}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    buttonContainer: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:20,
    },
    placeholderImageStyle: {
        height: 140,
        width: 100,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
        alignItems: 'stretch',
        backgroundColor: 'gray',
    },
});