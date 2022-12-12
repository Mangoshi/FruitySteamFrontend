// UI imports
import {Anchor, Button, Frame, GroupBox, Window, WindowContent, WindowHeader} from 'react95';
import ResponsiveWrapper from "./ResponsiveWrapper";
import Carousel from "nuka-carousel";
import ReactPlayer from 'react-player'

// React Router imports
import {useNavigate} from "react-router-dom";

// HTTP request imports
import axios from "axios";

// State imports
import {AuthContext} from "../AuthContext";
import {useContext, useEffect, useState} from "react";
import {useGame} from "../useGame";

const GameCardDetailed = (props) => {

	// Using navigate to handle redirects
	const navigate = useNavigate()

	// Using AuthContext to check user-related state
	const { role, id, token } = useContext(AuthContext)

	// Initialising wishlist state
	const [wishlist, setWishlist] = useState([])

	// Importing updateGameState function from useGame hook
	const { updateGameState } = useGame()
	// Setting game state to the viewed game
	updateGameState(props.game.Name)

	// GET request to users to get wishlist
	useEffect(() => {
		axios.get(`https://fruity-steam.vercel.app/api/users/id/${id}`,
			{
				headers: {
					"Authorization": `Bearer ${token}`
				}
			})
			.then((response) => {
				// console.log("user wishlist:",response.data.data[0].wishlist);
				setWishlist(response.data.data[0].wishlist)
			})
			.catch((err) => {
				// console.error(err);
				console.log(err.response.data.message);
			});
	}, [id]);

	// Function to check if game is in wishlist
	// Returns true if game is in wishlist, false if not
	const checkIfInWishlist = (game) => {
		// console.log("wishlist:",wishlist);
		// console.log("game:",game);
		// console.log("in wishlist?", wishlist.filter(wish => wish._id === game._id).length > 0);
		return wishlist.filter(wish => wish._id === game._id).length > 0
	}

	// Function to add game to wishlist
	function addToWishlist() {
		let newWishlist = wishlist.concat(props.game._id)
		updateUser(newWishlist)
	}

	// Function to remove game from wishlist
	function removeFromWishlist() {
		let newWishlist = wishlist.filter(entry => entry._id !== props.game._id)
		updateUser(newWishlist)
	}

	// Function to update user's wishlist & redirect to their profile
	function updateUser(newWishlist) {
		axios.put(`https://fruity-steam.vercel.app/api/users/id/${id}`,
			{
				wishlist: newWishlist
			},
			{
				headers: {
					"Authorization": `Bearer ${token}`
				}})
			.then(response => {
				console.log(response.data);
				navigate('/me');
			})
			.catch(err => {
				console.error(err);
				console.log(err.response.data.msg)
			});
	}

	let categories = props.game['Categories']
	// Split categories into an array based off the commas
	let categories_array = categories.split(',')
	// For each category
	for(let i in categories_array){
		// Make category an image, using shields.io to style as a label
		categories_array[i] = <img
			src={`https://img.shields.io/static/v1?label=&message=${categories_array[i]}&color=grey`}
			alt={categories_array[i]}
			style={{marginRight: '0.2rem'}}
			key={`category-${i}`}
		/>
		// console.log(categories_array[i])
	}

	let tags = props.game['Tags']
	// Split tags into an array based off the commas
	let tags_array = tags.split(',')
	// For each category
	for(let i in tags_array){
		// Make category an image, using shields.io to style as a label
		tags_array[i] = <img
			src={`https://img.shields.io/static/v1?label=&message=${tags_array[i]}&color=grey`}
			alt={tags_array[i]}
			style={{marginRight: '0.2rem'}}
			key={`tag-${i}`}
		/>
		// console.log(tags_array[i])
	}

	let genres = props.game['Genres']
	// Split genres into an array based off the commas
	let genres_array = genres.split(',')
	// For each category
	for(let i in genres_array){
		// Make category an image, using shields.io to style as a label
		genres_array[i] = <img
			src={`https://img.shields.io/static/v1?label=&message=${genres_array[i]}&color=grey`}
			alt={genres_array[i]}
			style={{marginRight: '0.2rem'}}
			key={`tag-${i}`}
		/>
		// console.log(genres_array[i])
	}

	// Converting ISO date string to locale date string
	let date = new Date(props.game['Release date']).toLocaleDateString()

	let languages = props.game['Supported languages']
	// Remove all apostrophes
	let formattedLanguages = languages.replace(/'/g, '')
	// Remove the leading square bracket
	formattedLanguages = formattedLanguages.replace('[', '')
	// Remove the trailing square bracket
	formattedLanguages = formattedLanguages.replace(']', '')
	// Split formatted string into an array
	let languages_array = formattedLanguages.split(',')

	// For each language
	for(let i in languages_array){
		// Make language an image, using shields.io to style as a label
		languages_array[i] = <img
			src={`https://img.shields.io/static/v1?label=&message=${languages_array[i]}&color=grey`}
			alt={languages_array[i]}
			style={{marginRight: '0.2rem'}}
			key={`language-${i}`}
		/>
		// console.log(languages_array[i])
	}

	let audioLanguages = props.game['Full audio languages']
		.replace('[','')
		.replace(']','')

	let audioLanguagesArray
	if(audioLanguages){
		let audioLanguagesArray = audioLanguages
			.replace(/'/g,'')
			.split(',')

		for(let i in audioLanguagesArray){
			audioLanguagesArray[i] = <img
				src={`https://img.shields.io/static/v1?label=&message=${audioLanguagesArray[i]}&color=grey`}
				alt={audioLanguagesArray[i]}
				style={{marginRight: '0.2rem'}}
				key={`audioLanguage-${i}`}
			/>
			// console.log(languages_array[i])
		}
	}

	// Initialising screenshots string array
	let screenshots = props.game['Screenshots']
	// Splitting screenshots by comma (making a proper array)
	let screenshots_array = screenshots.split(',')
	// console.log(screenshots_array)
	for(let i in screenshots_array){
		screenshots_array[i] = <img
			src={screenshots_array[i]}
			alt={screenshots_array[i]}
			key={`screenshot-${i}`}
			width={'100%'}
			draggable={'false'}
		/>
	}

	// Wrapping the array in a carousel
	const screenshot_slider = (
		<Carousel
			autoplay={true}
			autoplayInterval={5000}
			wrapAround={true}
			enableKeyboardControls={true}
		>
			{screenshots_array}
		</Carousel>
	);

	// TODO: Figure out why videos give MIME type errors
	let movies = props.game['Movies']
	let moviesArray = movies.split(',')
	// For each movie
	for(let i in moviesArray){
		// console.log(moviesArray[i])
		// Wrap the movie in ReactPlayer element (for video playback)
		moviesArray[i] = <ReactPlayer url={moviesArray[i]} width={"100%"} controls={true} key={moviesArray[i]}/>
	}

	// Wrapping the array in a carousel
	const movies_slider = (
		<Carousel
			autoplay={true}
			autoplayInterval={5000}
			wrapAround={true}
			enableKeyboardControls={true}
		>
			{moviesArray}
		</Carousel>
	);

	// Container style variables
	const halfSizeGroupParent = {
		display: "flex",
		justifyContent: 'space-between'
	}
	const halfSizeGroupLeft = {
		marginBottom: '1rem',
		marginRight: '0.5rem',
		width: '100%'
	}
	const halfSizeGroupRight = {
		marginBottom: '1rem',
		marginLeft: '0.5rem',
		width: '100%'
	}

	return (
		<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
			<ResponsiveWrapper>
				<Window style={{width: '100%'}}>
					<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
						<span style={{marginLeft: '0.2rem'}}>{props.game.Name}.exe</span>
						<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
					</WindowHeader>
					<WindowContent>
						<Frame variant='inside' style={{ margin: '1rem', padding: '1rem', width: '94%'}}>
							{props.game['Header image'] ?
								<a href={`https://store.steampowered.com/app/${props.game['AppID']}`}>
									<img src={props.game['Header image']} alt='Game header' width='100%'/>
								</a>
							: <p style={{fontSize: '1.2rem'}}>No header image!</p>}
						</Frame>

						<Frame variant='inside' style={{
							margin: '1rem',
							padding: '1rem',
							width: '94%'
						}}>
							<GroupBox label='Screenshots' style={{marginBottom: '1rem'}}>
								{props.game.Screenshots ? screenshot_slider
								: <p style={{fontSize: '1.2rem'}}>No screenshots!</p>}
							</GroupBox>
							<GroupBox label='Videos' style={{marginBottom: '1rem'}}>
								{props.game.Movies ? movies_slider
								: <p style={{fontSize: '1.2rem'}}>No videos!</p>}
							</GroupBox>
							<div style={halfSizeGroupParent}>
								<GroupBox label='Release date' style={halfSizeGroupLeft}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Release date'] ? date : 'Not provided!'}
									</span>
								</GroupBox>
								<GroupBox label='Price' style={halfSizeGroupRight}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game.Price ? '$ ' + props.game['Price'] : 'Free / Not provided!'}
									</span>
								</GroupBox>
							</div>
							<GroupBox label='About The Game' style={{marginBottom: '1rem'}}>
								{props.game['About the game'] ?
									<span style={{fontSize: '1rem'}}>
										{props.game['About the game']}
									</span>
									: <span style={{fontSize: '1.2rem'}}>Not provided!</span>}
							</GroupBox>
							<GroupBox label='Developers' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game.Developers ? props.game['Developers'] : 'Not provided!'}
								</span>
							</GroupBox>
							<GroupBox label='Publishers' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game.Publishers ? props.game['Publishers'] : 'Not provided!'}
								</span>
							</GroupBox>
							<GroupBox label='Website' style={{marginBottom: '1rem'}}>
								{props.game.Website ?
								<span style={{fontSize: '1.2rem'}}>
									<Anchor href={props.game['Website']}>{props.game['Website']}</Anchor>
								</span>
									:
								<span style={{fontSize: '1.2rem'}}>
									Not provided!
								</span>
								}
							</GroupBox>
							<GroupBox label='Required age' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Required age'] ? props.game['Required age'] : 'Unknown'}
								</span>
							</GroupBox>
							<GroupBox label='Categories' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game.Categories ? categories_array : 'Not provided!'}
								</span>
							</GroupBox>
							<GroupBox label='Tags' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game.Tags ? tags_array : 'Not provided!'}
								</span>
							</GroupBox>
							<GroupBox label='Genres' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game.Genres ? genres_array : 'Not provided!'}
								</span>
							</GroupBox>
							<GroupBox label='DLC Count' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['DLC count'] ? props.game['DLC count'] : 'None'}
								</span>
							</GroupBox>
							<GroupBox label='Achievements' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Achievements'] ? props.game['Achievements'] : 'None'}
								</span>
							</GroupBox>
							<GroupBox label='Supported Languages' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Supported languages'] ? languages_array : 'None / Unknown'}
								</span>
							</GroupBox>
							<GroupBox label='Full Audio Languages' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{audioLanguagesArray ? audioLanguagesArray : "None / Unknown"}
								</span>
							</GroupBox>
							<GroupBox label='Metacritic Score' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem', display: "flex", justifyContent:'space-between'}}>
									{props.game['Metacritic score'] ?
									<Anchor href={props.game['Metacritic url']}>{props.game['Metacritic score']}</Anchor>
									: 'Not provided!' }
								</span>
							</GroupBox>
							<GroupBox label='User Score' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['User score'] ? props.game['User score'] : 'Not provided!'}
								</span>
							</GroupBox>
							<div style={halfSizeGroupParent}>
								<GroupBox label='Positive Reviews' style={halfSizeGroupLeft}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Positive'] ? props.game['Positive'] : 'None yet!'}
									</span>
								</GroupBox>
								<GroupBox label='Negative Reviews' style={halfSizeGroupRight}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Negative'] ? props.game['Negative'] : 'None yet!'}
									</span>
								</GroupBox>
							</div>
							<GroupBox label='Curator Recommendations' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Recommendations'] ? props.game['Recommendations'] : 'None yet!'}
								</span>
							</GroupBox>
							<GroupBox label='Estimated Owners' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Estimated owners'] ? props.game['Estimated owners'] : 'Unknown'}
								</span>
							</GroupBox>
							<GroupBox label='Peak CCU' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Peak CCU'] ? props.game['Peak CCU'] : 'Unknown'}
								</span>
							</GroupBox>
							<div style={halfSizeGroupParent}>
								<GroupBox label='Average playtime (forever)' style={halfSizeGroupLeft}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Average playtime forever'] ? props.game['Average playtime forever'] + ' hours' : 'Unknown'}
									</span>
								</GroupBox>
								<GroupBox label='Median playtime (forever)' style={halfSizeGroupRight}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Median playtime forever'] ? props.game['Median playtime forever'] + ' hours' : 'Unknown'}
									</span>
								</GroupBox>
							</div>
							<div style={halfSizeGroupParent}>
								<GroupBox label='Average playtime (2 weeks)' style={halfSizeGroupLeft}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Average playtime two weeks'] ? props.game['Average playtime two weeks'] + ' hours' : 'Unknown'}
									</span>
								</GroupBox>
								<GroupBox label='Median playtime (2 weeks)' style={halfSizeGroupRight}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Median playtime two weeks'] ? props.game['Median playtime two weeks'] + ' hours' : 'Unknown'}
									</span>
								</GroupBox>
							</div>
							<GroupBox label='Support Link' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Support url'] ?
									<Anchor href={props.game['Support url']}>{props.game['Support url']}</Anchor>
									: 'Not provided!' }
								</span>
							</GroupBox>
							<GroupBox label='Support Email' style={{marginBottom: '1rem'}}>
								{props.game['Support email'] ?
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Support email'] ? (props.game['Support email']) : ("N/A")}
								</span>
								: <span style={{fontSize: '1.2rem'}}>Not provided!</span> }
							</GroupBox>
							<div style={{display: 'flex', justifyContent: 'space-around'}}>
								<Button onClick={() => navigate(-1)}>BACK</Button>
								{checkIfInWishlist(props.game) ?
									<Button onClick={removeFromWishlist}>REMOVE FROM WISHLIST</Button>
									:
									<Button onClick={addToWishlist}>ADD TO WISHLIST</Button>
								}
								{role === 'admin' &&
								<Button onClick={() => navigate(`/games/edit/${props.game._id}`)}>EDIT</Button>
								}
							</div>
						</Frame>
					</WindowContent>
				</Window>
			</ResponsiveWrapper>
		</div>
	);
};

export default GameCardDetailed;
