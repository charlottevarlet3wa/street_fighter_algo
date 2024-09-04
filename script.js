const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;

const pausePanel = document.getElementById('pause-panel');
let isPaused = true;  // Page is paused when loaded
let isStarted = false;

const startBtn = document.getElementById('start-btn');
const restartPanel = document.getElementById('restart-panel');
const endGameText = document.querySelector('#restart-panel p');

const errorMsg = document.querySelector('#routine-workspace .error');



class Fireball {
    constructor(x, y, direction, speed = 5, range = 100) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 10;
        this.color = 'orange';
        this.isDirectionLeft = direction === 'left';
        this.speed = direction === 'left' ? -speed : speed;
        this.range = range;
        this.distanceTraveled = 0;
    }

    move() {
        this.x += this.speed;
        this.distanceTraveled += Math.abs(this.speed);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    hasCollided(opponent) {
        return this.x < opponent.x + opponent.width &&
               this.x + this.width > opponent.x &&
               this.y < opponent.y + opponent.height &&
               this.y + this.height > opponent.y;
    }

    hasReachedMaxRange() {
        return this.distanceTraveled >= this.range;
    }
}



class Character {
    constructor(x, y, color, isDirectionLeft) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100; 
        this.color = color;
        this.health = 10;
        // this.element= this.createInstance();
        // Jump
        this.isJumping = false;
        this.initialY = y;
        // Attack
        this.health = 100;
        this.opponent = null;
        this.isDirectionLeft = isDirectionLeft;
        this.isHighAttacking = false;
        this.isLowAttacking = false;
        this.arm = {armWidth: 30, armHeight: 20, armY : this.y + 25};
        this.leg = {legWidth: 40, legHeight: 30, legY : this.y + this.height - 50};
        // IA
        this.isMovingTowards = false;
        // Reset
        this.resetData = {x : this.x, y : this.y, isDirectionLeft : this.isDirectionLeft};

        

    }

    reset(){
        this.x = this.resetData.x;
        this.y = this.resetData.y;
        this.health = 100;
        this.isDirectionLeft = this.resetData.isDirectionLeft;
        this.isHighAttacking = false;
        this.isLowAttacking = false;
        this.isMovingTowards = false;
    }

    moveTowards(target) {
        this.isMovingTowards = true; // L'ennemi commence à se déplacer vers le joueur
        const targetDistance = 30; // Distance minimale par rapport à la cible
        const moveSpeed = 5; // Vitesse de déplacement
    
        this.moveInterval = setInterval(() => { // Stocker l'intervalle pour pouvoir le clear
            const distance = Math.abs(this.x - target.x);
            
            // Mettre à jour la direction pour que l'ennemi soit toujours tourné vers le joueur
            this.isDirectionLeft = this.x > target.x;
            
            if (distance > targetDistance) {
                if (this.x < target.x) {
                    this.x += moveSpeed; // Avance vers la droite
                } else {
                    this.x -= moveSpeed; // Avance vers la gauche
                }
            } else {
                this.stopMoveTowards(); // Arrête le déplacement lorsque la distance cible est atteinte
            }
        }, 20); // Mettre à jour la position toutes les 20ms
    }
    
    // Méthode pour arrêter le déplacement
    stopMoveTowards() {
        clearInterval(this.moveInterval);
        this.isMovingTowards = false; // Réinitialise l'état de déplacement
    }
    
    
    
    

    // createInstance() {
    //     const block = document.createElement('div');
    //     block.textContent = "nouvelle div";
    //     document.getElementById('game').appendChild(block);
    // }

    moveRight() {
        this.x += 5;
        
        if(this.x >= canvasWidth - this.width){
            this.x = canvasWidth - this.width;
        }
        this.isDirectionLeft = false;
    }
    
    moveLeft() {
        this.x -= 5;
        if(this.x < 0){
            this.x = 0;
        }
        this.isDirectionLeft = true;
    }

    move(distance) {
        distance = +distance;
        this.x += distance;
        
        if(distance < 0) {
            this.isDirectionLeft = true;
            if(this.x <= 0) {
                this.x = 0;
            }
        } else if(distance > 0) {
            this.isDirectionLeft = false;
            if(this.x >= canvasWidth - this.width) {
                this.x = canvasWidth - this.width;
            }
        }
    }

    jump() {
        if(this.isJumping) return;

        this.isJumping = true;
        const jumpHeight = 80; // Hauteur du saut en pixels
        const jumpDuration = 20; // Durée du saut en millisecondes
    
        
        // Monter
        const upInterval = setInterval(() => {
            if (this.y > this.initialY - jumpHeight) {
                this.y -= 5;
            } else {
                clearInterval(upInterval);
    
                // Redescendre
                const downInterval = setInterval(() => {
                    if (this.y < this.initialY) {
                        this.y += 5;
                    } else {
                        this.y = this.initialY;
                        this.isJumping = false;
                        clearInterval(downInterval);
                    }
                }, jumpDuration / 2);
            }
        }, jumpDuration / 2);
        
        
    }
    
    jumpOf(height = 80, duration = 20) {
        if(this.isJumping) return;

        this.isJumping = true;
        const jumpHeight = height; // Hauteur du saut en pixels
        const jumpDuration = duration; // Durée du saut en millisecondes
    
        
        // Monter
        const upInterval = setInterval(() => {
            if (this.y > this.initialY - jumpHeight) {
                this.y -= 5;
            } else {
                clearInterval(upInterval);
    
                // Redescendre
                const downInterval = setInterval(() => {
                    if (this.y < this.initialY) {
                        this.y += 5;
                    } else {
                        this.y = this.initialY;
                        this.isJumping = false;
                        clearInterval(downInterval);
                    }
                }, jumpDuration / 2);
            }
        }, jumpDuration / 2);
    }

    crouch() {
        console.log('crouch');
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Eye
        if(this.isDirectionLeft){
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x + 10, this.y + 10, 10, 10);
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x + this.width / 2 + 10, this.y + 10, 10, 10);
        }
    
        if (this.isHighAttacking) {
            // Dessiner le bras pendant l'attaque
            // const armWidth = 30;
            // const armHeight = 20;
            // const armY = this.y + 25;
            const {armWidth, armHeight, armY} = this.arm;
    
            let armX;
            if (this.isDirectionLeft) {
                armX = this.x - armWidth; // Bras à gauche
            } else {
                armX = this.x + this.width; // Bras à droite
            }
    
            ctx.fillStyle = this.color; // Couleur du bras
            ctx.fillRect(armX, armY, armWidth, armHeight);
        }
    
        if (this.isLowAttacking) {
            // Dessiner le bras pendant l'attaque
            const legWidth = 40;
            const legHeight = 30;
            const legY = this.y + this.height - 50;
    
            let legX;
            if (this.isDirectionLeft) {
                legX = this.x - legWidth; // Bras à gauche
            } else {
                legX = this.x + this.width; // Bras à droite
            }
    
            ctx.fillStyle = this.color; // Couleur du bras
            ctx.fillRect(legX, legY, legWidth, legHeight);
        }
    }
    
    checkCollision() {
        const opponent = this.opponent;

        // Dimensions et position du bras
        const {armWidth, armHeight, armY} = this.arm;
        let armX;
    
        if (this.isDirectionLeft) {
            armX = this.x - armWidth; // Bras à gauche
        } else {
            armX = this.x + this.width; // Bras à droite
        }
    
        // Vérifier si le bras touche l'adversaire
        if (armX < opponent.x + opponent.width &&
            armX + armWidth > opponent.x &&
            armY < opponent.y + opponent.height &&
            armY + armHeight > opponent.y) {
            return true;
        }
        
        // Dimensions et position de la jambe
        const {legWidth, legHeight, legY} = this.leg;
        let legX;
    
        if (this.isDirectionLeft) {
            legX = this.x - legWidth; // Jambe à gauche
        } else {
            legX = this.x + this.width; // Jambe à droite
        }
    
        // Vérifier si la jambe touche l'adversaire
        if (legX < opponent.x + opponent.width &&
            legX + armWidth > opponent.x &&
            legY < opponent.y + opponent.height &&
            legY + legHeight > opponent.y) {
            return true;
        }
        return false;
    }
    

    highAttack() {
        if (this.isHighAttacking) return;
        
        this.isHighAttacking = true;
        
        // Vérifier la collision à chaque attaque
        if (this.checkCollision()) {
            const opponent = this.opponent;
            opponent.health -= 1; // Réduire les points de vie de l'adversaire
            opponent.recoil(10, this.isDirectionLeft);
        }
    
        // Durée de l'attaque
        setTimeout(() => {
            this.isHighAttacking = false;
        }, 100);
    }
    
    
    lowAttack() {
        if (this.isLowAttacking) return; // Nouveau: Empêche une nouvelle attaque si une est déjà en cours
    
        this.isLowAttacking = true;

        // Vérifier la collision à chaque attaque
        if (this.checkCollision()) {
            const opponent = this.opponent;
            opponent.health -= 3; // Réduire les points de vie de l'adversaire
            opponent.recoil(20, this.isDirectionLeft);
        }
        
        // Durée de l'attaque
        setTimeout(() => {
            this.isLowAttacking = false; // Réinitialiser l'état d'attaque après 100ms
        }, 100);
    }

    fireballAttack() {
        const opponent = this.opponent;
        // if (this.isHighAttacking) return;
    
        const direction = this.isDirectionLeft ? 'left' : 'right';
        const fireball = new Fireball(this.x, this.y + 40, direction); // Crée une boule de feu
        fireballs.push({ fireball, opponent }); // Ajouter la boule de feu au tableau
    }
    

    recoil(distance = 10, toLeft) {
        if (this.isMovingTowards) {
            this.stopMoveTowards(); // Arrête le déplacement si l'ennemi est en train de se déplacer vers le joueur
        }
    
        const recoilDistance = distance;
        const recoilSpeed = 5; // Vitesse de recul (pixels par frame)
        let targetX = toLeft ? this.x - recoilDistance : this.x + recoilDistance;
    
        const recoilInterval = setInterval(() => {
            if (toLeft) {
                if (this.x > targetX) {
                    this.x -= recoilSpeed;

                    if(this.x <= 0){
                        this.x = 0;
                        clearInterval(recoilInterval);
                        return;

                    }
                } else {
                    clearInterval(recoilInterval);
                }
            } else {
                if (this.x < targetX) {
                    this.x += recoilSpeed;
                    if(this.x >= canvasWidth - this.width){
                        this.x = canvasWidth - this.width;
                        clearInterval(recoilInterval);
                        return;

                    }
                } else {
                    clearInterval(recoilInterval);
                }
            }
        }, 20);
    }
    

    drawHealthBar(position) {
        const maxHealth = 100; // Santé maximale pour calculer la largeur de la barre de vie
        const barWidth = 200; // Largeur totale de la barre de vie
        const barHeight = 20; // Hauteur de la barre de vie
    
        // Calculer la largeur actuelle de la barre de vie
        const currentBarWidth = (this.health / maxHealth) * barWidth;
    
        // Position de la barre de vie
        let x, y = 20;
        if (position === 'left') {
            x = 20; // Barre de vie du joueur en haut à gauche
        } else if (position === 'right') {
            x = canvas.width - barWidth - 20; // Barre de vie de l'ennemi en haut à droite
        }
    
        // Dessiner le fond de la barre de vie
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(x, y, barWidth, barHeight);
    
        // Dessiner la barre de vie actuelle
        ctx.fillStyle = this.color;
        if (position === 'left') {
            ctx.fillRect(x, y, currentBarWidth, barHeight);
        } else if (position === 'right') {
            ctx.fillRect(x + (barWidth - currentBarWidth), y, currentBarWidth, barHeight);
        }
    }
    
    
    
    
}

