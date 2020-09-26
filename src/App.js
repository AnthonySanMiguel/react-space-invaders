import React, {Component} from 'react';
import './App.css';

const width = 800;
const height = window.innerHeight;
const ratio = window.devicePixelRatio || 1;

class App extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: width,
        height: height,
        ratio: ratio
      },
    }
  }

  render() {

    return (
        <div>
          <canvas ref="canvas"
                  width={this.state.screen.width * this.state.screen.ratio}
                  height={this.state.screen.height * this.state.screen.ratio}/>
        </div>
    );
  }
}
export default App;
