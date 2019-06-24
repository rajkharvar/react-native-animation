import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class App extends Component {
  componentWillMount() {
    this.animation = new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 90 });
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gesture) => {
        this.animation.extractOffset();
      },
      onPanResponderMove: (evt, gesture) => {
        this.animation.setValue({ x: 0, y: gesture.dy });
      },
      onPanResponderRelease: (evt, gesture) => {
        // for slide up
        if (gesture.dy < 0) {
          Animated.spring(this.animation.y, {
            tension: 1,
            toValue: -SCREEN_HEIGHT + 120
          }).start();
        } else if (gesture.dy > 0) {
          Animated.spring(this.animation.y, {
            toValue: SCREEN_HEIGHT - 120,
            tension: 1
          }).start();
        }
      }
    });
  }

  render() {
    const animatedHeight = {
      transform: this.animation.getTranslateTransform()
    };
    const animatedImageHeight = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 90],
      outputRange: [200, 32],
      extrapolate: 'clamp'
    });

    const animateSongOpacity = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 400, SCREEN_HEIGHT - 90],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });

    const animatedImageMargin = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 90],
      outputRange: [SCREEN_WIDTH / 2 - 100, 10],
      extrapolate: 'clamp'
    });

    const animatedHeaderHeight = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 90],
      outputRange: [SCREEN_HEIGHT / 2, 90],
      extrapolate: 'clamp'
    });
    return (
      <Animated.View style={{ flex: 1, backgroundColor: 'white' }}>
        <Animated.View
          style={[
            animatedHeight,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              height: 90,
              zIndex: 10
            }
          ]}
        >
          <Animated.View
            {...this.panResponder.panHandlers}
            style={{
              borderTopWidth: 1,
              borderTopColor: '#999',
              height: animatedHeaderHeight,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            {/* Image and song text */}
            <View
              style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}
            >
              <Animated.View
                style={{
                  height: animatedImageHeight,
                  width: animatedImageHeight,
                  marginLeft: animatedImageMargin
                }}
              >
                <Image
                  source={require('./assets/bg.jpeg')}
                  style={{ flex: 1, width: null, height: null }}
                />
              </Animated.View>
              <Animated.Text
                style={{
                  opacity: animateSongOpacity,
                  fontSize: 18,
                  paddingLeft: 10
                }}
              >
                Some Random Music
              </Animated.Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                opacity: 1
              }}
            >
              <Ionicons name='md-play' size={32} />
              <Ionicons name='md-pause' size={32} />
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }
}
