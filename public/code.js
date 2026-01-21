export class game{

    turn = -1;
    currentplayer;
    playingDice = [];
    heldDice = [];
    players = [];
    bust = false;
    roundScore = 0;
    winThreshhold = 2000;
    gameStates = {won: 'won', playing: 'playing', notplaying: 'notplaying'}
    gameState = this.gameStates.notplaying


    /*
    before Start 
    start turn 0 (rolls, check for bust, no bust => allow selection, stop)
    user/npc selects dice
    user/npc selects next action:
        cont => roll again
        save => next turn
        pass => next turn
    
    
    
    */

    constructor(playerA, playerB){
        if(!(playerA || playerB)) throw Error('no players')
        this.players = [playerA, playerB];
        
        // Player A score & Player B score
    }

    getPlayers(){
        return this.players
    }

    getGameState(){
        return {
            currentplayer: this.currentplayer,
            players: this.players,
            canSave: this.calcScore(this.heldDice) > 0,
            roll: this.playingDice.map(x=>({id:x.id, result:x.result})), 
            bust: this.bust,
            selectedScore: this.calcScore(this.heldDice),
            roundScore: this.roundScore,
            winThreshhold: this.winThreshhold,
            gameState: this.gameState
        }
    }

    startGame(){
        this.turn = -1;
        this.gameState = this.gameStates.playing
        return this.nextPlayerTurn()
    }

    nextPlayerTurn(){
        this.turn++;
        this.currentplayer = this.players[this.turn%2];
        this.playingDice = [...this.currentplayer.diceLibrary];
        this.heldDice = [];
        this.bust = false;
        this.roll()
        this.setBust()
        
        return this.getGameState()       
    }

    roll(){
        this.playingDice.forEach(die => die.roll());
    }

    setBust(){
        if(this.calcScore(this.playingDice) < 1){
            this.bust = false;
        } 
        else{
            this.bust = true;
        }
    }

    userSelects(id){
        if(!selectedDieIds.includes(id)) selectedDieIds.push(id)
        return this.getGameState()
    }

    continueAction(){
        this.roundScore += this.selectedScore
        this.roll()
    }

    saveAction(){
        this.currentplayer.score += this.roundScore;
        this.roundScore = 0;

        if (this.currentplayer.score >= this.winThreshhold) {
            this.gameState = this.gameStates.won
        }
    }

    passAction(){
        return this.nextPlayerTurn()
    }

    startDemoGame(){
        
        while(this.turn < 10){
            this.currentplayer = this.players[this.turn%2]
            this.playingDice = [...this.currentplayer.diceLibrary]
            this.heldDice = []
            console.log(`Player: ${this.currentplayer.name}`);
            
            while(this.playingDice.length > 0){
                this.playingDice.forEach(die => die.roll());
                console.log(`Roll: ${this.playingDice.map(x=>x.result).join()}`);

                let saveForPlaying = [];
                
                for(const die of this.playingDice){
                    this.heldDice.push(die)
                }
                this.playingDice = saveForPlaying
                console.log(`Playing: ${this.playingDice.map(x=>x.result).join()}`);
                console.log(`Held: ${this.heldDice.map(x=>x.result).join()}`);
                
            }
            this.currentplayer.score += this.calcScore(this.heldDice)
            console.log(`Score: ${this.currentplayer.score}`);
            
            this.turn++
            console.log('_______________NEW TURN _________________');
            
        }
    }

    // startGame(){
    //     wait playerAction()
    //     NPC
    // }

    // takeNPCTurn(currentScore, opponentScore){
    //     turnScore = 0;
    //     remainingDice = 6;

    //     while (true){
    //         roll
    //         if(roll has no score){
    //             bust
    //         }
            
    //         scoringOptions = getAllScoringOptions(roll)
    //         bestOption = chooseBestOption(scoringOptions, remainingDice)

    //         turnScore = turnScore + bestOption.score
    //         remainingDice = remainingDice - bestOption.diceUsed

    //         if remainingDice == 0{
    //             remainingDice = 6
    //         }

    //         if shouldPass(turnScore, remainingDice, currentScore, opponentScore){
    //             currentScore = currentScore + turnScore
    //         }
    //     }
    // }

    // chooseBestOption(scoringOptions, remainingDice){
    //     for each option in scoringOptions{
    //         expectedValue = option.score / option.diceUsed
    //         bustRisk = bustProb(remainingDice - option.diceUsed)

    //         option.utility = expectedValue - (bustRisk * riskPenalty)
    //     }
    //     return option with highest utility
    // }

    // shouldPass(turnScore, remainingDice, currentScore, opponentScore, scoreToWin){
    //     if(turnScore >= 1000){return true}
    //     if(currentScore + turnScore >= scoreToWin){return true}
    //     if(remainingDice <= 2 && turnScore >= 300){return true}
    //     if(currentScore < opponentScore && turnScore < 500){return false}
    //     if(bustProb(remainingDice) > 0.4){return true}
    // }

    // bustProb(remainingDice){
    //     if(remainingDice == 6){return 0.02}
    //     if(remainingDice == 5){return 0.08}
    //     if(remainingDice == 4){return 0.17}
    //     if(remainingDice == 3){return 0.28}
    //     if(remainingDice == 2){return 0.44}
    //     if(remainingDice == 1){return 0.67}
    // }

    // getAllScoringOptions(roll){
        
    // }

    // ________________________

    rollPlayingDice(){
        this.playingDice.forEach(die => {
            console.log(die.roll());
        });
    }

    calcScore(resultArr){     
        if(resultArr == 'undefined') return

        let score = 0;
        let message = '';

        let excludeArr = [];       

        //_____________CHECKING IS STRAIGHT________________
        let straight6 = this.isStraight(resultArr, 6)
        let straight5 = this.isStraight(resultArr, 5)

        if(straight6.state){
            score += 1500; 
            message = "Straight of 6"; 
            excludeArr = [...straight6.straight]
        }
        else if(straight5.state){
            score += straight5.bestStart == 1 ? 500 : 750;
            message = "Straight of 5"; 
            excludeArr = [...straight5.straight]
        }

        // _____________CHECKING IS OF KIND________________
        const groups = Object.groupBy(resultArr, ({result}) => result);        
        for(const parameterName in groups){
            const types = groups[parameterName]            
            if(types.length >= 3 && this.isXofAKind(types.length)){
                if(parameterName == 1){score += (this.isXofAKind(types.length) * parameterName * 10);}
                else{score += (this.isXofAKind(types.length) * parameterName)}
                message += `${parameterName}s are ${types.length} of a kind`;
                excludeArr = [...excludeArr, ...types]
            }
        }
        if(message == ''){message = "No Special Scoring"}
        console.log(message);
        // ________________________________________________
        const difference = resultArr.filter( x => !excludeArr.includes(x) );
        for(const die of difference){
            if(die.result == 1){score += 100}
            if(die.result == 5){score += 50}
        }

        return score;
    }

    isStraight(resultArr, length = 5){
        const setArr = [...new Map(resultArr.map(o => [o.result, o])).values()].sort((a, b) => a.result - b.result);
        
        if(setArr.length < length) return {state:false, starting: null}

        let run = 1;
        let bestRun = 1;
        let bestStart = null;
        let runStart = setArr[0].result;
        for(let i = 1; i < setArr.length; i++){          
            if (setArr[i].result === setArr[i - 1].result + 1) {
                run++;
            }
            else {
                run = 1;
                runStart = setArr[i].result;
            }
            if (run > bestRun) {
                bestRun = run;
                bestStart = runStart;
            }
        }
        let state = bestRun >= length;

        let straight = [];
        if (state) {
            const startIndex = setArr.findIndex(o => o.result === bestStart);
            if (startIndex !== -1) {
                straight = setArr.slice(startIndex, startIndex + length);
            }
        }
        return {straight, state, starting: bestStart}
    }

    isXofAKind(tot){
        let mult = 1;
        switch (tot) {
            case 3:
                mult = 100;
                break;
            case 4:
                mult = 200;
                break;
            case 5:
                mult = 400;
                break;
            case 6:
                mult = 800;
                break;
            default:
                return false
        }
        return mult
    }
}

