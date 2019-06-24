import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppleMusic from './screens/AppleMusic';

class App extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('AppleMusic')}
        >
          <Text>Apple Music</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const stackNavigator = new createStackNavigator(
  {
    App: App,
    AppleMusic: AppleMusic
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

export default createAppContainer(stackNavigator);