class Player extends Character {
    constructor(x, y, color, isDirectionLeft, controls) {
        super(x, y, color, isDirectionLeft);   
        this.controls = controls;
    }



}

let player = new Player(100, 300, 'pink', false);
let enemy = new Character(650, 300, 'lightblue', true);
player.opponent = enemy;
enemy.opponent = player;

const fireballs = []; // Tableau pour stocker les boules de feu actives



const codeData = {
    defaultFunctions : {
       
    },
    functions : {
        "add1" : 
        { 
            params : ['value'],
            returnType: "int",
            instructions : [
                {
                    type: 'routine',
                    name: 'jump'
                },

            ]
        }
    },
    routines : {
        "jump" : 
        [
            player.jump.bind(player)
        ],
        'moveLeft' : 
        [
            player.moveLeft.bind(player)
        ],
        'moveRight': [player.moveRight.bind(player)],
        'highAttack': [player.highAttack.bind(player)],
        'lowAttack': [player.lowAttack.bind(player)],
        'fireballAttack': [player.fireballAttack.bind(player)],
        // 'doubleHighAttack': [
        //     player.highAttack.bind(player), 
        //     wait(150), 
        //     player.highAttack.bind(player)
        // ],
        'wait': [
            wait(150)
        ]
    },
    paramRoutines : {
        "jumpOf(height, duration)": {
            args: ['height', 'duration'],
            code: (height, duration) => player.jumpOf(height, duration) 
        },
        "move(distance)": {
            args: ['distance'],
            code: (distance) => player.move(distance)
        }
        // "wait": {
        //     args: ['duration'],
        //     code: (duration) => { return {type: 'wait', duration: parseInt(duration, 10)}; }
        // }

    },
    variables : {
        "defense" : 3,
        "attack" : 4,
        "jumpHeight" : 1,
        "speed" : 1
    },
    shortcuts : {
    }
};


