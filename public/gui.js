import * as game from './code.js'
import * as utils from './utils.js'


const playerslist = document.getElementById('playersInput')
const startbutton = document.getElementById('startGame')
const bodyText = document.getElementById('bodyText')

const continueButton = document.getElementById('continueButton');
continueButton.addEventListener('click', () => {
    newGame.continueAction();
    foo();
})
const saveButton = document.getElementById('saveButton')
saveButton.addEventListener('click', () => {
    newGame.saveAction();
    foo();    
})
const passButton = document.getElementById('passButton')
passButton.addEventListener('click', () => {
    newGame.passAction();
    foo();    
})

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

const foo = () => {
    updateText();
    buttonControl();
    renderDice();
}

const buttonControl = () => {
    let data = newGame?.getGameState()
    saveButton.disabled = !(data?.canSave)    
    continueButton.disabled = !(data?.canSave) 
    passButton.disabled = (data?.bust)
}
buttonControl()


startbutton.onclick = () => {
    newGame = new game.game(user, selectOponent())
    newGame.startGame();
    foo();
}

const updateText = () => {
    let data = newGame.getGameState()
    // let text = `
    // Player: ${data.currentplayer.name}
    // Game Score: ${data.currentplayer.score}
    // Round Score: ${data.roundScore}
    // Selected Score: ${data.selectedScore}
    // `   
    let text = `
    ${data.players[0].name} Goal ${data.players[1].name}
    ${data.players[0].score} ${data.winThreshhold} ${data.players[1].score}
    ${data.roundScore} Round ${data.roundScore}
    ${data.selectedScore} Selected ${data.selectedScore}
    `
    bodyText.innerText = text;
}

const renderDice = () => {
    utils.removeAllChildren(diceCont)   
    newGame.getGameState().roll.forEach(e => {
        diceCont.appendChild(DiceMaker(e)); 
    });
}

const DiceMaker = (diceObj) => {
    const dice = document.createElement('div')
    dice.style.width = '20px'
    dice.style.height = '20px'
    dice.innerText = diceObj.result
    dice.addEventListener('click', () => {
        newGame.userSelects(diceObj.uniqId)
        buttonControl()
        updateText()
        console.log(newGame.heldDice);
        
    })
    return dice
}

/*
Henry   Goal        Opponent
0       4000        9000
200     Round       0
0       Selected    0

Hold Die
Score and Continue
Score and Pass
Give up
*/