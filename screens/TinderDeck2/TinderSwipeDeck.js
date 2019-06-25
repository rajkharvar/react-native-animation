import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { PanResponder, Animated, Dimensions } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const THRESHOLD_WIDTH = SCREEN_WIDTH * 0.25;

class TinderSwipeDeck extends Component {
  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {}
  };
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > THRESHOLD_WIDTH) {
          this.forceSwipe('right');
        } else if (gesture.dx < -THRESHOLD_WIDTH) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      }
    });
    this.position = position;
    this.state = {
      panResponder,
      position,
      index: 0
    };
  }

  // reset the position of the default if there is no need to move the card
  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  forceSwipe(direction) {
    let x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: 250
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-1.5 * SCREEN_WIDTH, 0, 1.5 * SCREEN_WIDTH],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  renderAllCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }
    return this.props.data
      .map((item, i) => {
        if (i < this.state.index) {
          return null;
        }
        if (i === this.state.index) {
          return (
            <Animated.View
              key={item.id}
              style={[this.getCardStyle(), styles.card, { zIndex: 99 }]}
              {...this.state.panResponder.panHandlers}
            >
              {this.props.renderCard(item)}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            key={item.id}
            style={[
              styles.card,
              { top: 10 * (i - this.state.index), zIndex: 5 }
            ]}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      })
      .reverse();
  }
  render() {
    return (
      <Animated.View style={styles.card}>{this.renderAllCards()}</Animated.View>
    );
  }
}
export default TinderSwipeDeck;
const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
});
