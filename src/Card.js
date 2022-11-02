// import styles
import './Card.css';

// import logo image
import logo from './assets/mobileLogo.png';

// import state functions
import { useState, useRef, useEffect } from 'react';

// import CSS transition component
import { CSSTransition } from 'react-transition-group';

// Card component (passed props.type, props.card, props.displayStats, and props.flipped from Game component)
const Card = (props) => {

    // initial stateful variable and ref
    const [ flipped, setFlipped ] = useState(true);
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
    let bgColor = `#000`;
    let textColor = `#fff`;

    // initial animation style objects
    let flipOut = {
        animation: 'none'
    };
    let fadeOut = {
        animation: 'none'
    };

    // render side effects when props.flipped changes
    useEffect(() => {
        
        // set flip in animation state to true, ensuring it's flipped over on re-render
        setFlipped(true);
        
    }, [props.flipped])
    
    // render side effects when props.card changes
    useEffect(() => {
        
        // set flipped state to false, triggering the animation
        setFlipped(false);
        
    }, [props.card])

    // function to determine light or dark text (adapted from https://awik.io/determine-color-bright-dark-using-javascript/)
    const lightOrDark = (color) => {

        // initial r, g, b, and hsp variables
        let r;
        let g;
        let b;
        let hsp;
        
        // convert the hex value to rgb and store those colour values in their variables (adapted from http://gist.github.com/983661)
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = (color >> 8) & 255;
        b = color & 255;
        
        // run the rgb value through the hsp equation (adapted from http://alienryderflex.com/hsp.html)
        hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );

        // using the hsp value, determine whether the colour is light or dark
        if (hsp>127.5) {
            // if the color is light, return black text
            return "#000000";
        } 
        else {
            // if the color is dark, return white text
            return "#ffffff";
        }
    }

    // string length check method
    const nameCheck = (name) => {

        // if the name is longer than 16 characters
        if (name.length > 16) {

            // return the first 16 characters with "..." at the end
            return name.substring(0, 14) + "..."
        
        // if the name is shorter than or equal to 16 characters
        } else {

            // return the full name
            return name
        }
    }
    
    // if there is a card
    if(props.card){

        // populate the known variables with the data
        name = nameCheck(props.card.data.name);
        img = props.card.data.img;
        alt = `Illustration of ` + props.card.data.name;
        url = props.card.data.url;
        int = props.card.data.int;
        str = props.card.data.str;
        spd = props.card.data.spd;
        dur = props.card.data.dur;
        fig = props.card.data.fig;
        bgColor = props.card.data.color;
        textColor = lightOrDark(bgColor);

        // if there is a pseudonym
        if (props.card.data.aka){

            // populate that variable as well
            aka = `(` + nameCheck(props.card.data.aka) + `)`;
        }
    }

    // if the card is ready to be flipped over
    if(props.flipped){

        // flip over the card
        flipOut = {
            animation: 'flipOut ease-in-out 1s',
        }

        // fade out the card front
        fadeOut = {
            animation: 'fadeOut ease-in 0.5s'
        }
    }

    // set the card styles to have the character's given background colour and either light or dark text
    let cardStyles = {
        backgroundColor: bgColor,
        color: textColor
    }

    // create the right div name for each card (playerCard or computerCard)
    let cardType = props.type + 'Card';

    // card title
    const cardTitle = (

        <div className="cardTitle">

            {/* character name and link */}
            <p style= {cardStyles} >
                <a href={url} target="_blank" rel="noreferrer">
                    {name}
                </a>
                <br/>

            {
                // if there is a pseudonym
                aka

                // display it
                ? aka
                : null
            }

            </p>

        </div>

    )

    // card statistics
    const cardStats = (

        <div className="cardStats">
            <ul className="stats" style= {cardStyles} >
                <li>Intelligence: {int}</li>
                <li>Strength: {str}</li>
                <li>Speed: {spd}</li>
                <li>Durability: {dur}</li>
                <li>Fighting: {fig}</li>
            </ul>
        </div> // .cardStats end

    )
    
    // Card component return
    return (

        // CSS transition component
        <CSSTransition
            in={flipped}
            nodeRef={nodeRef}
            timeout={1000}
            classNames="flip"
        >

            {/* card container */}
            <div className={cardType}>

                {/* takes a reference for card flip animation */}
                <div
                    className="innerCard"
                    ref={nodeRef}
                    style={flipOut}
                >

                    {/* card content */}
                    <div className="cardFront" style={fadeOut}>

                        {/* card title */}
                        {cardTitle}

                        {/* card image */}
                        <img src={img} alt={alt}/>

                        {/* card stats */}
                        {
                            // if the stats are meant to be visible
                            props.displayStats

                            // display the stats
                            ? cardStats

                            // else don't
                            : null
                        }

                    </div> {/* .cardFront end */}

                    {/* card reverse */}
                    <div className="cardBack">

                        {/* logo on back of card */}
                        <img className="cardLogo" src={logo} alt="Superhero Showdown Logo" />

                    </div>
                </div>
            </div>
        </CSSTransition>

    )
}

// export Card component
export default Card;