import React, { Component } from "react"
import { PanResponder, Animated, Dimensions, StyleSheet } from "react-native"

export default class Animator extends Component {
  constructor(props) {
    super(props)

    this.position = new Animated.ValueXY(this.props.currentPosition)

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderRelease
    })
  }

  render() {
    return (
      <Animated.View
        style={[
          { ...this.position.getLayout(), left: 0 },
          StyleSheet.flatten([
            styles.animationContainer(
              this.props.containerHeight,
              this.props.backgroundColor,
              this.props.screenWidth,
              this.props.screenHeight
            ),
            styles.roundedEdges(this.props.roundedEdges),
            styles.shadow(this.props.shadow)
          ])
        ]}
        {...this._panResponder.panHandlers}
      >
        {this.props.children}
      </Animated.View>
    )
  }

  _handlePanResponderMove = (e, gesture) => {
    if (this._swipeInBounds(gesture)) {
      this.position.setValue({ y: this.props.currentPosition.y + gesture.dy })
    } else {
      this.position.setValue({ y: this.props.upPosition.y - this._calculateEase(gesture) })
    }
  }

  _handlePanResponderRelease = (e, gesture) => {
    if (gesture.dy > this.props.toggleThreshold && this.props.currentPosition === this.props.upPosition) {
      this._transitionTo(this.props.downPosition, this.props.onCollapsed)
    } else if (
      gesture.dy < -this.props.toggleThreshold &&
      this.props.currentPosition === this.props.downPosition
    ) {
      this._transitionTo(this.props.upPosition, this.props.onExpanded)
    } else {
      this._transitionTo(this.props.upPosition, this.props.onExpanded)
      //this._resetPosition()
    }
  }

  // returns true if the swipe is within the height of the drawer.
  _swipeInBounds(gesture) {
    return this.props.currentPosition.y + gesture.dy > this.props.upPosition.y
  }

  _calculateEase(gesture) {
    return Math.min(Math.sqrt(gesture.dy * -1), Math.sqrt(this.props.screenHeight))
  }

  _transitionTo(position, callback) {
    Animated.spring(this.position, {
      toValue: position
    }).start(() => this.props.onExpanded())

    this.props.setCurrentPosition(position)
    callback()
  }

  _resetPosition() {
    Animated.spring(this.position, {
      toValue: this.props.currentPosition
    }).start()
  }

  hideTemporarily() {
    Animated.spring(this.position, {
      toValue: this.props.hidePosition + 10
    }).start()
  }
}

const styles = {
  animationContainer: (height, color, screenWidth, screenHeight) => ({
    width: screenWidth,
    position: "absolute",
    height: height + Math.sqrt(screenHeight),
    backgroundColor: color
  }),
  roundedEdges: rounded => {
    return (
      rounded == true && {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
      }
    )
  },
  shadow: shadow => {
    return {
      shadowColor: "#820931",
      shadowRadius: 4,
      shadowOpacity: 0.6
    }
  }
}
