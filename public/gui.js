import * as game from './code.js'

const playerslist = document.getElementById('playersInput')
const startbutton = document.getElementById('startGame')
const bodyText = document.getElementById('bodyText')


const user = new game.player('Super Hero');

const selectOponent = () => {  
    let opponent
    switch (playerslist.value) {
        case "small":
            opponent = new game.player('Small Weak Dude');
            opponent.fillStrdPool()
            break;
        case "medium":
            opponent = new game.player('Mid Medium Man');
            opponent.setPool([2])
            break;
        case "big":
            opponent = new game.player('Big Bad Guy');
            opponent.setPool([2, 2, 2])
            break;
        default:
            console.log('something broke in selectOponent');
            break;
    }
    return opponent
}

startbutton.onclick = () => {
    const newGame = new game.game(user, selectOponent())
    newGame.startGame();
}