export class die{

    #diceLib = [
        {id: 1, name: 'Standard Die', sides: [1, 2, 3, 4, 5, 6]},
        {id: 2, name: 'Cheat Die', sides: [1, 1, 1, 1, 1, 1]},
    ]

    #data
    #result = null;

    constructor(dieId){
        const data = this.#diceLib.find(d => d.id === dieId);
        if (!data) throw new Error(`No die found: id ${dieId}`);
        this.#data = data;
    }

    roll(){
        const sides = this.#data.sides;
        const index = Math.floor(Math.random() * sides.length);
        this.#result = sides[index];
        return this.#result;
    }

    get result(){
        return this.#result
    }
}



export class player {
  constructor(name, idArr = []) {
    this.name = name;
    this.score = 0;
    this.diceLibrary = [];
    this.setPool(idArr);
  }

  setPool(idArr = []) {
    if (idArr.length > 6) {
      throw new Error(`Max dice 6. Dice: ${idArr}, tot: ${idArr.length}`);
    }

    this.diceLibrary = idArr.map(id => new die(id));
    this.fillStrdPool();
    return this.diceLibrary;
  }

  fillStrdPool() {
    while (this.diceLibrary.length < 6) {
      this.diceLibrary.push(new die(1));
    }
  }
}






const startup = () => {
    try {
        const p1 = new player('A');
        // p1.setPool([2, 2, 2, 2])
        p1.fillStrdPool()

        const p2 = new player('B');
        p2.fillStrdPool()

        const MyGame = new game(p1, p2)

        MyGame.startGame()
        
    } 
    catch (error) {
        console.log(error.message);

        throw error
    }   
}

// startup()

// organize shit in players
// each player has a LIMTIED set of dice
// 6 dice
// not alll die are the samne
// point system
// each player has a total gathered from turns
// poinnbts are scored by holding die
// 1s give 100, 5s give 50
// 3 of a kind is 10x the total, 4 is 20x
// held die vs not held die