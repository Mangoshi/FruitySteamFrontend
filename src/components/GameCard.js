import { Link } from 'react-router-dom';

const GameCard = (props) => {
    return (
        <div>
            <p><Link to={`/games/${props.game._id}`}>{props.game.Name}</Link> </p>
            <hr />
        </div>
    );
};

export default GameCard;
