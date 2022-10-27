import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import firebase from './firebase';
import ComputerCard from './ComputerCard';
import PlayerCard from './PlayerCard';

const Game = (props) => {

    const refresh = () => {
        window.location.reload(false);
    }

    const [ computerDeck, setComputerDeck ] = useState([]);
    const [ playerDeck, setPlayerDeck ] = useState([]);
    const [ statChoice, setStatChoice ] = useState("");
    const [ pot, setPot ] = useState([]);
    const [ turnState, setTurnState ] = useState(1);
    const [ gameOver, setGameOver ] = useState(false);
    const [ displayCompStats, setDisplayCompStats ] = useState(false);
    const [ player, setPlayer ] = useState("");
    const [ recentPlayers, setRecentPlayers ] = useState([])
    const [ phrase, setPhrase ] = useState("You'll never take me alive");

    const establishGame = () => {
        setPlayer(props.name)
    }

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    const randomize = (array) => {
        const randomIndex = Math.floor(Math.random() * array.length);
        const item = array[randomIndex];
        return item;
    }

    const phrases = [
        "You'll never take me alive",
        "Watch your back",
        "You won't see this one coming",
        "Don't test me",
        "You won't like me when I'm angry",
        "I can do this all day",
        "We're in the endgame now",
        "I'll do whatever it takes to beat you",
        "I wouldn't underestimate me if I were you",
        "Stay out of my way",
        "I'm the best there is at what I do",
        "It's clobberin' time"
    ]

    const database = getDatabase(firebase);
    const dbRef = ref(database, `/players`);

    useEffect(() => {

        establishGame();

        onValue(dbRef, (response) => {
            const newRecentPlayers = [];
            const playerNames = response.val();
            for (let player in playerNames){
                newRecentPlayers.push({key: player, name: playerNames[player]})
            }
            setRecentPlayers(newRecentPlayers);
        })

        const deck = props.deck;

        const deckOne = [];
        const deckTwo = [];

        shuffle(deck);

        for (let character in deck){
            if (character <= (deck.length/2 - 1)){
                deckOne.push(deck[character])
            } else {
                deckTwo.push(deck[character])
            }
        }

        setComputerDeck(deckOne);
        setPlayerDeck(deckTwo);
    }, [])

    useEffect(() => {
        if(gameOver === true && playerDeck.length > 1){
            push(dbRef, player);
        }
    }, [gameOver])

    const handleInputChange = (event) => {
        setStatChoice(event.target.value);
    }

    const checkStats = (event) => {
        event.preventDefault();

        let randomPhrase = randomize(phrases);
        setPhrase(randomPhrase);

        if (statChoice){
            const playerStat = playerDeck[0].data[statChoice];
            const computerStat = computerDeck[0].data[statChoice];

            if (playerStat > computerStat) {
                setTurnState(2);
                if (computerDeck.length === 1){
                    setGameOver(true);
                }
            } else if (playerStat === computerStat) {
                setTurnState(3);
                if (playerDeck.length === 1 || computerDeck.length === 1){
                    setGameOver(true);
                }
            } else if (playerStat < computerStat){
                setTurnState(4);
                if (playerDeck.length === 1){
                    setGameOver(true);
                }
            }

            setDisplayCompStats(true);
        } else {
            alert('Please make a selection');
        }
    }

    const nextTurn = () => {
        const newPlayerDeck = playerDeck;
        const newComputerDeck = computerDeck;
        const newPot = pot;
        const defaultPot = [];

        if (turnState === 2){
            const losingCard = newComputerDeck[0];
            const winningCard = newPlayerDeck[0];
            newPlayerDeck.splice(0, 1);
            newComputerDeck.splice(0, 1);
            newPlayerDeck.push(losingCard, winningCard);
            newPot.forEach((card) => {
                newPlayerDeck.push(card);
            })
            setPot(defaultPot);
        } else if (turnState === 3){
            const playerCard = newComputerDeck[0];
            const computerCard = newPlayerDeck[0];
            newPlayerDeck.splice(0, 1);
            newComputerDeck.splice(0, 1);;
            newPot.push(playerCard, computerCard);
            setPot(newPot);
        } else if (turnState === 4){
            const winningCard = newComputerDeck[0];
            const losingCard = newPlayerDeck[0];
            newComputerDeck.splice(0, 1);
            newPlayerDeck.splice(0, 1);
            newComputerDeck.push(losingCard, winningCard);
            newPot.forEach((card) => {
                newComputerDeck.push(card);
            })
            setPot(defaultPot);
        }
        setPlayerDeck(newPlayerDeck);
        setComputerDeck(newComputerDeck);
        setDisplayCompStats(false);
        setTurnState(1);
        setStatChoice("");
    }

    const endGame = () => {
        setTurnState(5);
    }

    return (
        <section className="game">
            {
                turnState !== 5
                ? <div className="playerHand">
                    <h3>Your Card</h3>
                    <PlayerCard card={playerDeck[0]}/>
                    <p>Deck: {playerDeck.length}</p>
                </div>
                : null
            }
            {
                turnState === 1 && playerDeck[0] && computerDeck[0]
                ? <>
                    <div className="gameText">
                        <h4>V.S.</h4>
                        <p className="phrase">{computerDeck[0].data.name} says "{phrase}, {playerDeck[0].data.name}."</p>
                    </div>
                    <div className="gameArea">
                        <form>
                            <label htmlFor="statistics">Select the statistic that you think will beat your opponent:</label>
                            <select id="statistics" onChange={handleInputChange}>
                                <option value="" default>Select a statistic:</option>
                                <option value="int" default>Intelligence</option>
                                <option value="str">Strength</option>
                                <option value="spd">Speed</option>
                                <option value="dur">Durability</option>
                                <option value="fig">Fighting</option>
                            </select>
                            <button className="button" onClick={checkStats}>Submit</button>
                        </form>
                        {
                            pot.length > 0
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }
                    </div>
                </>
                : null
            }
            {    turnState === 2
            
                ? <>
                    <div className="gameText">
                        <h4>YOU WIN</h4>
                    </div>
                    <div className="gameArea">
                        <p>{playerDeck[0].data.name} beat {computerDeck[0].data.name}!</p>
                        <p>The card {
                                pot.length > 0
                                ? `and the entire pot `
                                : ``
                            }
                            will be added to your deck.</p>
                        {
                            !gameOver
                            ? <button className="button" onClick={nextTurn}>Next Turn</button>
                            : <button className="button" onClick={endGame}>End Game</button>
                        }
                        {
                            pot.length > 0
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }
                    </div>
                </>
                : null
            }
            {
                turnState === 3
                ? <>
                    <div className="gameText">
                        <h4>YOU TIE</h4>
                    </div>
                    <div className="gameArea">
                        <p>{playerDeck[0].data.name} tied with {computerDeck[0].data.name}! Both cards will be added to the pot.</p>
                        {
                            !gameOver
                            ? <button className="button" onClick={nextTurn}>Next Turn</button>
                            : <button className="button" onClick={endGame}>End Game</button>
                        }
                        {
                            pot.length > 0
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }
                    </div>
                </>
                : null
            }
            {
                turnState === 4
                ? <>
                    <div className="gameText">
                        <h4>YOU LOSE</h4>
                    </div>
                    <div className="gameArea">
                        <p>{computerDeck[0].data.name} beat {playerDeck[0].data.name}!</p>
                        <p>Your card {
                                pot.length > 0
                                ? `and the entire pot `
                                : ``
                            }
                            will be added to your opponent's deck.</p>
                        {
                            !gameOver
                            ? <button className="button" onClick={nextTurn}>Next Turn</button>
                            : <button className="button" onClick={endGame}>End Game</button>
                        }
                        {
                            pot.length > 0
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }
                    </div>
                </>
                : null
            }
            {
                turnState !== 5
                ? <div className="computerHand">
                    <h3>Your Opponent's Card</h3>
                    <ComputerCard displayStats={displayCompStats} card={computerDeck[0]}/>
                    <p>Deck: {computerDeck.length}</p>
                </div>
                : null
            }
            {
                turnState === 5
                ? <div className="gameOver">
                    <h3>GAME OVER</h3>
                    {
                        playerDeck.length > 1
                        ? <h4>You won!!</h4>
                        : <h4>Try again!!</h4>
                    }
                    <p>Here are our latest champions:</p>
                    <ol>
                        { recentPlayers.slice(0).reverse().map((player, index) => {
                            if(index < 5){
                                return(
                                    <li key={player.key}>{player.name}</li>
                                )
                            }
                        }) }
                    </ol>
                    <button className="button" onClick={refresh}>Play Again</button>
                </div>
                : null
            }
        </section>
    )
}

export default Game;