// Initialize the pre-made functions and routines

codeData.defaultFunctions =  {
    "jump" : player.jump.bind(player),
    "highAttack" : player.highAttack.bind(player),
    "wait" : () => console.log("wait"), // comment faire pour ajouter un délai ?
    "log" : () => console.log("log"),
    "addOf" : (int1, int2) => console.log(`${int1} + ${int2} = ${int1 + int2}`)
}


codeData.shortcuts = {
    "d": {type: 'routine', name: 'moveRight', code: [player.moveRight.bind(player)]},
    "q": {type: 'routine', name: 'moveLeft', code: [player.moveLeft.bind(player)]},
    "z": {type: 'routine', name: 'jump', code: [player.jump.bind(player)]},
    "a": {type: 'routine', name: 'highAttack', code: [player.highAttack.bind(player)]},
    "w": {type: 'routine', name: 'lowAttack', code: [player.lowAttack.bind(player)]},
    "e": {type: 'routine', name: 'fireballAttack', code: [player.fireballAttack.bind(player)]},
    "r": {
        type: 'routine', 
        name: 'doubleHighAttack', 
        code: [
            player.highAttack.bind(player), 
            wait(150), 
            player.highAttack.bind(player),
        ]
    },
    "n": {type: 'param-routine', name: 'jumpOf200', code: [() => player.jumpOf(200, 10)]},
    
    // "a" : {type: 'routine', name: 'doubleHighAttack', code : [() => executeRoutine(codeData.routines.doubleHighAttack)],
};


