import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebase from './firebase';
import Game from "./Game";

const Main = () => {

    const [ characterDeck, setCharacterDeck ] = useState({});
    const [ gameStart, setGameStart ] = useState(false);
    const [ playerName, setPlayerName ] = useState("");

    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `/characters`);

        onValue(dbRef, (response) => {
            const newDeck = [];
            const deck = response.val();

            for (let character in deck){
                newDeck.push({key: character, data: deck[character]});
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
                    <label htmlFor="nameInput">Enter your name:</label>
                    <input onChange={handleInputChange} type="text" id="nameInput"/>
                    <button onClick={handleGameStart}>Start Game</button>
                </form>
                </>
                : <Game deck={characterDeck} />
            }
        </main>
    )
}

export default Main;