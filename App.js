import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import AppleMusic from './screens/AppleMusic';
import TinderDeck from './screens/TinderDeck';

class App extends Component {
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <SafeAreaView />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginBottom: 10 }}
            onPress={() => this.props.navigation.navigate('AppleMusic')}
          >
            <Text style={styles.text}>Apple Music🎧</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('TinderDeck')}
          >
            <Text style={styles.text}>Tinder Swipe Deck👬</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const stackNavigator = new createStackNavigator(
  {
    App: App,
    AppleMusic: AppleMusic,
    TinderDeck: TinderDeck
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

export default createAppContainer(stackNavigator);

const styles = StyleSheet.create({
  text: {
    fontSize: 22
  }
});
