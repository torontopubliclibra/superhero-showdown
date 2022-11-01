// import styles
import './Game.css';

// import state functions
import { useEffect, useState } from 'react';

// import Firebase functions
import { getDatabase, ref, onValue, push } from 'firebase/database';
import firebase from './firebase';

// import components
import Card from './Card';

// Game component (passed props.deck and props.name from Main component)
const Game = (props) => {

    // refresh function
    const refresh = () => {
        window.location.reload(false);
    }

    // initial stateful variables
    const [ computerDeck, setComputerDeck ] = useState([]);
    const [ playerDeck, setPlayerDeck ] = useState([]);
    const [ statChoice, setStatChoice ] = useState(null);
    const [ pot, setPot ] = useState([]);
    const [ turnState, setTurnState ] = useState(1);
    const [ gameOver, setGameOver ] = useState(false);
    const [ displayStats, setDisplayStats ] = useState(false);
    const [ player, setPlayer ] = useState("");
    const [ recentPlayers, setRecentPlayers ] = useState([]);
    const [ cardsFlipped, setCardsFlipped ] = useState(false);

    // initial render side effects
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

            // if the card is in the first half of the deck
            if (character <= (deck.length/2 - 1)){

                // push it to the first deck
                deckOne.push(deck[character])

            // if the card is in the second half of the deck
            } else {

                // push it to the second deck
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

            // game over check function
            const gameOverCheck = (deck) => {

                // if either player is out of cards when the stats are checked
                if (deck.length === 1){

                    // set the game over state to true
                    setGameOver(true);
                }
            }

            // find the corresponding statistic for each deck's top card
            const playerStat = playerDeck[0].data[statChoice];
            const computerStat = computerDeck[0].data[statChoice];

            // if the player's stat is bigger than the computer's
            if (playerStat > computerStat) {

                // set turn state to "win"
                setTurnState(2);

                // check the loser's deck to see if the game is over
                gameOverCheck(computerDeck);
            
            // if the player's stat and the computer's stat are equal
            } else if (playerStat === computerStat) {

                // set turn state to "tie"
                setTurnState(3);

                // check both decks to see if the game is over
                gameOverCheck(playerDeck);
                gameOverCheck(computerDeck);

            // if the computer's stat is bigger than the player's
            } else if (playerStat < computerStat){

                // set turn state to "lose"
                setTurnState(4);

                // check the player's deck to see if the game is over
                gameOverCheck(playerDeck);
            }

            // display the computer's cards statistics once the scores have been checked
            setDisplayStats(true);

        // if the user hasn't made a selection
        } else {

            // alert the user
            alert('Please make a selection');
        }
    }

    // when the player clicks the next turn button
    const nextTurn = (event) => {

        // disable the button until it disappears
        event.currentTarget.disabled = true;

        // flip over card
        setCardsFlipped(true);

        // copy the decks and the pot
        const newPlayerDeck = playerDeck;
        const topPlayerCard = newPlayerDeck[0];
        const newComputerDeck = computerDeck;
        const topComputerCard = newComputerDeck[0];
        let newPot = pot;

        // empty default pot array
        const defaultPot = [];

        // after 0.5 seconds (card has started flipping over)
        setTimeout(() => {

            // remove the top cards from the new decks
            newPlayerDeck.splice(0, 1);
            newComputerDeck.splice(0, 1);

            // check turnState with a switch statement
            switch (turnState) {

                // if the player has won
                case 2:
                    
                    // push the removed cards to the bottom of the new player deck
                    newPlayerDeck.push(topComputerCard, topPlayerCard);

                    // loop through the pot
                    newPot.forEach((card) => {

                        // push any cards from the pot to the bottom of the new player deck
                        newPlayerDeck.push(card);
                    })

                    // set pot to default
                    newPot = defaultPot;

                    // break out of the switch statement
                    break;

                // if the player and the computer have tied
                case 3: 

                    // push the removed cards to the pot
                    newPot.push(topPlayerCard, topComputerCard);

                    // break out of the switch statement
                    break;

                // if the computer has won
                case 4:

                    // push the removed cards to the bottom of the new computer deck
                    newComputerDeck.push(topPlayerCard, topComputerCard);

                    // loop through the pot
                    newPot.forEach((card) => {

                        // push any cards from the pot to the bottom of the new computer deck
                        newComputerDeck.push(card);
                    })

                    // set the pot to default
                    newPot = defaultPot;

                    // break out of the switch statement
                    break;

                // by default
                default: 

                    // break out of the switch statement
                    break;
            }
        
        }, 500)
            
        // after 1 second (card has flipped over)
        setTimeout(() => {
    
            // clear out the stat choice
            setStatChoice(null);
                
            // set the turn state back to the start
            setTurnState(1);

            // unset cards flipped state
            setCardsFlipped(false);

            // turn off the computer stats
            setDisplayStats(false);

            // set the player deck state and the computer deck state to the new decks
            setPlayerDeck(newPlayerDeck);
            setComputerDeck(newComputerDeck);

            // set the pot state to the new pot array
            setPot(newPot);

        }, 1000)
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
            
        }, { onlyOnce: true })
    }

    // player hand
    const playerHand = (

        <div className="playerHand">
            <h3>Your Card</h3>

            {/* player card component */}
            <Card type="player" card={playerDeck[0]} displayStats="true" flipped={cardsFlipped}/>
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
                
            </div> {/* .deck end */}
            
        </div> // .playerHand end
    )

    // computer hand
    const computerHand = (
        <div className="computerHand">
            <h3>Your Opponent's Card</h3>

            {/* computer card component */}
            <Card type="computer" card={computerDeck[0]} displayStats={displayStats} flipped={cardsFlipped}/>
            {
                // if the deck has 3 or more cards
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

            </div>
        </div>
    )
    
    // form for selecting a statistic
    const statForm = (
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
    )

    // card pot text
    const cardPot = (
        <p className="pot">Pot: {pot.length}</p>
    )

    // next turn button
    const nextTurnButton = (
        <button className="button" onClick={nextTurn}>Next Turn</button>
    )

    // end game button
    const endGameButton = (
        <button className="button" onClick={endGame}>End Game</button>
    )

    // card pot text for results
    const andAlsoCardPot = (

        // if the pot has any cards
        pot.length > 0

        // mention the pot
        ? `and the entire pot `

        // else don't
        : ``
                            
    )

    // game over screen
    const gameOverScreen = (
        <div className="gameOver">

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
        </div>
    )

    // Game component return
    return (
        <section className="game">
            {
                // if the game is being played
                turnState !== 5

                // display the player's hand
                ? playerHand
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
                        
                        {/* display select statistic form */}
                        {statForm}

                        {
                            // if the pot has any cards
                            pot.length > 0

                            // display the pot and it's length
                            ? cardPot
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
                        <p>{playerDeck[0].data.name} beat {computerDeck[0].data.name}! The card {andAlsoCardPot} will be added to your deck.</p>
                        {
                            // if the game isn't over yet
                            !gameOver

                            // show the next turn button
                            ? nextTurnButton

                            // else show the end game button
                            : endGameButton

                        }
                        {
                            // if the pot has any cards
                            pot.length > 0

                            // display the pot and it's length
                            ? cardPot
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
                            ? nextTurnButton

                            // else show the end game button
                            : endGameButton
                        }
                        {
                            // if the pot has any cards
                            pot.length > 0

                            // display the pot and it's length
                            ? cardPot
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
                        <p>{computerDeck[0].data.name} beat {playerDeck[0].data.name}! Your card {andAlsoCardPot} will be added to your opponent's deck.</p>
                        {
                            // if the game isn't over yet
                            !gameOver

                            // show the next turn button
                            ? nextTurnButton

                            // else show the end game button
                            : endGameButton
                        }
                        {
                            // if the pot has any cards
                            pot.length > 0

                            // display the pot and it's length
                            ? cardPot
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
                ? computerHand
                : null
            }
            {
                // if the game is over
                turnState === 5

                // display game over screen
                ? gameOverScreen
                : null
            }
        </section>
    )
}

// export Game component
export default Game;