import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  PanResponder
} from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const Users = [
  { id: '1', uri: require('../assets/1.jpg') },
  { id: '2', uri: require('../assets/2.jpg') },
  { id: '3', uri: require('../assets/1.jpg') },
  { id: '4', uri: require('../assets/2.jpg') },
  { id: '5', uri: require('../assets/3.jpeg') }
];
export default class App extends Component {
  constructor(props) {
    super(props);
    this.position = new Animated.ValueXY();
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-20deg', '0deg', '20deg'],
      extrapolate: 'clamp'
    });
    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
      ]
    };
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });
    this.disLikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });
    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    });
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    });
    this.state = {
      index: 0
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this.position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        // For right swipe
        if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH, y: 0 }
            // duration: 400
          }).start(() => {
            this.setState({ index: this.state.index + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH, y: 0 }
            // duration: 400
          }).start(() => {
            this.setState({ index: this.state.index + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 10
          }).start();
        }
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 60 }} />
        <View style={{ flex: 1 }}>
          {Users.map((item, i) => {
            if (i < this.state.index) {
              return null;
            } else if (i === this.state.index) {
              return (
                <Animated.View
                  {...this.panResponder.panHandlers}
                  style={[
                    {
                      width: SCREEN_WIDTH,
                      height: SCREEN_HEIGHT - 120,
                      padding: 10,
                      position: 'absolute'
                    },
                    this.rotateAndTranslate
                  ]}
                  key={item.id}
                >
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: 40,
                      left: 50,
                      zIndex: 1000,
                      opacity: this.likeOpacity
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        color: 'green',
                        borderWidth: 1,
                        borderColor: 'green',
                        fontWeight: '800',
                        padding: 10,
                        transform: [{ rotate: '-30deg' }]
                      }}
                    >
                      Like
                    </Text>
                  </Animated.View>
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: 40,
                      right: 50,
                      zIndex: 1000,
                      opacity: this.disLikeOpacity
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        color: 'red',
                        borderWidth: 1,
                        borderColor: 'red',
                        fontWeight: '800',
                        padding: 10,
                        transform: [{ rotate: '30deg' }]
                      }}
                    >
                      Nope
                    </Text>
                  </Animated.View>
                  <Image
                    source={item.uri}
                    style={{
                      flex: 1,
                      width: null,
                      height: null,
                      resizeMode: 'cover',
                      borderRadius: 20
                    }}
                  />
                </Animated.View>
              );
            } else {
              return (
                <Animated.View
                  style={[
                    {
                      transform: [{ scale: this.nextCardScale }],
                      opacity: this.nextCardOpacity,
                      width: SCREEN_WIDTH,
                      height: SCREEN_HEIGHT - 120,
                      padding: 10,
                      position: 'absolute'
                    }
                  ]}
                  key={item.id}
                >
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: 40,
                      left: 50,
                      zIndex: 1000,
                      opacity: this.likeOpacity
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        color: 'green',
                        borderWidth: 1,
                        borderColor: 'green',
                        fontWeight: '800',
                        padding: 10,
                        transform: [{ rotate: '-30deg' }]
                      }}
                    >
                      Like
                    </Text>
                  </Animated.View>
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: 40,
                      right: 50,
                      zIndex: 1000,
                      opacity: this.disLikeOpacity
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        color: 'red',
                        borderWidth: 1,
                        borderColor: 'red',
                        fontWeight: '800',
                        padding: 10,
                        transform: [{ rotate: '30deg' }]
                      }}
                    >
                      Nope
                    </Text>
                  </Animated.View>
                  <Image
                    source={item.uri}
                    style={{
                      flex: 1,
                      width: null,
                      height: null,
                      resizeMode: 'cover',
                      borderRadius: 20
                    }}
                  />
                </Animated.View>
              );
            }
          }).reverse()}
        </View>

        <View style={{ height: 60 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
