import React, { Component } from "react"
import { View } from "react-native"
import Orientation from "react-native-orientation"
import Animator from "./Animator"

export default class BottomDrawer extends Component {
  constructor(props) {
    super(props)

    /**
     * TOGGLE_THRESHOLD is how much the user has to swipe the drawer
     * before its position changes between up / down.
     */
    this.TOGGLE_THRESHOLD = this.props.containerHeight / 11
    this.DOWN_DISPLAY = this.props.downDisplay || this.props.containerHeight / 1.5

    /**
     * UP_POSITION and DOWN_POSITION calculate the two (x,y) values for when
     * the drawer is swiped into up position and down position.
     */
    this.UP_POSITION = this._calculateUpPosition(
      this.props.ScreenService.verticalSizeForPhone.height,
      this.props.containerHeight,
      this.props.offset
    )
    this.DOWN_POSITION = this._calculateDownPosition(this.UP_POSITION, this.DOWN_DISPLAY)
    this.HIDDEN_POSITION = this.props.ScreenService.verticalSizeForPhone.height //0 //this.DOWN_DISPLAY

    this.state = { currentPosition: this.props.startUp ? this.UP_POSITION : this.DOWN_POSITION }
  }

  componentDidMount() {
    if (this.props.ScreenService.isTablet()) {
      this.callbackOrientationUpdate = this._updateOrientation.bind(this)
      Orientation.addOrientationListener(this.callbackOrientationUpdate)
    }
  }

  componentWillUnmount() {
    if (this.props.ScreenService.isTablet()) {
      Orientation.removeOrientationListener(this.callbackOrientationUpdate)
      Orientation.unlockAllOrientations()
    }
  }

  _updateOrientation(or) {
    if (or != "UNKNOWN") {
      this.TOGGLE_THRESHOLD = this.props.containerHeight / 11
      this.DOWN_DISPLAY = this.props.downDisplay || this.props.containerHeight / 1.5

      /**
       * UP_POSITION and DOWN_POSITION calculate the two (x,y) values for when
       * the drawer is swiped into up position and down position.
       */
      this.UP_POSITION = this._calculateUpPosition(
        this.props.ScreenService.verticalSizeForPhone.height,
        this.props.containerHeight,
        this.props.offset
      )
      this.DOWN_POSITION = this._calculateDownPosition(this.UP_POSITION, this.DOWN_DISPLAY)
      this.HIDDEN_POSITION = this.props.ScreenService.verticalSizeForPhone.height

      this.setState({ currentPosition: this.props.startUp ? this.UP_POSITION : this.DOWN_POSITION })

      // this.forceUpdate()
      this.animator.hideTemporarily()
    }
  }

  render() {
    return (
      <Animator
        screenWidth={this.props.ScreenService.verticalSizeForPhone.width}
        screenHeight={this.props.ScreenService.verticalSizeForPhone.height}
        ref={anim => (this.animator = anim)}
        currentPosition={this.state.currentPosition}
        setCurrentPosition={position => this.setCurrentPosition(position)}
        toggleThreshold={this.TOGGLE_THRESHOLD}
        upPosition={this.UP_POSITION}
        downPosition={this.DOWN_POSITION}
        hidePosition={this.HIDDEN_POSITION}
        roundedEdges={this.props.roundedEdges}
        containerHeight={this.props.containerHeight}
        backgroundColor={this.props.backgroundColor}
        onExpanded={() => null}
        onCollapsed={() => null}
      >
        {this.props.children}

        <View
          style={{
            height: Math.sqrt(this.props.ScreenService.verticalSizeForPhone.height),
            backgroundColor: this.props.backgroundColor
          }}
        />
      </Animator>
    )
  }
  setCurrentPosition(position) {
    this.setState({ currentPosition: position })
  }
  hideBottomDrawer(hide) {
    if (hide) {
      this.animator.hideTemporarily()
    } else {
      this.animator._resetPosition()
    }
  }
  _calculateUpPosition(screenHeight, containerHeight, offset) {
    return { x: 0, y: screenHeight - (containerHeight + offset) }
  }
  _calculateDownPosition(upPosition, downDisplay) {
    return { x: 0, y: upPosition.y + downDisplay }
  }
}
