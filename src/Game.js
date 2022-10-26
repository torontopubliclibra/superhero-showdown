import { useEffect, useState } from 'react';
import ComputerCard from './ComputerCard';
import PlayerCard from './PlayerCard';

const Game = (props) => {

    const [ computerDeck, setComputerDeck ] = useState([]);
    const [ playerDeck, setPlayerDeck ] = useState([]);
    const [ statChoice, setStatChoice ] = useState("");
    const [ pot, setPot ] = useState([]);
    const [ turnPosition, setTurnPosition ] = useState(1);
    const [ displayCompStats, setDisplayCompStats ] = useState(false);

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    useEffect(() => {
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

    const handleInputChange = (event) => {
        setStatChoice(event.target.value);
    }

    const checkStats = (event) => {
        event.preventDefault();

        if (playerDeck.length === 0 || computerDeck === 0){
            setTurnPosition(5);
        } else {
            if (statChoice){
                const playerStat = playerDeck[0].data[statChoice];
                const computerStat = computerDeck[0].data[statChoice];

                if (playerStat > computerStat) {
                    setTurnPosition(2);
                } else if (playerStat === computerStat) {
                    setTurnPosition(3);
                } else if (playerStat < computerStat){
                    setTurnPosition(4);
                }
                setDisplayCompStats(true);
            } else {
                alert('Please make a selection');
            }
        }

    }

    const nextTurn = () => {
        const newPlayerDeck = playerDeck;
        const newComputerDeck = computerDeck;
        const newPot = pot;
        const defaultPot = [];
        if (turnPosition === 2){
            const losingCard = newComputerDeck[0];
            const winningCard = newPlayerDeck[0];
            newPlayerDeck.splice(0, 1);
            newPlayerDeck.push(losingCard, winningCard);
            newPot.forEach((card) => {
                newPlayerDeck.push(card);
            })
            newComputerDeck.splice(0, 1);
            setPot(defaultPot);
        } else if (turnPosition === 3){
            const playerCard = newComputerDeck[0];
            const computerCard = newPlayerDeck[0];
            newPot.push(playerCard, computerCard);
            setPot(newPot);
            newPlayerDeck.splice(0, 1);
            newComputerDeck.splice(0, 1);;
        } else if (turnPosition === 4){
            const winningCard = newComputerDeck[0];
            const losingCard = newPlayerDeck[0];
            newComputerDeck.splice(0, 1);
            newComputerDeck.push(losingCard, winningCard);
            newPot.forEach((card) => {
                newComputerDeck.push(card);
            })
            newPlayerDeck.splice(0, 1);
            setPot(defaultPot);
        }
        setPlayerDeck(newPlayerDeck);
        setComputerDeck(newComputerDeck);
        setDisplayCompStats(false);
        setTurnPosition(1);
        setStatChoice("");
    }

    return (
        <section className="game">
            {
                turnPosition !== 5
                ? <div className="playerHand">
                    <p>Your Card</p>
                    <PlayerCard card={playerDeck[0]}/>
                    <p>Deck: {playerDeck.length}</p>
                </div>
                : null
            }
            <div className="gameArea">
                {
                    turnPosition === 1
                    ? <>
                        <h4>V.S.</h4>
                        {
                            pot.length > 0
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }
                        <form>
                            <label htmlFor="statistics">Select the stat that you think will beat your opponent:</label>
                            <select id="statistics" onChange={handleInputChange}>
                                <option value="" default>Select a stat:</option>
                                <option value="int" default>Intelligence</option>
                                <option value="str">Strength</option>
                                <option value="spd">Speed</option>
                                <option value="dur">Durability</option>
                                <option value="fig">Fighting</option>
                            </select>
                            <button onClick={checkStats}>Submit</button>
                        </form>
                    </>
                    : null
                }
                {
                    turnPosition === 2
                    ? <>
                        <h4>YOU WIN</h4>
                        <p>You beat {computerDeck[0].data.name}!</p>
                        <p>The card will be added to your deck.</p>
                        <button onClick={nextTurn}>Next Turn</button>
                    </>
                    : null
                }
                {
                    turnPosition === 3
                    ? <>
                        <h4>YOU TIE</h4>
                        <p>You tied {computerDeck[0].data.name}!</p>
                        <p>Both cards will be added to the pot.</p>
                        <button onClick={nextTurn}>Next Turn</button>
                    </>
                    : null
                }
                {
                    turnPosition === 4
                    ? <>
                        <h4>YOU LOSE</h4>
                        <p>You lost to {computerDeck[0].data.name}!</p>
                        <p>Your card will be added to your opponent's deck.</p>
                        <button onClick={nextTurn}>Next Turn</button>
                    </>
                    : null
                }
                {
                    turnPosition === 5
                    ? <>
                        <h4>GAME OVER</h4>
                    </>
                    : null
                }
            </div>
            {
                turnPosition !== 5
                ? <div className="computerHand">
                    <p>Your Opponent's Card</p>
                    <ComputerCard displayStats={displayCompStats} card={computerDeck[0]}/>
                    <p>Deck: {computerDeck.length}</p>
                </div>
                : null
            }
        </section>
    )
}

export default Game;