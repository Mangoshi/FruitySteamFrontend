import { Link } from 'react-router-dom';
import {MenuList, MenuListItem, Separator} from 'react95';

const Navbar = () => {
    return (
        <MenuList inline>
            <MenuListItem><Link to='/'>🏠 Home</Link></MenuListItem>
            <Separator orientation='vertical' size='43px'/>
            <MenuListItem><Link to='/games/1'>🎮 Games</Link></MenuListItem>
        </MenuList>
    );
};

export default Navbar;
