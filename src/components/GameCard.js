import { Link } from 'react-router-dom';
import {Anchor, Button, Frame, TableDataCell, TableRow, Toolbar, Window, WindowContent, WindowHeader} from 'react95';

const GameCard = (props) => {
    return (
            <TableRow>
                <TableDataCell style={{width: '400px'}}>
                    <div style={{whiteSpace: 'break-spaces'}}>{props.game.Name}</div>
                </TableDataCell>
                <TableDataCell>
                    <Anchor><Link to={`/game/${props.game._id}`}>View Game</Link> </Anchor>
                </TableDataCell>
            </TableRow>
    );
};

export default GameCard;