// Fill the categories

const categories = document.querySelectorAll('.category .elements');

function updateCategoryElements() {
    // Vider les éléments parents avant d'ajouter de nouveaux enfants
    categories.forEach(category => {
        category.innerHTML = '';
    });

    // Routines
    Object.entries(codeData.routines).forEach((routine, i) => {
        const newBtn = document.createElement('li');
        newBtn.textContent = routine[0];
        newBtn.draggable = true;
        categories[0].appendChild(newBtn);
    });

    // Param routines
    Object.entries(codeData.paramRoutines).forEach((routine, i) => {
        const newBtn = document.createElement('li');
        newBtn.textContent = routine[0];
        newBtn.draggable = true;
        categories[1].appendChild(newBtn);
    });

}

function setupDraggableItems() {
    const draggableItems = document.querySelectorAll('.category .elements li');
    draggableItems.forEach(item => {
        item.addEventListener('dragstart', function(event) {
            console.log(event.target)
            event.dataTransfer.setData('text/plain', event.target.textContent);
        });
    });
}



updateCategoryElements();
setupDraggableItems();  // Call this right after updating elements

// Fill the workspaces

// containers for shortcut blocks, routine blocks, param routine blocks
const blocksContainers = document.querySelectorAll('.workspace .blocks');

class ShortcutBlock {
    constructor(key = '', routineName = '') {
        this.key = key;
        this.routineName = routineName;
        this.routineObject = {type:'routine', 'name' : routineName, code: [() => {}]}
        this.element = this.createElement();
    }

