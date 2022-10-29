// import styles
import './Main.css';

// import state functions
import { useEffect, useState } from 'react';

// import Firebase functions
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from './firebase';

// import components
import Game from "./Game";

// Main component
const Main = () => {

    // initial stateful variables
    const [ characterDeck, setCharacterDeck ] = useState({});
    const [ gameStart, setGameStart ] = useState(false);
    const [ playerName, setPlayerName ] = useState("");

    // array shuffle function
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
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
            for (let character in deck){
                allCards.push({key: character, data: deck[character]});
            }

            // shuffle the deck of all the cards
            shuffle(allCards);

            // set a counter to 1
            let i = 1;

            // loop through the deck of all cards
            for (let character in allCards){

                // push each card to the new deck
                newDeck.push(allCards[character]);

                // add to the counter
                i++

                // stop when the counter reaches 21
                if (i === 21){
                    break;
                }
            }

            // set character deck state to the shuffled 20 card deck
            setCharacterDeck(newDeck);

        })
    }, [])

    // when the user presses start game button
    const handleGameStart = (event) => {

        // prevent the page from refreshing
        event.preventDefault()

        // if the user has entered their name
        if (playerName){

            // start the game
            setGameStart(true);
        
        // if the user hasn't entered their name
        } else {

            // alert the user
            alert('Please enter your name.')
        }
    }

    // when the user inputs their name
    const handleInputChange = (event) => {

        // set the player name state to the input value
        setPlayerName(event.target.value)
    }

    // Main component return
    return (
        <main>
            {
                // if the game hasn't started yet
                !gameStart
                // display start screen
                ? <>
                    <form className="startScreen">
                        <label htmlFor="nameInput">Enter your first name:</label>
                        <input onChange={handleInputChange} type="text" id="nameInput"/>
                        <button className="button" onClick={handleGameStart}>Start Game</button>
                    </form>
                </>
                // if the game has started, display the game component
                : <Game deck={characterDeck} name={playerName}/>
            }
        </main>
    )
}

// export Main component
export default Main;