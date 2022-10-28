// import state functions
import { useEffect, useState } from 'react';

// import Firebase functions
import { getDatabase, ref, onValue, push } from 'firebase/database';
import firebase from './firebase';

// import components
import ComputerCard from './ComputerCard';
import PlayerCard from './PlayerCard';

// Game component (passed props.deck and props.name from Main component)
const Game = (props) => {

    // refresh function
    const refresh = () => {
        window.location.reload(false);
    }

    // initial stateful variables
    const [ computerDeck, setComputerDeck ] = useState([]);
    const [ playerDeck, setPlayerDeck ] = useState([]);
    const [ statChoice, setStatChoice ] = useState("");
    const [ pot, setPot ] = useState([]);
    const [ turnState, setTurnState ] = useState(1);
    const [ gameOver, setGameOver ] = useState(false);
    const [ displayCompStats, setDisplayCompStats ] = useState(false);
    const [ player, setPlayer ] = useState("");
    const [ recentPlayers, setRecentPlayers ] = useState([]);

    // render side effects
    useEffect(() => {

        // props variables
        const playerName = props.name;
        const deck = props.deck;

        // set player state to props variable
        setPlayer(playerName);

        // initial deck arrays
        const deckOne = [];
        const deckTwo = [];

        // loop through props deck and split the cards into two new deck arrays
        for (let character in deck){
            if (character <= (deck.length/2 - 1)){
                deckOne.push(deck[character])
            } else {
                deckTwo.push(deck[character])
            }
        }

        // set computer and player deck states to the two new 10 card decks
        setComputerDeck(deckOne);
        setPlayerDeck(deckTwo);

    }, [props])

    // when the user selects a statistic from the dropdown
    const handleInputChange = (event) => {

        // set the stat choice state to the selected value
        setStatChoice(event.target.value);
    }

    // when the user clicks the fight button
    const checkStats = (event) => {

        // prevent the page from refreshing
        event.preventDefault();

        // if the user has made a selection
        if (statChoice){

            // find the corresponding statistic for each deck's top card
            const playerStat = playerDeck[0].data[statChoice];
            const computerStat = computerDeck[0].data[statChoice];

            // if the player's stat is bigger than the computer's
            if (playerStat > computerStat) {

                // set turn state to "win"
                setTurnState(2);

                // and if the computer is out of cards
                if (computerDeck.length === 1){

                    // set the game over state to true
                    setGameOver(true);
                }
            
            // if the player's stat and the computer's stat are equal
            } else if (playerStat === computerStat) {

                // set turn state to "tie"
                setTurnState(3);

                // and if the player is out of cards or the computer is out of cards
                if (playerDeck.length === 1 || computerDeck.length === 1){

                    // set the game over state to true
                    setGameOver(true);
                }

            // if the computer's stat is bigger than the player's
            } else if (playerStat < computerStat){

                // set turn state to "lose"
                setTurnState(4);

                // and if the player is out of cards
                if (playerDeck.length === 1){

                    // set the game over state to true
                    setGameOver(true);
                }
            }

            // display the computer's cards statistics once the scores have been checked
            setDisplayCompStats(true);

        // if the user hasn't made a selection
        } else {

            // alert the user
            alert('Please make a selection');
        }
    }

    // when the player clicks the next turn button
    const nextTurn = () => {

        // copy the decks and the pot
        const newPlayerDeck = playerDeck;
        const newComputerDeck = computerDeck;
        const newPot = pot;

        // default pot value
        const defaultPot = [];

        // if the player won
        if (turnState === 2){

            // copy losing card
            const losingCard = newComputerDeck[0];

            // copy winning card
            const winningCard = newPlayerDeck[0];

            // remove the top cards from the new decks
            newPlayerDeck.splice(0, 1);
            newComputerDeck.splice(0, 1);

            // push the removed cards to the bottom of the new player deck
            newPlayerDeck.push(losingCard, winningCard);

            // loop through the pot
            newPot.forEach((card) => {

                // push each card from the pot to the bottom of the new player deck
                newPlayerDeck.push(card);
            })

            // set pot to default
            setPot(defaultPot);

        // if the player and the computer tied
        } else if (turnState === 3){

            // copy each card
            const playerCard = newComputerDeck[0];
            const computerCard = newPlayerDeck[0];

            // remove the top cards from the new decks
            newPlayerDeck.splice(0, 1);
            newComputerDeck.splice(0, 1);

            // push the removed cards to the pot
            newPot.push(playerCard, computerCard);

            // set the pot state to the new pot array
            setPot(newPot);

        // if the computer won
        } else if (turnState === 4){

            // copy winning card
            const winningCard = newComputerDeck[0];

            // copy losing card
            const losingCard = newPlayerDeck[0];

            // remove the top cards from the new decks
            newComputerDeck.splice(0, 1);
            newPlayerDeck.splice(0, 1);

            // push the removed cards to the bottom of the new computer deck
            newComputerDeck.push(losingCard, winningCard);

            // loop through the pot
            newPot.forEach((card) => {

                // push each card from the pot to the bottom of the new player deck
                newComputerDeck.push(card);
            })

            // set the pot to default
            setPot(defaultPot);
        }
        
        // set the player deck state to the new player deck
        setPlayerDeck(newPlayerDeck);

        // set the computer deck state to the new computer deck
        setComputerDeck(newComputerDeck);

        // turn off the computer stats
        setDisplayCompStats(false);

        // set the turn state back to the start
        setTurnState(1);

        // clear out the stat choice
        setStatChoice("");
    }

    // when the user ends the game
    const endGame = () => {

        // set the turn state to "game over"
        setTurnState(5);

        // player database variables
        const database = getDatabase(firebase);
        const dbRef = ref(database, `/players`);

        // if the game is over and the player won
        if(gameOver && playerDeck.length > 1){

            // push the player's name to the database
            push(dbRef, player);
        }

        // retreive player data
        onValue(dbRef, (response) => {

            // empty array for all of the players
            const allPlayers = [];

            // player data
            const playerNames = response.val();

            // loop through the player data
            for (let player in playerNames){

                // push each item in the player data into the array of players
                allPlayers.push({key: player, name: playerNames[player]})
            }

            // reverse the players array
            allPlayers.reverse();

            // create a new array with just the most recent 5 items
            let newRecentPlayers = allPlayers.slice(0, 5);

            // set the recent players state to the new players array
            setRecentPlayers(newRecentPlayers);
        })
    }

    // Game component return
    return (
        <section className="game">
            {
                // if the game is being played
                turnState !== 5

                // display the player's hand
                ? <div className="playerHand">
                    <h3>Your Card</h3>

                    {/* player card component */}
                    <PlayerCard card={playerDeck[0]}/>
                    {
                        // if the deck has 3 or more cards
                        playerDeck.length >= 3

                            // show the full card stack
                            ? <div className="stackCard stackCard1"></div>
                            : null
                    }
                    {
                        // if the deck has 2 or more cards
                        playerDeck.length >= 2

                            // show only one card in the stack
                            ? <div className="stackCard stackCard2"></div>
                            : null
                    }
                    <div className="deck">

                        <p>Deck: {playerDeck.length}</p>
                        {
                            // if the deck has 3 or more cards
                            playerDeck.length >= 3

                                // show the full card stack
                                ? <div className="deckCard deckCard1"></div>
                                : null
                        }
                        {
                            // if the deck has 2 or more cards
                            playerDeck.length >= 2

                                // show only one card in the stack
                                ? <div className="deckCard deckCard2"></div>
                                : null
                        }
                    </div> {/* .deck end */}

                </div> // .playerHand end
                : null
            }
            {
                // if it's the start of the game and each player has a card
                turnState === 1 && playerDeck[0] && computerDeck[0]
                ? <>

                    {/* display versus text */}
                    <div className="gameText">
                        <h4>v.s.</h4>
                    </div>

                    <div className="gameArea">
                        
                        {/* prompt the user to pick a stastistic */}
                        <form>
                            <label htmlFor="statistics">Pick the stat that you think will beat your opponent:</label>
                            <select id="statistics" onChange={handleInputChange}>
                                <option value="" default>Select a statistic:</option>
                                <option value="int" default>Intelligence</option>
                                <option value="str">Strength</option>
                                <option value="spd">Speed</option>
                                <option value="dur">Durability</option>
                                <option value="fig">Fighting</option>
                            </select>
                            <button className="button" onClick={checkStats}>Fight</button>
                        </form>

                        {
                            // if the pot has any cards
                            pot.length > 0

                            // display the pot and it's length
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }

                    </div> {/* .gameArea end */}
                </>
                : null
            }
            {
                // if the player has won
                turnState === 2
            
                ? <>

                    {/* display winning text */}
                    <div className="gameText">
                        <h4>You Win</h4>
                    </div>

                    <div className="gameArea">

                        {/* announce the winner */}
                        <p>{playerDeck[0].data.name} beat {computerDeck[0].data.name}! The card {

                                // if the pot has any cards
                                pot.length > 0

                                // mention the pot
                                ? `and the entire pot `
                                : ``
                            }

                            will be added to your deck.</p>
                        {
                            // if the game isn't over yet
                            !gameOver

                            // show the next turn button
                            ? <button className="button" onClick={nextTurn}>Next Turn</button>

                            // else show the end game button
                            : <button className="button" onClick={endGame}>End Game</button>

                        }
                        {
                            // if the pot has any cards
                            pot.length > 0

                            // display the pot and it's length
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }
                    </div> {/* .gameArea end */}
                </>
                : null
            }
            {
                // if the player and the computer have tied
                turnState === 3

                ? <>

                    {/* display draw text */}
                    <div className="gameText">
                        <h4>You Tie</h4>
                    </div>

                    <div className="gameArea">

                        {/* announce the draw */}
                        <p>{playerDeck[0].data.name} tied with {computerDeck[0].data.name}! Both cards will be added to the pot.</p>
                        {

                            // if the game isn't over yet
                            !gameOver

                            // show the next turn button
                            ? <button className="button" onClick={nextTurn}>Next Turn</button>

                            // else show the end game button
                            : <button className="button" onClick={endGame}>End Game</button>
                        }
                        {

                            // if the pot has any cards
                            pot.length > 0

                            // display the pot and it's length
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }
                    </div> {/* .gameArea end */}
                </>
                : null
            }
            {
                // if the player has lost
                turnState === 4

                ? <>

                    {/* display losing text */}
                    <div className="gameText">
                        <h4>You Lose</h4>
                    </div>

                    {/* announce the loser */}
                    <div className="gameArea">
                        <p>{computerDeck[0].data.name} beat {playerDeck[0].data.name}! Your card {

                                // if the pot has any cards
                                pot.length > 0

                                // mention the pot
                                ? `and the entire pot `
                                : ``
                            }

                            will be added to your opponent's deck.</p>
                        {
                            // if the game isn't over yet
                            !gameOver

                            // show the next turn button
                            ? <button className="button" onClick={nextTurn}>Next Turn</button>

                            // else show the end game button
                            : <button className="button" onClick={endGame}>End Game</button>
                        }
                        {
                            // if the pot has any cards
                            pot.length > 0

                            // display the pot and it's length
                            ? <p className="pot">Pot: {pot.length}</p>
                            : null
                        }
                    </div> {/* .gameArea end */}
                </>
                : null
            }
            {
                // if the game is being played
                turnState !== 5

                // display the player's hand
                ? <div className="computerHand">
                    <h3>Your Opponent's Card</h3>

                    {/* computer card component */}
                    <ComputerCard displayStats={displayCompStats} card={computerDeck[0]}/>
                    {
                        // if the decl has 3 or more cards
                        computerDeck.length >= 3

                            // show the full card stack
                            ? <div className="stackCard stackCard1"></div>
                            : null
                    }
                    {
                        // if the deck has 2 or more cards
                        computerDeck.length >= 2

                            // show only one card in the stack
                            ? <div className="stackCard stackCard2"></div>
                            : null
                    }
                    <div className="deck">

                        <p>Deck: {computerDeck.length}</p>
                        {
                            // if the deck has 3 or more cards
                            computerDeck.length >= 3

                                // show the full card stack
                                ? <div className="deckCard deckCard1"></div>
                                : null
                        }
                        {
                            // if the deck has 2 or more cards
                            computerDeck.length >= 2

                                // show only one card in the stack
                                ? <div className="deckCard deckCard2"></div>
                                : null
                        }
                    </div>
                </div>
                : null
            }
            {
                // if the game is over
                turnState === 5

                ? <div className="gameOver">

                    {/* display game over text */}
                    <h3>GAME OVER</h3>
                    {
                        // if the player has more than 1 card
                        playerDeck.length > 1

                        // tell them they've won
                        ? <h4>You won!!</h4>

                        // else tell them they've lost
                        : <h4>Try again!!</h4>
                    }

                    {/* recent players list */}
                    <p>Here are our latest champions:</p>
                    <ol>
                        {/* map each recent player into a list item */}
                        { recentPlayers.map((player) => {
                            return(
                                <li key={player.key}>{player.name}</li>
                            )
                        }) }
                    </ol>

                    {/* play again button */}
                    <button className="button" onClick={refresh}>Play Again</button>
                </div> // .gameOver end
                : null
            }
        </section>
    )
}

// export Game component
export default Game;