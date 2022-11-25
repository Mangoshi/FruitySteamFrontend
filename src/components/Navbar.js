import { Link } from 'react-router-dom';
import {MenuList, MenuListItem, Separator} from 'react95';

const Navbar = () => {
    return (
        <MenuList inline style={{marginBottom: '1rem'}}>
            <MenuListItem><Link to='/'>🏠 Home</Link></MenuListItem>
            <Separator orientation='vertical' size='43px'/>
            <MenuListItem><Link to='/games/'>🎮 Games</Link></MenuListItem>
        </MenuList>
    );
};

export default Navbar;
