// import styles
import './Card.css';

import { useState, useRef, useEffect } from 'react';

import { CSSTransition } from 'react-transition-group';

// PlayerCard component (passed props.card from Game component)
const PlayerCard = (props) => {

    const [ flipIn, setFlipIn ] = useState(false);
    const nodeRef = useRef(null);

    // intial card value variables
    let name = "";
    let img = "";
    let alt = "";
    let url = "";
    let aka = "";
    let int = 0;
    let str = 0;
    let spd = 0;
    let dur = 0;
    let fig = 0;
    let color = `#000`;

    // if there is a card
    if(props.card){

        // populate the known variables with the data
        name = props.card.data.name;
        img = props.card.data.img;
        alt = `Illustration of ` + props.card.data.name;
        url = props.card.data.url;
        int = props.card.data.int;
        str = props.card.data.str;
        spd = props.card.data.spd;
        dur = props.card.data.dur;
        fig = props.card.data.fig;
        color = props.card.data.color;

        // if there is a pseudonym
        if (props.card.data.aka){

            // populate that variable as well
            aka = `(` + props.card.data.aka + `)`;
        }
    }

    // set the card styles to have the character's given colour
    let cardStyles = {
        backgroundColor: color,
        opacity: 0.9
    }

    useEffect(() => {
        setFlipIn(true);
        setTimeout(() => {
            setFlipIn(false);
        }, 1000)
    }, [props.card])

    // PlayerCard component return
    return (
        <CSSTransition
            in={flipIn}
            nodeRef={nodeRef}
            timeout={1000}
            classNames="flip"
        >
            <div className="playerCard">

                <div className="innerCard" ref={nodeRef}>

                    <div className="cardFront">

                        <div className="cardTitle">
                            <p style= {cardStyles} ><a href={url} target="_blank" rel="noreferrer">{name}</a><br/>
                            {
                                // if there is a pseudonym
                                aka

                                // display it
                                ? aka
                                : null
                            }
                            </p>
                        </div>

                        <img src={img} alt={alt}/>

                        <div className="cardStats">

                            <ul className="stats" style= {cardStyles} >
                                <li>Intelligence: {int}</li>
                                <li>Strength: {str}</li>
                                <li>Speed: {spd}</li>
                                <li>Durability: {dur}</li>
                                <li>Fighting: {fig}</li>
                            </ul>

                        </div>

                    </div>

                    <div className="cardBack">
                        <p>Superhero Showdown</p> 
                    </div>

                </div>
            
            </div>
        </CSSTransition>
    )
}

// export PlayerCard
export default PlayerCard;