    createElement() {
        // const newBlock = document.createElement('p');
        // newBlock.textContent = this.key + " : " + this.routine;

        // Create the parent div with class "shortcut-block"
        const shortcutBlock = document.createElement('div');
        shortcutBlock.className = 'shortcut-block';

        // Create the condition div
        const conditionDiv = document.createElement('div');
        conditionDiv.className = 'condition';

        // Create the span element
        const spanElement = document.createElement('span');
        spanElement.textContent = 'key == ';

        // Create the select element with options
        const selectElement = document.createElement('select');
        const options = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            if(codeData.shortcuts[optionValue]){
                option.disabled = true;
            }
            if(optionValue === this.key){
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
        
        selectElement.addEventListener('change', (e) => {
            const oldKey = this.key;
            const routineName = this.routineName;
            const newKey = e.target.value;
            
            // Si on change le select key à "", retirer le raccourci de codeData
            if(e.target.value == ''){
                delete codeData.shortcuts[oldKey];
                return;
            }

            // Si c'est la première fois qu'on donne une valeur à select key (après l'ajout d'un bloc raccourci vide)
                // S'il n'y a pas de routine, alors juste modifier this.key
                // S'il y a aussi une routine, alors modifier codeData
            if(!oldKey) {
                this.key = newKey;
                if(!routineName) {
                    return;
                }
                const newRoutine = codeData.routines[newKey];
                const newRoutineObject = {type: 'routine', name: routineName, code: newRoutine };
                codeData.shortcuts[newKey] = newRoutineObject;
                updateShortcutBlocks();
            }
        });

        // Append the span and select to the condition div
        conditionDiv.appendChild(spanElement);
        conditionDiv.appendChild(selectElement);

        // Create the routine-block div
        const routineBlockDiv = document.createElement('div');
        routineBlockDiv.className = 'routine-block';

        // Create the routine select
        const routineSelectElement = document.createElement('select');
        const routineOptions = Object.keys(codeData.routines);

        const defaultOption = document.createElement('option');
        defaultOption.value = null;
        defaultOption.textContent = '';
        defaultOption.selected = true;
        routineSelectElement.appendChild(defaultOption);

        routineOptions.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            if(optionValue === this.routineName){
                option.selected = true;
                defaultOption.selected = false;
            }
            routineSelectElement.appendChild(option);
        })

        routineSelectElement.addEventListener('change', (e) => {
            const oldRoutineName = this.routineName;
            const newRoutineName = e.target.value;
            const newRoutineObject = {...this.routineObject, name: newRoutineName, code : codeData.routines[newRoutineName]};
            
            const oldKey = this.key;
            
            this.routineName = newRoutineName;
            this.routineObject = newRoutineObject;
            // Si this.key est '', alors actualise seulement this.routine et this.routineObject
            if(oldKey == ''){
                return;
            }

            // Sinon, actualise codeData.shortcuts
            codeData.shortcuts[oldKey] = newRoutineObject;
            updateShortcutBlocks();

        });

        // Create the input element
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = 'Routine';
        inputElement.setAttribute('data-accept-type', 'routine-name');

        // Append the input to the routine-block div
        // routineBlockDiv.appendChild(inputElement);
        routineBlockDiv.appendChild(routineSelectElement);

        // Append the conditionDiv and routineBlockDiv to the shortcutBlock
        shortcutBlock.appendChild(conditionDiv);
        shortcutBlock.appendChild(routineBlockDiv);

        return shortcutBlock;
    }
}

// Fill shortcut workspace 
function updateShortcutBlocks() {
    blocksContainers[0].innerHTML = '';
    Object.entries(codeData.shortcuts).forEach(([key, routine]) => {
        blocksContainers[0].appendChild(new ShortcutBlock(key, routine.name).element);
    })
}

updateShortcutBlocks();

document.getElementById('add-shortcut-block-btn').addEventListener('click', (e) => {
    blocksContainers[0].appendChild(new ShortcutBlock().element);
});


class StartBlock {
    constructor() {
        this.routineName = '';
        this.element = this.createElement();
    }

    createElement() {
        const block = document.createElement('p');
        block.textContent = 'DEBUT ';
        block.classList.add('block-element');
        block.classList.add('radius-block');

        const input = document.createElement('input');
        input.id = 'new-routine-name';
        input.placeholder = 'Nom'
        input.addEventListener('change', (e) => {
            const endBlock = document.getElementById('end-block');
            endBlock.textContent = e.target.value;
            endBlock.style.fontStyle = 'normal';
        } )

        block.appendChild(input);

        return block;
    }
}


class EndBlock {
    constructor() {
        this.routineName = '';
        this.element = this.createElement();
    }

    createElement() {
        const block = document.createElement('p');
        block.textContent = 'FIN ';
        block.classList.add('block-element');
        block.classList.add('radius-block');
        
        const routineName = document.createElement('span');
        routineName.textContent = 'Nom';
        routineName.id = 'end-block';
        routineName.style.fontStyle = 'italic';

        block.appendChild(routineName);
        return block;
    }
}

