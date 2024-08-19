class Character {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.health = 10;
        this.element = this.createInstance();
    }

    createInstance() {
        const block = document.createElement('div');
        block.textContent = "nouvelle div";
        block.style.backgroundColor = this.color;
        document.getElementById('game').appendChild(block);
        return block;
    }

    move(distance) {
        console.log('move left');
    }

    jump() {
        console.log('jump');
    }
    
    jumpHigh(height) {
        console.log('jump high of ' + height + 'px');
    }

    crouch() {
        console.log('crouch');
    }
}

export default Character;
