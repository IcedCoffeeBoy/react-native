import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import LoginScreen from './app/routes/LoginScreen/LoginScreen';
import MainActivity from './app/routes/MainActivity/MainActivity';
import RegisterScreen from './app/routes/RegisterScreen/RegisterScreen';
import ProfilePage from './app/routes/ProfilePage/ProfilePage';
import AddEvent from './app/routes/AddEvent/AddEvent';
import EventPage from './app/routes/EventPage/EventPage';
import EventPageSignedUp from './app/routes/EventPage/EventPageSignedUp'; // Only difference is buttons
import SignupEvent from './app/routes/SignupEvent/SignupEvent';
import UserEvent from './app/routes/UserEvent/UserEvent';
import OrganiserViewEventList from './app/routes/OrganiserViewEventList/OrganiserViewEventList';
import OrganiserViewEventPage from './app/routes/OrganiserViewEventPage/OrganiserViewEventPage';
import OrganiserEditEvent from './app/routes/OrganiserEditEvent/OrganiserEditEvent';
import OrganiserViewSignedUps from './app/routes/OrganiserViewSignedUps/OrganiserViewSignedUps';

const proffer = StackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  Event: { screen: MainActivity },
  Profile: { screen: ProfilePage },
  AddEvent: { screen: AddEvent },
  EventPage: { screen: EventPage },
  EventPageSignedUp: { screen: EventPageSignedUp },
  signupEvent: { screen: SignupEvent },
  UserEvent: { screen: UserEvent },
  OrgViewEvents: { screen: OrganiserViewEventList },
  OrgEventView: { screen: OrganiserViewEventPage },
  OrgEventEdit: { screen: OrganiserEditEvent },
  ViewSignedUps: { screen: OrganiserViewSignedUps },
});

AppRegistry.registerComponent('proffer', () => proffer);
