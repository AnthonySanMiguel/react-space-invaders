import React, {Component} from 'react';
import './App.css';
import TitleScreen from './ReactComponents/TitleScreen';
import InputManager from './InputManager';
const width = 800;
const height = window.innerHeight;
const ratio = window.devicePixelRatio || 1;

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: new InputManager(),
      screen: {
        width: width,
        height: height,
        ratio: ratio
      },
    }
  }

  componentDidMount() {
    this.state.input.bindKeys();
  }

  componentWillUnmount() {
    this.state.input.unbindKeys();
  }

  render() {
    return (
        <div>
          <TitleScreen />
          <canvas ref="canvas"
                  width={this.state.screen.width * this.state.screen.ratio}
                  height={this.state.screen.height * this.state.screen.ratio}/>
        </div>
    );
  }
}
export default App;
