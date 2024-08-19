const codeData = {
    defaultFunctions: {
        "jump": {
            function: null // Placeholder, will be set in game.js
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

export default codeData;
