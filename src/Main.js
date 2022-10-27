import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from './firebase';
import Game from "./Game";

const Main = () => {

    const [ characterDeck, setCharacterDeck ] = useState({});
    const [ gameStart, setGameStart ] = useState(false);
    const [ playerName, setPlayerName ] = useState("");

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
        const database = getDatabase(firebase);
        const dbRef = ref(database, `/characters`);

        onValue(dbRef, (response) => {
            const allCards = [];
            const newDeck = [];
            const deck = response.val();

            for (let character in deck){
                allCards.push({key: character, data: deck[character]});
            }

            shuffle(allCards);

            let i = 1;
            for (let character in allCards){
                newDeck.push(allCards[character]);
                i++
                if (i === 21){
                    break;
                }
            }

            setCharacterDeck(newDeck);

        })
    }, [])

    const handleGameStart = (event) => {
        event.preventDefault()
        if (playerName){
            setGameStart(true);
        }
    }

    const handleInputChange = (event) => {
        setPlayerName(event.target.value)
    }

    return (
        <main>
            {
                !gameStart
                ? <>
                    <form className="startScreen">
                        <label htmlFor="nameInput">Enter your first name:</label>
                        <input onChange={handleInputChange} type="text" id="nameInput"/>
                        <button className="button" onClick={handleGameStart}>Start Game</button>
                    </form>
                </>
                : <Game deck={characterDeck} name={playerName}/>
            }
        </main>
    )
}

export default Main;