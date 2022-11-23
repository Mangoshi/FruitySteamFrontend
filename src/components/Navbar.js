import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            <Link to='/'>Home</Link> |&nbsp;
            <Link to='/games'>Games</Link>
        </div>
    );
};

export default Navbar;
