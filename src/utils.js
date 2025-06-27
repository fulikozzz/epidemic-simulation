export function genRandomPosition(width, height){
    return {
        x: Math.random() * (width - 10) + 5,
        y: Math.random() * (height- 10) + 5
    }
}

export function genRandomVelocity(speed){
    const angle = Math.random() * 2 * Math.PI;
    //const speed = Math.random() * 1.5 + 1.5;
    return {
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed
    }
}
