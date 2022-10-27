const ComputerCard = (props) => {

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

    if(props.card){
        name = props.card.data.name;
        img = props.card.data.img;
        alt = `Illustration of ` + props.card.data.name;
        url = props.card.data.url;
        if (props.card.data.aka){
            aka = `(` + props.card.data.aka + `)`;
        }
        int = props.card.data.int;
        str = props.card.data.str;
        spd = props.card.data.spd;
        dur = props.card.data.dur;
        fig = props.card.data.fig;
        color = props.card.data.color;
    }

    let cardStyles = {
        backgroundColor: color,
        opacity: 0.8
    }
    
    return (
        <div className="computerCard">
            <div className="cardTitle">
                <p style= {cardStyles} ><a href={url} target="_blank">{name}</a><br/>
                {
                    aka
                    ? aka
                    : null
                }
                </p></div>
            <img src={img} alt={alt}/>
            {
                props.displayStats
                ? <div className="cardStats">
                    <ul className="stats" style= {cardStyles} >
                        <li>Intelligence: {int}</li>
                        <li>Strength: {str}</li>
                        <li>Speed: {spd}</li>
                        <li>Durability: {dur}</li>
                        <li>Fighting: {fig}</li>
                    </ul>
                </div>
                : null
            }
        </div>
    )
}

export default ComputerCard;