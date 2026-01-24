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
    const [p1, p2] = data.players;

    const isP1Turn = data.currentplayer?.id
        ? data.currentplayer.id === p1.id
        : data.currentplayer.name === p1.name;

    const p1Round = isP1Turn ? data.roundScore : 0;
    const p2Round = isP1Turn ? 0 : data.roundScore;

    const p1Sel = isP1Turn ? data.selectedScore : 0;
    const p2Sel = isP1Turn ? 0 : data.selectedScore;

    bodyText.innerHTML = `
        <table>
        <tr>
            <th>${p1.name}</th>
            <th>Goal</th>
            <th>${p2.name}</th>
        </tr>
        <tr>
            <td>${p1.score}</td>
            <td>${data.winThreshhold}</td>
            <td>${p2.score}</td>
        </tr>
        <tr>
            <td>${p1Round}</td>
            <td>Round</td>
            <td>${p2Round}</td>
        </tr>
        <tr>
            <td>${p1Sel}</td>
            <td>Selected</td>
            <td>${p2Sel}</td>
        </tr>
        </table>
    `;
}

const renderDice = () => {
    utils.removeAllChildren(diceCont)    
    const data = newGame.getGameState(); 
    const selectedIds = new Set(newGame.heldDice);
    console.log(data.roll);
    
    data.roll.forEach((e,i,a) => {
        const isSelected = selectedIds.has(e.uniqId);        
        diceCont.appendChild(DiceMaker(e, isSelected));
    });
    console.log(selectedIds);
    
}

const DiceMaker = (diceObj, selected) => {
    const dice = document.createElement('div')
    dice.style.width = '20px'
    dice.style.height = '20px'
    dice.innerText = diceObj.result
    if(selected){dice.style.border = '2px red solid'}
    else{dice.style.border = '2px transparent solid'}
    dice.addEventListener('click', () => {
        newGame.userSelects(diceObj.uniqId)
        buttonControl()
        updateText()
        renderDice()
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