class RoutineBlock {
    constructor(id) {
        this.id = id;
        this.routineName = '';
        this.type = 'routine';
        this.args = [];
        this.element = this.createElement();
    } 

    createElement() {
        const block = document.createElement('p');
        block.classList.add('block-element');
        block.classList.add('routine-block');

        const select = document.createElement('select');
        select.classList.add('instruction');
        select.name = this.id;
        select.id = this.id;

        select.addEventListener('dragover', (e) => e.preventDefault());  // Permettre le drop
        select.addEventListener('dragenter', (e) => {
            e.preventDefault();
            select.classList.add('highlight');  // Facultatif: Ajouter une classe pour visualiser le drop possible
        });

        select.addEventListener('drop', (e) => {
            const routineName = e.dataTransfer.getData('text/plain');
            select.classList.remove('highlight');  // Retirer la classe de visualisation
            // Trouver et sélectionner l'option correspondante
            const matchingOption = Array.from(select.options).find(option => option.textContent === routineName);
            if (matchingOption) {
                select.value = matchingOption.value;
                this.routineName = matchingOption.value;
                select.dispatchEvent(new Event('change'));  // Déclencher l'événement change si nécessaire
            }
        });

        const options = Object.keys(codeData.routines);
        this.routineName = options[0];

        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            select.appendChild(option);
        });
        
        const lineOption = document.createElement('option');
        lineOption.disabled = true;
        lineOption.textContent = "------------------";
        select.appendChild(lineOption);

        const paramRoutineOptions = Object.keys(codeData.paramRoutines);
        paramRoutineOptions.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            this.routineName = e.target.value;
            this.args = []; // Réinitialiser les arguments
        
            // Supprimer les anciens inputs s'il y en a
            const existingInputs = this.element.querySelectorAll('input');
            existingInputs.forEach(input => input.remove());
        
            // Vérifier si c'est une 'param-routine' et ajouter des inputs
            if (Object.keys(codeData.paramRoutines).includes(this.routineName)) {
                this.type = 'param-routine';
                const paramRoutine = codeData.paramRoutines[this.routineName];
                
                paramRoutine.args.forEach(arg => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = arg;
                    input.addEventListener('input', (e) => {
                        // Stocker la valeur de l'input dans this.args
                        const index = paramRoutine.args.indexOf(arg);
                        this.args[index] = e.target.value;
                    });
                    this.element.appendChild(input);
                });
            } else {
                this.type = 'routine';
            }
        });
        

        block.appendChild(select);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'X';

        deleteBtn.addEventListener('click', (e) => {
            this.deleteBlock(e);
        })

        block.appendChild(deleteBtn);

        return block;
    }

    deleteBlock(e) {
        console.log('delete')
        const block = e.target.parentNode;
        const parent = block.parentNode;
    
        // Supprimer du routine workspace
        const plusButton = block.nextSibling;
        parent.removeChild(plusButton);
        parent.removeChild(block);
    
        const routineBlocksElems = document.querySelectorAll('#routine-workspace .routine-block select');
        console.log('routine blocks elems: ')
        console.log(routineBlocksElems)
        const routineBlocks = [];
        routineBlocksElems.forEach(elem => {
            console.log('elem :')
            console.log(elem.id)
            routineBlocks.push(elem.id);
        });
        console.log('routine blocks :')
        console.log(routineBlocks)

        console.log('this.id : ')
        console.log(this.id)


        
        // Supprimer le RoutineBlock concerné de newRoutineBlocks
        const index = newRoutineBlocks.findIndex(routine => routine.id === this.id);
        // const index = routineBlocks.findIndex(routine => routine === this.id);
        console.log('new routine blocks :')
        console.log(newRoutineBlocks)
        console.log(document.querySelectorAll('#routine-workspace .routine-block select'))
        console.log('index of delete:')
        console.log(index)
        if (index > -1) {
            newRoutineBlocks.splice(index, 1);
            // routineBlocks.splice(index, 1);
        }
    }
}

class AddRoutineButton {
    constructor(){
        this.element = this.createElement();
    }

    createElement() {
        const button = document.createElement('button');
        button.classList.add('plus');
        button.textContent = '+';
        button.addEventListener('click', (e) => {
            this.addRoutineBlock(e)
        });

        return button;
    }

