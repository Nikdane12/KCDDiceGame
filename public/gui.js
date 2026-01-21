import * as game from './code.js'


const playerslist = document.getElementById('playersInput')
const startbutton = document.getElementById('startGame')
const bodyText = document.getElementById('bodyText')

const continueButton = document.getElementById('continueButton')
const saveButton = document.getElementById('saveButton')
const passButton = document.getElementById('passButton')

const diceCont = document.getElementById('diceCont')

let newGame;

const user = new game.player('Henry of Skalitz');

const selectOponent = () => {  
    let opponent
    switch (playerslist.value) {
        case "small":
            opponent = new game.player('Small Weak Dude');
            break;
        case "medium":
            opponent = new game.player('Mid Medium Man', [2]);
            break;
        case "big":
            opponent = new game.player('Big Bad Guy', [2, 2, 2]);
            break;
        default:
            console.log('something broke in selectOponent');
            break;
    }
    return opponent
}

const buttonControl = () => {
    let data = newGame?.getGameState()
    saveButton.disabled = !(data?.canSave)    
    continueButton.disabled = !(data?.canSave) 
    passButton.disabled = !(data)
}
buttonControl()


startbutton.onclick = () => {
    newGame = new game.game(user, selectOponent())
    newGame.startGame();
    updateText();
    buttonControl()
    renderDice()
}

const updateText = () => {
    let data = newGame.getGameState()
    let text = `
    Player: ${data.currentplayer.name}
    Game Score: ${data.currentplayer.score}
    Round Score: ${data.roundScore}
    Selected Score: ${data.selectedScore}
    `
    bodyText.innerText = text;
}

const renderDice = () => {   
    newGame.getGameState().roll.forEach(e => {
        diceCont.appendChild(DiceMaker(e))       
    });
}

const DiceMaker = (diceObj) => {
    const dice = document.createElement('div')
    dice.style.width = '20px'
    dice.style.height = '20px'
    dice.innerText = diceObj.result
    dice.addEventListener('click', () => {
        console.log(diceObj);
    })
    return dice
}