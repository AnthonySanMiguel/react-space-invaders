export function	checkCollisionsWith(items1, items2) {
    let a = items1.length - 1;
    let b;
    for(a; a > -1; --a){
        b = items2.length - 1;
        for(b; b > -1; --b){
            // Takes two arrays of game objects and checks each item from the first list for collisions with each item from the second list.
            const item1 = items1[a];
            const item2 = items2[b];
            // If there is a collision, we call the die method of the affected objects (e.g. player ship, player-fired bullets, invaders, or invader-fired bullets).
            if(checkCollision(item1, item2)){
                item1.die();
                item2.die();
            }
        }
    }
}

export function checkCollision(obj1, obj2) {
    // Calculates the Euclidean distance between two objects.
    const vx = obj1.position.x - obj2.position.x;
    const vy = obj1.position.y - obj2.position.y;
    const length = Math.sqrt(vx * vx + vy * vy);
    // If it is smaller than the sum of their radiuses, both objects overlap with each other and we have a collision.
    if(length < obj1.radius + obj2.radius) {
        return true;
    }
    return false;
}
