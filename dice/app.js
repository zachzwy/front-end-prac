/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

CHALLENGE:
- player loses total score if dice gets two continuous 6

*/

// 

let curScore = 0;
let totalScore = [0, 0];
let curPlayer = 0;  // curPlayer's value is 0 or 1 corresponding to the two players
let dice;
let six = 0;  // dice to 6
let winningScore = parseInt(prompt('please set the winning score')); // must be a number

// addEventListener on roll dice button
// document.querySelector('.btn-roll').addEventListener('click', roll);
document.querySelector('.btn-roll').onclick = roll;

// addEventListener on hold button
document.querySelector('.btn-hold').onclick = switchPlayerAddScore;

// new gamge
document.querySelector('.btn-new').onclick = newGame;

// hide the dice picture
const diceEle = document.querySelector('.dice');
diceEle.style.display = 'none';

/*
roll dice button event listener
1. update current score;
2. update UI
*/
function roll() {
    dice = Math.floor(Math.random() * 6) + 1;
    if (dice !== 1) {
        if (dice === 6) six += 1;
        if (six === 2) {
            alert('get six twice!')
            totalScore[curPlayer] = 0;
            document.querySelector('#score-' + curPlayer).textContent = 0;
            switchPlayer();
            diceEle.src = 'dice-6.png';
            return;
        }
        curScore += dice;
        document.querySelector('#current-' + curPlayer).textContent = curScore;
        diceEle.style.display = 'block';
        diceEle.src = 'dice-' + dice + '.png';
    } else {
        alert('get a 1!')
        switchPlayer();
        diceEle.src = 'dice-1.png';
    }
}

/*
switch player without adding current score to total score
invoke when dice is 1
*/
function switchPlayer() {
    six = 0;
    curScore = 0;
    document.querySelector('#current-' + curPlayer).textContent = curScore;
    curPlayer = curPlayer === 0 ? 1 : 0;
    // document.querySelector('.player-' + curPlayer + '-panel').classList.add('active');
    // document.querySelector('.player-' + (1 - curPlayer) + '-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    
}

/*
switch player adding current score to total score
invoke when user clicks hold button
*/
function switchPlayerAddScore() {
    totalScore[curPlayer] += curScore;
    if (checkWinner()) {
        return;
    }
    document.querySelector('#score-' + curPlayer).textContent = totalScore[curPlayer];
    diceEle.style.display = 'none';
    switchPlayer();
}

/*
check winner
*/
function checkWinner() {
    if (totalScore[curPlayer] >= winningScore) {
        document.querySelector('#score-' + curPlayer).textContent = totalScore[curPlayer] + ' win!';
        document.querySelector('#current-' + curPlayer).textContent = 0;
        diceEle.style.display = 'none';
        document.querySelector('.btn-roll').disabled = true;
        document.querySelector('.btn-hold').disabled = true;
        return true;
    } else return false;
}

/*
New game
Reset everything
*/
function newGame() {
    curScore = 0;
    totalScore = [0, 0];
    diceEle.style.display = 'none';
    document.querySelector('#current-' + curPlayer).textContent = 0;
    document.querySelector('#score-0').textContent = 0;
    document.querySelector('#score-1').textContent = 0;
    if (curPlayer === 1) {
        document.querySelector('.player-0-panel').classList.add('active');
        document.querySelector('.player-1-panel').classList.remove('active');
        curPlayer = 0;
    }
    document.querySelector('.btn-roll').disabled = false;
    document.querySelector('.btn-hold').disabled = false;
}