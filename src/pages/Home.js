import {Window, WindowContent, WindowHeader} from "react95";
import mangowsWave from './images/img_mangowsWave.png'

const Home = () => {
    return (
        <div style={{display: "flex", justifyContent: 'center'}}>
            <Window style={{width: "auto"}}>
                <WindowHeader>Home.exe</WindowHeader>
                <WindowContent>
                    <p align='center' style={{fontSize: '1.5rem'}}>
                            Welcome to
                        <span style={{fontWeight: 'bold'}}>
                            &nbsp;FruitySteam
                        </span>
                        <sup style={{fontSize: '1rem', verticalAlign:'super'}}>
                            &#174;
                        </sup>
                            &nbsp;95
                    </p>
                    <div style={{display: "flex", justifyContent: 'center'}}>
                        <img src={mangowsWave} alt='logo'/>
                    </div>
                </WindowContent>
            </Window>
        </div>
    );
};

export default Home;
