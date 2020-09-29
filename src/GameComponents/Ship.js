import Bullet from './Bullet';
import GameObject from './GameObject';

export default class Ship extends GameObject {
    constructor(args) {
        super({ position: args.position, onDie: args.onDie, speed: 2.5, radius: 15 });
        this.bullets = [];
        this.lastShot = 0;
    }

    // Responsible for updating the position of the ship according to user input:
    update(keys) {
        // Increment/decrement the x coordinate of the ship position.
        // This way the ship will move left or right depending on the pressed keys.
        if (keys.right) {
            this.position.x += this.speed; // Increment (move to the right [+] on the x axis)
        } else if (keys.left) {
            this.position.x -= this.speed; // Decrement (move to the left [-] on the x axis)
        }

        // We check if the space key is pressed and if at least 250ms have passed since the last bullet was fired.
        // Then we add a new bullet at the ship’s position and set its direction to “up”, so it moves upwards away from the player and towards the enemies.
        if (keys.space && Date.now() - this.lastShot > 250) {
            const bullet = new Bullet({
                position: { x: this.position.x, y : this.position.y - 5 },
                // Ensures projectiles fired move upwards
                direction : "up"
            });

            this.bullets.push(bullet);
            this.lastShot = Date.now();
        }
    }

    renderBullets(state) {
        let index = 0;
        // We loop through the bullets array and call each bullet’s update and render methods.
        for (let bullet of this.bullets) {
            // When a bullet is deleted, we remove it from the array via the splice method.
            if (bullet.delete) {
                this.bullets.splice(index, 1);
            } else {
                this.bullets[index].update();
                this.bullets[index].render(state);
            }
            index++;
        }
    }

    render(state) {
        // Ensures our ship stays within the frame.
        if(this.position.x > state.screen.width) {
            // Set the ships position.x to 0 when it leaves the screen on the right side...
            this.position.x = 0;
        }
        else if(this.position.x < 0) {
            // and to the width of the screen when it leaves on the left side.
            this.position.x = state.screen.width;
        }
        if(this.position.y > state.screen.height) {
            this.position.y = 0;
        }
        else if(this.position.y < 0) {
            this.position.y = state.screen.height;
        }

        this.renderBullets(state);

        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.strokeStyle = '#ffffff';
        context.fillStyle = '#ffffff';
        context.lineWidth = 2;
        // Lines which 'draw' the shape of the ship on the canvas
        context.beginPath();
        context.moveTo(0, -25);
        context.lineTo(15, 15);
        context.lineTo(5, 7);
        context.lineTo(-5, 7);
        context.lineTo(-15, 15);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
}
