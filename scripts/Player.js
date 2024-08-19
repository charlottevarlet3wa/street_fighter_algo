import Character from './Character.js';

class Player extends Character {
    constructor(x, y, color, controls) {
        super(x, y, color);
        this.controls = controls;
    }
}

export default Player;
