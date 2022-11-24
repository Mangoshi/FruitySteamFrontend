import { Link } from 'react-router-dom';
import {Anchor, Button, Frame, Toolbar, Window, WindowContent, WindowHeader} from 'react95';

const GameCard = (props) => {
    return (
        <Frame
            variant='outside'
            shadow
            style={{ padding: '0.5rem', lineHeight: '1.5', width: 600 }}
        >
            <Window className='window' style={{ width:'100%' }}>
                <WindowHeader className='window-title' style={{ display: "flex", justifyContent: 'space-between'}}>
                    <span>{props.game.Name}</span>
                    <Button style={{margin: '0.2rem'}}>
                        <span>X</span>
                    </Button>
                </WindowHeader>
                <Toolbar>
                    <Button variant='menu' size='sm'>
                        File
                    </Button>
                    <Button variant='menu' size='sm'>
                        Edit
                    </Button>
                    <Button variant='menu' size='sm' disabled>
                        Save
                    </Button>
                </Toolbar>
                <WindowContent>
                    <Anchor><Link to={`/game/${props.game._id}`}>View Game</Link> </Anchor>
                </WindowContent>
                <Frame variant='well' className='footer'>
                    Put some useful information here!
                </Frame>
            </Window>
        </Frame>
    );
};

export default GameCard;
