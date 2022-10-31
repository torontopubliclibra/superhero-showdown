// import styles
import './Card.css';

// import state functions
import { useState, useRef, useEffect } from 'react';

// import transition hook
import { CSSTransition } from 'react-transition-group';

// Card component (passed props.type, props.card, props.displayStats from Game component)
const Card = (props) => {

    // initial stateful variable and ref
    const [ flipIn, setFlipIn ] = useState(false);
    const nodeRef = useRef(null);
    
    // initial card value variables
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
    let flipOut = {
            animation: 'none'
        };
    let fadeOut = null;

    useEffect(() => {

        // set flip in animation state to true
        setFlipIn(true);

    }, [props.flipped])

    // render side effects when props.card changes
    useEffect(() => {

        // set flip in animation state to false
        setFlipIn(false);

    }, [props.card])


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

    if(props.flipped){
        flipOut = {
            animation: 'flipOut ease-in-out 1s',
        }
        fadeOut = {
            animation: 'fadeOut ease-in 0.5s'
        }
    }

    // set the card styles to have the character's given colour
    let cardStyles = {
        backgroundColor: color,
        opacity: 0.9,
    }

    let cardType = props.type + 'Card';
    
    // Card component return
    return (

        // css transition hook
        <CSSTransition
            in={flipIn}
            nodeRef={nodeRef}
            timeout={1000}
            classNames="flip"
        >

            {/* card container */}
            <div className={cardType}>

                {/* animated card */}
                <div className="innerCard" ref={nodeRef} style={flipOut}>

                    {/* card content */}
                    <div className="cardFront" style={fadeOut}>

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
                        </div> {/* .cardTitle end */}

                        <img src={img} alt={alt}/>

                        {
                            // if the stats are meant to be visible
                            props.displayStats

                            // display the stats
                            ? <div className="cardStats">
                                <ul className="stats" style= {cardStyles} >
                                    <li>Intelligence: {int}</li>
                                    <li>Strength: {str}</li>
                                    <li>Speed: {spd}</li>
                                    <li>Durability: {dur}</li>
                                    <li>Fighting: {fig}</li>
                                </ul>
                            </div> // .cardStats end

                            // else don't
                            : null
                        }
                    </div>

                    {/* card reverse */}
                    <div className="cardBack">
                        <img className="cardLogo" src="./mobile-logo.png" alt="Superhero Showdown Logo" />
                    </div>

                </div>

            </div>
        </CSSTransition>

    )
}

// export Card component
export default Card;