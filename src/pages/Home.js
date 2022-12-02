import {Button, Window, WindowContent, WindowHeader} from "react95";
import mangowsWave from './images/img_mangowsWave.png'
import LoginRegisterForm from "../components/LoginRegisterForm";
import {useContext, useState} from "react";
import {AuthContext} from "../AuthContext";


const Home = () => {

    // importing token context to check if logged-in
    const {token} = useContext(AuthContext)
    // console.log("token:",token)

    return (
        <div>
            <div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
                    <Window style={{width: "auto"}}>
                        <WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
                            <span style={{marginLeft: '0.2rem'}}>Home.exe</span>
                            <Button disabled style={{marginTop: '0.2rem'}}>X</Button>
                        </WindowHeader>
                        <WindowContent>
                            <p align='center' style={{fontSize: '1.5rem'}}>
                                Welcome to
                                <span style={{fontWeight: 'bold'}}>
                                &nbsp;FruitySteam
                                </span>
                                <sup style={{fontSize: '1rem', verticalAlign: 'super'}}>
                                    &#174;
                                </sup>
                                &nbsp;95
                            </p>
                            <div style={{display: "flex", justifyContent: 'center'}}>
                                <img src={mangowsWave} alt='logo'/>
                            </div>
                            {/* If there's a token, assume user is logged-in */}
                            {token &&
                            <p align='center' style={{fontSize: '1rem'}}>
                                You are now logged in! Click the games tab to start browsing our database.
                            </p>
                            }
                            {/* If there isn't a token, show login/register form */}
                            {!token &&
                                <LoginRegisterForm/>
                            }
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
