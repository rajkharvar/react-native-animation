import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
  Slider,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: false
    };
  }
  componentWillMount() {
    this.scrollOffset = 0;
    this.animation = new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 90 });
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gesture) => {
        if (
          (this.state.scrollEnabled &&
            this.scrollOffset <= 0 &&
            gesture.dy > 0) ||
          (!this.state.scrollEnabled && gesture.dy < 0)
        ) {
          console.log('enabled');
          return true;
        }
        return false;
      },
      onPanResponderGrant: (evt, gesture) => {
        this.animation.extractOffset();
      },
      onPanResponderMove: (evt, gesture) => {
        this.animation.setValue({ x: 0, y: gesture.dy });
      },
      onPanResponderRelease: (evt, gesture) => {
        if (gesture.moveY > SCREEN_HEIGHT - 120) {
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 1
          }).start();
        } else if (gesture.moveY < 120) {
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 1
          }).start();
        }
        // for slide up
        else if (gesture.dy < 0) {
          this.setState({ scrollEnabled: true });
          Animated.spring(this.animation.y, {
            tension: 1,
            toValue: -SCREEN_HEIGHT + 120
          }).start();
        } else if (gesture.dy > 0) {
          this.setState({ scrollEnabled: false });
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

    const animatedSongDetailsOpacity = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 400, SCREEN_HEIGHT - 90],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });

    const animateBackgroundColor = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 90],
      outputRange: ['rgba(0, 0, 0, 0.4)', '#000', 'white'],
      extrapolate: 'clamp'
    });
    return (
      <Animated.View
        style={{ flex: 1, backgroundColor: animateBackgroundColor }}
      >
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            animatedHeight,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              height: SCREEN_HEIGHT,
              zIndex: 10
            }
          ]}
        >
          <ScrollView
            scrollEnabled={this.state.scrollEnabled}
            scrollEventThrottle={16}
            onScroll={event => {
              this.scrollOffset = event.nativeEvent.contentOffset.y;
            }}
          >
            <Animated.View
              style={{
                height: animatedHeaderHeight,
                borderTopWidth: 1,
                borderTopColor: '#999',
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
              <Animated.View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  opacity: animateSongOpacity
                }}
              >
                <Ionicons name='md-play' size={32} />
                <Ionicons name='md-pause' size={32} />
              </Animated.View>
            </Animated.View>
            <Animated.View
              style={{
                height: animatedHeaderHeight,
                opacity: animatedSongDetailsOpacity
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 22 }}>
                  Some Random Music
                </Text>
                <Text style={{ fontSize: 18, color: '#EA425C' }}>
                  Some Band - Some Album
                </Text>
              </View>
              <View
                style={{
                  height: 40,
                  width: SCREEN_WIDTH,
                  alignItems: 'center'
                }}
              >
                <Slider
                  style={{ width: 300, color: '#EA425C' }}
                  step={1}
                  minimumValue={18}
                  maximumValue={71}
                  value={80}
                />
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Ionicons name='md-rewind' size={40} />
                <Ionicons name='md-play' size={50} />
                <Ionicons name='md-fastforward' size={40} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingBottom: 20
                }}
              >
                <Ionicons
                  name='md-add'
                  style={{ color: '#EA425C' }}
                  size={32}
                />
                <Ionicons
                  name='md-more'
                  style={{ color: '#EA425C' }}
                  size={32}
                />
              </View>
            </Animated.View>
            <View style={{ height: 600 }} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }
}
