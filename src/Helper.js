export function	checkCollisionsWith(items1, items2) {
    let a = items1.length - 1;
    let b;
    for(a; a > -1; --a){
        b = items2.length - 1;
        for(b; b > -1; --b){
            const item1 = items1[a];
            const item2 = items2[b];
            if(checkCollision(item1, item2)){
                item1.die();
                item2.die();
            }
        }
    }
}

export function checkCollision(obj1, obj2) {
    const vx = obj1.position.x - obj2.position.x;
    const vy = obj1.position.y - obj2.position.y;
    const length = Math.sqrt(vx * vx + vy * vy);
    if(length < obj1.radius + obj2.radius) {
        return true;
    }
    return false;
}
