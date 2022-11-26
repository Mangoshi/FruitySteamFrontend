import {Button, Window, WindowContent, WindowHeader} from "react95";
import mangowsWave from './images/img_mangowsWave.png'

const Home = () => {
    return (
        <div>
        <div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
            <Window style={{width: "auto"}}>
                <WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
                    <span>Home.exe</span>
                    <Button style={{marginTop: '0.2rem'}}>X</Button>
                </WindowHeader>
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
                    <p align='center' style={{fontSize: '1rem'}}>
                        Before you begin, you should login or make an account!
                    </p>
                    <div align='center' style={{marginTop: '1rem'}}>
                        <Button style={{margin: '0.5rem'}}>Login</Button>
                        <Button style={{margin: '0.5rem'}}>Register</Button>
                    </div>
                </WindowContent>
            </Window>
        </div>
            <div style={{display: "flex", justifyContent: 'center'}}>
                <Window style={{width: "auto"}}>
                    <WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
                        <span>Information.exe</span>
                        <Button style={{marginTop: '0.2rem'}}>X</Button>
                    </WindowHeader>
                    <WindowContent>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, non.</p>
                    </WindowContent>
                </Window>
            </div>
        </div>
    );
};

export default Home;