    addRoutineBlock(e) {
        console.log('add')

        const parent = e.target.parentNode;
        const newRoutineBlock = new RoutineBlock(`r-${Date.now()}`);
        const newAddRoutinebutton = new AddRoutineButton().element;
    
        // Insérer dans le routine workspace
        parent.insertBefore(newRoutineBlock.element, e.target.nextSibling);
        parent.insertBefore(newAddRoutinebutton, newRoutineBlock.element.nextSibling);
    
        // Insérer le nouveau RoutineBlock dans newRoutineBlocks à la bonne position
        const index = Array.from(parent.children).indexOf(newRoutineBlock.element) / 2;
        console.log('index : ' + index)
        newRoutineBlocks.splice(index, 0, newRoutineBlock);
        console.log('new routine blocks : ')
        console.log(newRoutineBlocks)
    }
    
}

// Fill Routine workspace
blocksContainers[1].appendChild(new StartBlock().element);
blocksContainers[1].appendChild(new AddRoutineButton().element);

const newRoutineBlock = new RoutineBlock('r-1');
const newRoutineBlocks = [newRoutineBlock];
blocksContainers[1].appendChild(newRoutineBlock.element);
blocksContainers[1].appendChild(new AddRoutineButton().element);
blocksContainers[1].appendChild(new EndBlock().element);

document.getElementById('create-routine-btn').addEventListener('click', (e) => {
    const newRoutineName = document.getElementById('new-routine-name').value;

    const blocks = document.querySelectorAll('#routine-workspace select');

    const blockIds = Array.from(blocks).map(block => block.id);

    // Sort newRoutineBlocks according to the order of blockIds
    const sortedNewRoutineBlocks = blockIds.map(id => newRoutineBlocks.find(block => block.id === id)).filter(block => block !== undefined);
    
    if (newRoutineName == "") {
        errorMsg.textContent = 'Veuillez donner un nom à votre routine'
        return;
    }

    if (codeData.routines.hasOwnProperty(newRoutineName)) {
        errorMsg.textContent = 'Une routine avec ce nom existe déjà';
        return;
    }
    errorMsg.textContent = ''


    const instructions = [];

    sortedNewRoutineBlocks.forEach(routine => {
        if (routine.type == 'routine') {
            const code = codeData.routines[routine.routineName];
            instructions.push(...code);
        } else if (routine.type == 'param-routine') {
            // Construire la fonction pour une param-routine
            const paramRoutine = codeData.paramRoutines[routine.routineName];
            const code = () => paramRoutine.code(...routine.args);
            instructions.push(code);
        }
    });



    // Ajouter la nouvelle routine au codeData
    codeData.routines[newRoutineName] = instructions;

    updateCategoryElements();
    updateShortcutBlocks();



    const workspace = document.querySelector('#routine-workspace .blocks');
    
    // Supprime tous les enfants sauf les blocs spécifiques
    while (workspace.firstChild) {
        workspace.removeChild(workspace.firstChild);
    }

    newRoutineBlocks.length = 0;

    // Crée et ajoute les éléments nécessaires
    const startBlock = new StartBlock();
    workspace.appendChild(startBlock.element);

    const addButton = new AddRoutineButton();
    workspace.appendChild(addButton.element);

    const endBlock = new EndBlock();
    workspace.appendChild(endBlock.element);  
    
});



// UI

// TOOLBOX MENU

const toolboxBtns = document.querySelectorAll('.toolbox-btn');
const workspaces = document.querySelectorAll('.workspace');

// Hide all workspaces except the one selected
toolboxBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        toolboxBtns.forEach((btn, j) => {
            btn.classList.remove('active');
            workspaces[j].style.display = 'none';
        }); 
        btn.classList.add('active'); 
        workspaces[i].style.display = 'block';
        
    });
});



document.addEventListener('keydown', (e) => {
    if (codeData.shortcuts[e.key]) {
        executeActionsWithDelay(codeData.shortcuts[e.key].code);
    }
});

function executeActionsWithDelay(actions, index = 0) {
    if (index >= actions.length) return;

    const action = actions[index];

    if (typeof action === 'function') {
        action();
        executeActionsWithDelay(actions, index + 1);
    } else if (action.type === 'wait') {
        setTimeout(() => {
            executeActionsWithDelay(actions, index + 1);
        }, action.duration);
    }
}


// function executeActionsWithDelay(actions, index = 0) {
//     console.log('execute actions')
//     console.log('actions :')
//     console.log(actions)
//     console.log('index :')
//     console.log(index)
//     if (index >= actions.length) return;

