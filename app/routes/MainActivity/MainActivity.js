import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ToolbarAndroid,
  DrawerLayoutAndroid
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import * as firebase from "firebase";
import Firebase from "../../firebase/Firebase";
import Spinner from 'react-native-loading-spinner-overlay';
import MainEventList from '../../components/EventList/MainEventList';
import MyDrawer from '../../components/MyDrawer';
import * as ImageHandler from '../../components/ImageHandler/ImageHandler';

const eventDefaultIcon = require('../../images/eventDefaultIcon.png');

export default class MainActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      admin: false,
      data: [],
      dataUser: [],
      name: "",
      profileImgSrc: require('../../images/blankprofilepicture.png'),
    };
    this.data = [];
    this.dataUser = [];
    this.userEvent = [];
    this.isPressed = false;
  }

  componentDidMount() {
    this.pullUserDataEvent();
    this._loading()
      .then(() => {
        this.setState({ data: this.data, dataUser: this.dataUser }, () => this.setState({ isLoading: false }))
      })
  }

  async pullUserDataEvent() {
    let userPath = "/users/" + firebase.auth().currentUser.uid + "/events";
    await firebase.database().ref(userPath).once('value').then(
      (eventData) => {
        eventData.forEach((eventChild) => {
          if (this.checkEventExists(eventChild.key)) {
            this.userEvent.push(eventChild.key)
          } else {
            // EVENT DOES NOT EXIST! DELETE REFERENCE FROM USER EVENTS LIST
          }
        });
      })
    ImageHandler.getUserProfilePic()
      .then((url) => {
        this.setState({ profileImgSrc: { uri: url } })
      })
      .catch((error) => {
        console.log(error);
      })
  };

  searchId(eventId) {
    for (var i = 0; i < this.userEvent.length; i++) {
      if (eventId == this.userEvent[i]) {
        return false
      }
    };
    return true;
  }

  checkEventExists = async (eventId) => {
    let eventPath = "/event/" + eventId + "/basicInfo/title"
    let result = await firebase.database().ref(eventPath).once('value', (snapshot) => (
      snapshot.val() !== null
    ), (error) => false)
  }

  _loading = () => {
    let eventPath = "/event";
    let userPath = "/users/" + firebase.auth().currentUser.uid + "/info";
    firebase.database().ref(userPath).once('value').then(
      (userData) => {
        this.setState({
          admin: userData.val().admin,
          name: userData.val().name
        })
      });
    return firebase.database().ref(eventPath).once('value').then(
      (eventData) => {
        let promises = [];
        eventData.forEach((eventChild) => {
          // Use default icon first until image can be loaded later
          let eventObject = eventChild.child("basicInfo").val();
          promises.push(this.addEvent(eventObject, eventChild.key))
        })
        return Promise.all(promises)
      }
    )
  }

  addEvent = (eventObject, eventId) => {
    return new Promise((resolve, reject) => {
      this.getEventIcon(eventId)
        .then((eventIconSrc) => {
          eventObject.eventIconSrc = eventIconSrc
          if (this.searchId(eventId)) {
            this.data.push(eventObject)
          } else {
            this.dataUser.push(eventObject)
          }
          resolve(true)
        })
    })
  }

  getEventIcon = (eventId) => {
    return new Promise((resolve, reject) => {
      ImageHandler.downloadImage('images/events/' + eventId + '/icon')
        .then((uri) => {
          resolve({ uri: uri })
        })
        .catch((error) => {
          resolve(eventDefaultIcon)
        })
    })
  }

  sortingFunction = (first, second) => {
    return first.eventId - second.eventId;
  }

  static navigationOptions = {
    header: null
  };

  _logout = () => {
    this.props
      .navigation
      .dispatch(NavigationActions.reset(
        {
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login' })
          ]
        }));
  }

  async _refresh() {
    // Set Loading to true
    this.setState({ isLoading: true });
    // Reset data
    this.setState({ data: [], dataUser: [] })
    this.data = []
    this.dataUser = []
    // Re-obtain data
    this.pullUserDataEvent()
    this._loading()
    .then(() => {
      this.setState({ data: this.data, dataUser: this.dataUser }, () => this.setState({ isLoading: false }))
    })
  }

  _onActionSelected = (position) => {

    switch (position) {
      case 0:
        this._refresh();
        break;

    }
  }

  _renderLoad = () => (
    <View style={{ flex: 1 }}>
      <Spinner visible={true} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
    </View>
  );

  _renderContent = () => (
    <MainEventList
      data={this.state.data.sort(this.sortingFunction)}
      dataUser={this.state.dataUser.sort(this.sortingFunction)}
      onPress={(eventInfo) => {
        this.props.navigation.navigate('EventPage', eventInfo)
      }}
      onPressSignedUp={(eventInfo) => {
        this.props.navigation.navigate('EventPageSignedUp', eventInfo)
      }}
    />
  );

  navigationView = () =>
    (
      <MyDrawer
        admin={this.state.admin}
        name={this.state.name}
        profileImgSrc={this.state.profileImgSrc}
        profile={() => this.drawerNavigate('Profile')}
        _logout={this._logout}
        AddEvent={() => this.drawerNavigate('AddEvent')}
        OrgViewEvents={() => this.drawerNavigate('OrgViewEvents')}
        UserEvent={() => this.drawerNavigate('UserEvent')}
      />
    )

  drawerNavigate = (routeName) => {
    if (!this.isPressed) {
      this.isPressed = true;
      this.props.navigation.navigate(routeName);
      this.refs['DRAWER'].closeDrawer()
    }
  }

  _setDrawer() {
    this.isPressed = false;
    this.refs['DRAWER'].openDrawer();
  }

  render() {
    let content = this.state.isLoading ? this._renderLoad() : this._renderContent();
    var toolbarActions =
      [{ title: "refresh", show: 'always' }]
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => this.navigationView()}
        ref={'DRAWER'}>

        <View style={styles.container}>
          <ToolbarAndroid
            navIcon={require('../../images/drawer.png')}
            onIconClicked={() => this._setDrawer()}
            style={{
              backgroundColor: '#ffcc00',
              height: 56,
            }}
            title="Events"
            actions={toolbarActions}
            onActionSelected={this._onActionSelected}
          />
          {content}
        </View>
      </DrawerLayoutAndroid>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#D0D3D4',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

