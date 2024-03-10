// import styles
import './Main.css';

// import state functions
import { useEffect, useState, useRef } from 'react';

// import Firebase functions
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from './firebase';

// import components
import Game from "./Game";

// Main component
const Main = () => {

    // initial stateful variables and ref
    const [characterDeck, setCharacterDeck] = useState({});
    const [gameStart, setGameStart] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [showInstructions, setShowInstructions] = useState(false);
    const instructionContent = useRef(null);

    // fisher-yates shuffle array function (adapted from https://www.jstips.co/en/javascript/shuffle-an-array/)
    const shuffle = (array) => {

        // loop through the array
        for (let i = array.length - 1; i > 0; i--) {

            // shuffle the indexes
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        // return the array
        return array;
    };

    // initial render side effects
    useEffect(() => {

        // character database variables
        const database = getDatabase(firebase);
        const dbRef = ref(database, `/characters`);

        // retreive character card data
        onValue(dbRef, (response) => {

            // empty deck arrays
            const allCards = [];
            const newDeck = [];

            // character card data variable
            const deck = response.val();

            // loop through character card data and push each card to a deck of all cards
            for (let character in deck) {
                allCards.push({ key: character, data: deck[character] });
            }

            // shuffle the deck of all the cards
            shuffle(allCards);

            // set a counter to 1
            let cardCounter = 1;

            // loop through the deck of all cards
            for (let character in allCards) {

                // push each card to the new deck
                newDeck.push(allCards[character]);

                // add to the counter after every card
                cardCounter++

                // stop when the counter reaches 21
                if (cardCounter === 21) {
                    break;
                }
            }

            // set character deck state to the shuffled 20 card deck
            setCharacterDeck(newDeck);

        // stop listening for data once it has been received
        }, { onlyOnce: true })
    }, [])

    // when the user presses start game button
    const handleGameStart = (event) => {

        // prevent the page from refreshing
        event.preventDefault()

        // if the user has entered their name
        if (playerName) {

            // start the game
            setGameStart(true);

        // if the user hasn't entered their name
        } else {

            // alert the user
            alert('Please enter your name')
        }
    }

    // when the user inputs their name
    const handleInputChange = (event) => {

        // set the player name state to the input value
        setPlayerName(event.target.value)
    }

    // when the user clicks the show/hide instructions button
    const handleShowInstructions = () => {

        // if the instructions are showing
        if (showInstructions) {

            // hide the instructions
            setShowInstructions(false);
        
        // if the instructions aren't showing
        } else {

            // show the instructions
            setShowInstructions(true);
        }
    }

    // instruction text
    const instructionText = (

        // takes a reference to show/hide text
        <div ref={instructionContent}
            className="instructionText"
            style={

                // if the instructions are meant to be showing
                showInstructions

                    // give them full height and opacity
                    ? { maxHeight: instructionContent.current.scrollHeight + 5 + 'px', opacity: 1 }

                    // else remove the height and opacity
                    : { maxHeight: "0px", opacity: 0 }
            }>

            {/* instructions */}
            
            <p>When the game starts, 20 cards are pulled from the database, shuffled, and dealt out into two decks—one for you and one for the computer (your opponent). Each card has a Marvel Comics superhero and their corresponding statistics (between 1 and 7) in Intelligence, Strength, Speed, Durability, and Fighting.</p>
            <p>Every round, the top cards from both decks are revealed, with your card's stats visible, and your opponent's card's stats hidden. You then pick the stat from your card that you think has a higher number than your opponent's.</p>
            <p>Whichever card has the highest number for the chosen stat wins the round. Both cards are then moved to the bottom of the winner's deck. In the case of a tie, the cards are moved to a pot, to be collected by the next winner.</p>
            <p>Gameplay repeats until either you or the computer runs out of cards. If you win the game, your name will be added to the recent winners board. Have fun!</p>

        </div>
    )

    // Main component return
    return (
        <main>
            <div className="wrapper">
            {
                // if the game hasn't started yet
                !gameStart
                    // display instructions and start screen
                    ? <>

                        {/* instructions */}
                        <div className="instructions">

                            <h3>How to Play</h3>

                            {instructionText}

                            {/* hide/show instructions button */}
                            <button className="button" onClick={handleShowInstructions}>
                                {
                                    showInstructions
                                        ? "Hide "
                                        : "Show "
                                }
                                Instructions</button>

                        </div>

                        {/* start screen */}
                        <form className="startScreen">

                            <label htmlFor="nameInput">Enter your first name:</label>
                            
                            {/* name input */}
                            <input onChange={handleInputChange} type="text" id="nameInput" />

                            {/* start game button */}
                            <button className="button" onClick={handleGameStart}>Start Game</button>

                        </form>
                    </>
                    // if the game has started, display the game component
                    : <Game deck={characterDeck} name={playerName} />
            }
            </div>
        </main>
    )
}

// export Main component
export default Main;