//     const action = actions[index];
//     console.log('action :')
//     console.log(action)

//     console.log('type of action :')
//     console.log(typeof action)
    
//     if (typeof action === 'function') {
//         action();
//         executeActionsWithDelay(actions, index + 1);
//     } else if (action.type === 'wait') {
//         setTimeout(() => {
//             executeActionsWithDelay(actions, index + 1);
//         }, action.duration);
//     }
// }

// function wait(duration) {
//     return new Promise(resolve => setTimeout(resolve, duration));
// }


// TEST
function wait(duration) {
    return { type: 'wait', duration: duration };
}





function sub(a, b){
    return a - b;
}

function add(a, b){
    return a + b;
}

// INITIALISATION

// SHORTCUTS
class Tool {
    constructor(name) {
        this.color = 'red';
        this.name = name;
        this.element = this.createElement();
    }
    
    createElement() {
        const el = document.createElement('div');
        el.textContent = this.color;
        document.getElementById('toolkit').appendChild(el);
        return el;
    }
}

class FunctionTool extends Tool {
    constructor(name) {
        super(name);
        this.color = 'blue';
        this.element = this.createElement();
    }
    
    createElement() {
        const el = document.createElement('div');
        el.textContent = this.color;
        // document.getElementById('toolkit').appendChild(el);
    }
}

const functionTools = [...Object.keys(codeData.defaultFunctions), ...Object.keys(codeData.functions)];
functionTools.map(tool => new FunctionTool(tool));

function enemyAI() {
    const distance = Math.abs(player.x - enemy.x);

    // Mettre à jour l'orientation de l'ennemi en fonction de la position du joueur
    enemy.isDirectionLeft = enemy.x > player.x;

    if (enemy.isMovingTowards) {
        return; // Ne rien faire si l'ennemi est en train de se déplacer vers le joueur
    }

    if (distance < 50) {
        enemy.highAttack();
    } else if (distance < 100) {
        enemy.lowAttack();
    } else if (distance < 200) {
        enemy.fireballAttack();
    } else {
        // Avancer vers le joueur jusqu'à être à 30px de distance
        enemy.moveTowards(player);
    }

    // Définir le prochain mouvement de l'IA après 2 à 3 secondes
    setTimeout(enemyAI, Math.random() * 1000 + 2000);
}



function gameLoop() {
    if(isPaused) return; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les barres de vie
    player.drawHealthBar('left');
    enemy.drawHealthBar('right');

    // Dessiner les personnages
    player.draw();
    enemy.draw();

    // Déplacer et dessiner les boules de feu
    fireballs.forEach((item, index) => {
        const { fireball, opponent } = item;

        fireball.move();
        fireball.draw();

        // Vérifier la collision
        if (fireball.hasCollided(opponent)) {
            opponent.health -= 1;
            opponent.recoil(100, fireball.isDirectionLeft);
            fireballs.splice(index, 1); // Supprimer la boule de feu après la collision
        } else if (fireball.hasReachedMaxRange()) {
            fireballs.splice(index, 1); // Supprimer la boule de feu après avoir atteint sa portée maximale
        }
    });

    if(enemy.health <= 0) {
        endGame(player);
    } else if(player.health <= 0){
        endGame(enemy);
    }
    
    requestAnimationFrame(gameLoop);
}


function resetGame(){
    isPaused = true;
    isStarted = false;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.reset();
    enemy.reset();

    player.drawHealthBar('left');
    enemy.drawHealthBar('right');

    player.draw();
    enemy.draw();

    restartPanel.style.display = 'flex';    
}

resetGame();
endGameText.style.display = 'none';


startBtn.addEventListener('click', () => { 
    endGameText.style.display = 'block';
    restartPanel.style.display = 'none'
    isPaused = false;
    isStarted = true;

    gameLoop();
    enemyAI();
    
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {  // Press 'p' to toggle pause
        isPaused = !isPaused;
        if (!isPaused) {
            pausePanel.style.display = 'none';
            gameLoop();  // Resume the game loop if unpaused
        } else if(isStarted){
            pausePanel.style.display = 'flex';
        }
    }
});

function endGame(winner) {
    if(winner === player){
        endGameText.textContent = 'Well done !';
    } else if(winner === enemy) {
        endGameText.textContent = 'Try again !';
    }
    restartPanel.style.display = 'block';
    resetGame();
}