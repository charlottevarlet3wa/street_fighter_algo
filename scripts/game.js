import Player from './Player.js';
import Character from './Character.js';

const player = new Player(0, 0, 'pink', { left: 'a', right: 'd' });
const enemy = new Character(0, 0, 'red');

const codeData = {
    defaultFunctions: {
        "jump": {
            function: player.jump.bind(player)
        }
    },
    functions: {
        "add1": {
            params: ['value'],
            returnType: "int",
            instructions: [
                {
                    type: 'routine',
                    name: 'jump'
                },
            ]
        }
    },
    routines: {
        "jump": {
            code: 'jump();'
        }
    },
    paramRoutines: {
        "jump1": {
            params: [
                {
                    type: 'int',
                    name: 'height'
                }
            ]
        }
    },
    variables: {},
    shortcuts: {}
};

const data2 = {
    "key": "value"
};

console.log(data2['key']);
codeData.defaultFunctions["jump"].function();
