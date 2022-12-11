import {Button, Select, Window, WindowContent, WindowHeader} from "react95";
import mangowsWave from './images/img_mangowsWave.png'
import LoginRegisterForm from "../components/LoginRegisterForm";
import {useContext} from "react";
import {AuthContext} from "../AuthContext";
import {useLocation} from "react-router-dom";


const Home = ({theme, setTheme, themes}) => {

    const location = useLocation()
    let urlArray = location.pathname.split("/")
    // console.log(urlArray)
    let homePageActive = urlArray[1] === ""
    // console.log("homePageActive:",homePageActive)

    // importing token context to check if logged-in
    const {token, role} = useContext(AuthContext)
    // console.log("token:",token)

    // console.log("theme:",theme)

    if(homePageActive) {
        let themeOptions = [
            {label: 'aiee', value: themes.aiee},
            {label: 'ash', value: themes.ash},
            {label: 'azureOrange', value: themes.azureOrange},
            {label: 'bee', value: themes.bee},
            {label: 'blackAndWhite', value: themes.blackAndWhite},
            {label: 'blue', value: themes.blue},
            {label: 'brick', value: themes.brick},
            {label: 'candy', value: themes.candy},
            {label: 'cherry', value: themes.cherry},
            {label: 'coldGray', value: themes.coldGray},
            {label: 'counterStrike', value: themes.counterStrike},
            {label: 'darkTeal', value: themes.darkTeal},
            {label: 'denim', value: themes.denim},
            {label: 'eggplant', value: themes.eggplant},
            {label: 'fxDev', value: themes.fxDev},
            {label: 'highContrast', value: themes.highContrast},
            {label: 'honey', value: themes.honey},
            {label: 'hotChocolate', value: themes.hotChocolate},
            {label: 'hotdogStand', value: themes.hotdogStand},
            {label: 'lilac', value: themes.lilac},
            {label: 'lilacRoseDark', value: themes.lilacRoseDark},
            {label: 'maple', value: themes.maple},
            {label: 'marine', value: themes.marine},
            {label: 'matrix', value: themes.matrix},
            {label: 'millenium', value: themes.millenium},
            {label: 'modernDark', value: themes.modernDark},
            {label: 'molecule', value: themes.molecule},
            {label: 'ninjaTurtles', value: themes.ninjaTurtles},
            {label: 'olive', value: themes.olive},
            {label: 'original', value: themes.original},
            {label: 'pamelaAnderson', value: themes.pamelaAnderson},
            {label: 'peggysPastels', value: themes.peggysPastels},
            {label: 'plum', value: themes.plum},
            {label: 'polarized', value: themes.polarized},
            {label: 'powerShell', value: themes.powerShell},
            {label: 'rainyDay', value: themes.rainyDay},
            {label: 'raspberry', value: themes.raspberry},
            {label: 'redWine', value: themes.redWine},
            {label: 'rose', value: themes.rose},
            {label: 'seawater', value: themes.seawater},
            {label: 'shelbiTeal', value: themes.shelbiTeal},
            {label: 'slate', value: themes.slate},
            {label: 'solarizedDark', value: themes.solarizedDark},
            {label: 'solarizedLight', value: themes.solarizedLight},
            {label: 'spruce', value: themes.spruce},
            {label: 'stormClouds', value: themes.stormClouds},
            {label: 'theSixtiesUSA', value: themes.theSixtiesUSA},
            {label: 'tokyoDark', value: themes.tokyoDark},
            {label: 'toner', value: themes.toner},
            {label: 'tooSexy', value: themes.tooSexy},
            {label: 'travel', value: themes.travel},
            {label: 'vaporTeal', value: themes.vaporTeal},
            {label: 'vermillion', value: themes.vermillion},
            {label: 'violetDark', value: themes.violetDark},
            {label: 'vistaesqueMidnight', value: themes.vistaesqueMidnight},
            {label: 'water', value: themes.water},
            {label: 'white', value: themes.white},
            {label: 'windows1', value: themes.windows1},
            {label: 'wmii', value: themes.wmii}
        ]

        const setThemeAndLocalStorage = (theme) => {
            setTheme(theme)
            localStorage.setItem('theme', JSON.stringify(theme))
        }

        // console.log("theme:",theme)
        // console.log("themeOptions:",themeOptions)
        // console.log("themes",themes)

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
                            {token && role === 'basic' &&
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
                            <span>Theme.exe</span>
                            <Button disabled style={{marginTop: '0.2rem'}}>X</Button>
                        </WindowHeader>
                        <WindowContent>
                            <p>Select a different theme? </p>
                            <Select
                                onChange={e => setThemeAndLocalStorage(e.value)}
                                defaultValue={themes[theme.name]}
                                options={themeOptions}
                                menuMaxHeight={200}
                                width={160}
                            />
                        </WindowContent>
                    </Window>
                </div>
            </div>
        );
    }
};

export default Home;
