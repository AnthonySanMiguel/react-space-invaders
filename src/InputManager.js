// Create a constant to assign more explicit names to numerical keyCodes

const KEY = {
    LEFT:  37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    A: 65,
    D: 68,
    W: 87,
    S: 83,
    SPACE: 32,
    ENTER: 13
};

export default class InputManager {
    constructor() {
        // Tracks which keys were pressed by the player
        this.pressedKeys = { left: 0, right: 0, up: 0, down: 0, space: 0, enter: 0 };
    }

    handleKeys(value, e){
        let keys = this.pressedKeys;

        switch (e.keyCode) {
            // Use left arrow or A key to move left
            case KEY.LEFT:
            case KEY.A:
                keys.left  = value;
                break;
            // Use right arrow or D key to move right
            case KEY.RIGHT:
            case KEY.D:
                keys.right  = value;
                break;
            // Use up arrow or W key to move up
            case KEY.UP:
            case KEY.W:
                keys.up  = value;
                break;
            // Use down arrow or S key to move down
            case KEY.DOWN:
            case KEY.S:
                keys.down  = value;
                break;
            // Use space bar to shoot
            case KEY.SPACE:
                keys.space  = value;
                break;
            // Use enter key to confirm menu selections
            case KEY.ENTER:
                keys.enter = value;
                break;
        }

        this.pressedKeys = keys;
    }

    // For the keyup event, we call with the value false and for the keydown event with true.
        // For example, when the A key is pressed down, handleKeys will be called with value == true and e.keyCode == KEY.A, so keys.left will be set to true;
        // As soon as the A key is released, the keydown event is triggered and keys.left is set back to false.

    bindKeys() {
        window.addEventListener('keyup',   this.handleKeys.bind(this, false));
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
    }

    unbindKeys() {
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
    }
}
