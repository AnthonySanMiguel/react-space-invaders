// Full credit to https://cheesyprogrammer.com/2017/09/25/game-programming-using-javascript-react-canvas2d-and-css-part-1/ for the tutorial and code.

import React, { Component } from 'react';
import InputManager from './InputManager';
import TitleScreen from './ReactComponents/TitleScreen';
import GameOverScreen from './ReactComponents/GameOverScreen';
import ControlOverlay from './ReactComponents/ControlOverlay';
import Ship from './GameComponents/Ship';
import Invader from './GameComponents/Invader';
import { checkCollisionsWith, checkCollision } from './Helper';
import './App.css';

// Canvas width and height
const width = 800;
const height = window.innerHeight;

const GameState = {
    StartScreen : 0,
    Playing : 1,
    GameOver : 2
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: new InputManager(),
            screen: {
                width: width,
                height: height,
                ratio: window.devicePixelRatio || 1
            },
            // Starting score
            score: 0,
            gameState: GameState.StartScreen,
            previousState: GameState.StartScreen,
            context: null
        };

        this.ship = null;
        this.invaders = [];
        this.lastStateChange = 0;
        this.previousDelta = 0;
        this.fpsLimit = 30;
        this.showControls = false;
    }

    handleResize(value, e){
        this.setState({
            screen : {
                width: width,
                height: height,
                ratio: window.devicePixelRatio || 1,
            }
        });
    }

    // Upon player "death"...
    die() {
        // Set game state to "Game Over"
        this.setState({ gameState: GameState.GameOver });
        // Remove player ship from canvas
        this.ship = null;
        // Remove all enemies from canvas (e.g. from enemy array)
        this.invaders = [];
        this.lastStateChange = Date.now();
    }

    increaseScore(val) {
        // For every enemy destroyed, add 500 points
        this.setState({ score: this.state.score + 500 });
    }

    // Cleans up the canvas before draw new content onto it.
    clearBackground() {
        const context = this.state.context;
        context.save();
        context.scale(this.state.screen.ratio, this.state.screen.ratio);
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;
    }

    startGame() {
        let ship = new Ship({
            onDie: this.die.bind(this),
            // Set x and y position so that the ship will be drawn in the lower middle of the screen.
            position: {
                x: this.state.screen.width/2,
                y: this.state.screen.height - 50
            }});
        this.ship = ship;

        // Number of enemies that spawn
        this.createInvaders(27);

        this.setState({
            gameState: GameState.Playing,
            // Reset the score each time StartGame is called so score doesn't accumulate over multiple play sessions
            score: 0
        });
        this.showControls = true;
    }

    // To actually switch from the initial state to the Playing state, we have to wait for the user to press the Enter button.
    // Since we have to react to user-input continuously, we will create a game loop that runs as long as the application itself is running.
    // To do so, we will add an update method, that continuously calls itself after each run:
    update(currentDelta) {
        let delta = currentDelta - this.previousDelta;

        if (this.fpsLimit && delta < 1000 / this.fpsLimit) {
            return;
        }

        const keys = this.state.input.pressedKeys;
        const context = this.state.context;

        //  If you start the application and press the Enter key, the title screen should disappear.
        if (this.state.gameState === GameState.StartScreen && keys.enter && Date.now() - this.lastStateChange > 2000) {
            this.clearBackground();
            this.startGame();
        }

        // Allows us to transition from the GameOver-screen back to the Start-screen.
        if (this.state.gameState === GameState.GameOver && keys.enter) {
            this.clearBackground();
            this.setState({ gameState: GameState.StartScreen});
        }

        if (this.state.gameState === GameState.Playing && Date.now() - this.lastStateChange > 500) {
            if (this.state.previousState !== GameState.Playing) {
                this.lastStateChange = Date.now();
            }

            if (this.invaders.length === 0) {
                this.setState({ gameState: GameState.GameOver });
            }

            context.save();
            context.scale(this.state.screen.ratio, this.state.screen.ratio);

            context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
            context.globalAlpha = 1;
            // Check for a collision between player-fired bullets and invaders.
            // If true, the affected invader will be destroyed.
            checkCollisionsWith(this.ship.bullets, this.invaders);
            // Check for a collision between player ship and invaders.
            // If true, the player ship will be destroyed.
            checkCollisionsWith([this.ship], this.invaders);

            if (keys.space || keys.left || keys.right) {
                this.showControls = false;
            }

            for (let i = 0; i < this.invaders.length; i++) {
                // Check for a collision between invader-fired bullets and player ship.
                // If true, the player ship will be destroyed.
                checkCollisionsWith(this.invaders[i].bullets, [this.ship]);
            }

            if (this.ship !== null) {
                this.ship.update(keys);
                this.ship.render(this.state);
            }

            this.renderInvaders(this.state);
            this.setState({previousState: this.state.gameState});
            context.restore();
        }

        requestAnimationFrame(() => {this.update()});
    }

    // Initializes our invaders array and sets their positions.
    // It places each invader on the right side of the previous one.
    // If there is no space, the next invader will be drawn on a new row.
    createInvaders(count) {
        const newPosition = { x: 100, y: 20 };
        let swapStartX = true;

        for (let i = 0; i < count; i++) {
            const invader = new Invader({
                position: { x: newPosition.x, y: newPosition.y },
                // When an invader is destroyed (e.g. "onDie", add to the score)
                onDie: this.increaseScore.bind(this, false)
            });

            newPosition.x += invader.radius + 20;

            if (newPosition.x + invader.radius + 50 >= this.state.screen.width) {
                newPosition.x = swapStartX ? 110 : 100;
                swapStartX = !swapStartX;
                newPosition.y += invader.radius + 20;
            }

            this.invaders.push(invader);
        }
    }

    // Contains the logic for drawing our invaders and keeping them inbound while moving.
    // If an invader is deleted (delete === true), it will be removed from the array.
    renderInvaders(state) {
        let index = 0;
        let reverse = false;

        for (let invader of this.invaders) {
            if (invader.delete) {
                this.invaders.splice(index, 1);
            }
            else if (invader.position.x + invader.radius >= this.state.screen.width ||
                invader.position.x - invader.radius <= 0) {
                reverse = true;
            }
            else {
                this.invaders[index].update();
                this.invaders[index].render(state);
            }
            index++;
        }

        if (reverse) {
            this.reverseInvaders();
        }
    }

    // If any of our invaders reaches either edge of the screen, we call the reverseInvaders method which in turn calls the reverse method of each invader, thus changing its direction.
    reverseInvaders() {
        let index = 0;
        for (let invader of this.invaders) {
            this.invaders[index].reverse();
            this.invaders[index].position.y += 50;
            index++;
        }
    }

    componentDidMount() {
        window.addEventListener('resize',  this.handleResize.bind(this, false));
        // Our bindKeys and unbindKeys methods will be called when we load and unload our app, respectively:
        this.state.input.bindKeys();
        const context = this.refs.canvas.getContext('2d');
        this.setState({ context: context });

        requestAnimationFrame(() => {this.update()});
    }

    componentWillUnmount() {
        this.state.input.unbindKeys();
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        return (
            <div>
                { this.showControls && <ControlOverlay /> }
                {/* If game state = "StartScreen", show the title screen */}
                { this.state.gameState === GameState.StartScreen && <TitleScreen /> }
                {/* If game state = "GameOver", show the game over screen */}
                { this.state.gameState === GameState.GameOver && <GameOverScreen score= { this.state.score } /> }
                <canvas ref="canvas"
                        width={ this.state.screen.width * this.state.screen.ratio }
                        height={ this.state.screen.height * this.state.screen.ratio }
                />
            </div>
        );
    }
}

export default App;
