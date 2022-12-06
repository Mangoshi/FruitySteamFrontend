import {
	Anchor,
	Button,
	Frame,
	GroupBox,
	TextInput,
	Window,
	WindowContent,
	WindowHeader
} from 'react95';
import {Link, useNavigate} from "react-router-dom";
import Carousel from "nuka-carousel";
import ReactPlayer from 'react-player'
import styled from "styled-components";
import {useContext, useState} from "react";
import axios from "axios";
import {AuthContext} from "../AuthContext";

const GameForm = (props) => {

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

	const breakpoints = {
		sm: 480,
		md: 768,
		lg: 1024,
		xl: 1200
	}

	// Having this wrapping everything causes re-rendering issues
	// Have taken it out for now so I can type in the text fields
	// Apparently defining it outside the component is the way to go...
	const ResponsiveWrapper = styled.div`
		@media (min-width: ${breakpoints.sm}px){
			width: 90vw
		}
		@media (min-width: ${breakpoints.md}px){
			width: 80vw
		}
		@media (min-width: ${breakpoints.lg}px){
			width: 70vw
		}
		@media (min-width: ${breakpoints.xl}px){
			width: 60vw
		}
	`

	const {token} = useContext(AuthContext)
	const navigate = useNavigate();

	const [form, setForm] = useState({
		Name: '',
		AppID: '',
		Price: '',
		"Release date": '',
		"About the game": '',
		Developers: '',
		Publishers: '',
		Website: '',
		"Required age": '',
		"Tags": '',
		"Categories": '',
		"Genres": '',
		"DLC count": '',
		"Achievements": '',
		"Supported languages": '',
		"Full audio languages": '',
		"Metacritic score": '',
		"Metacritic url": '',
		"Support url": '',
		"Support email": '',
		"Header image": '',
		"Screenshots": '',
		"Movies": '',
	})

	const [errors, setErrors] = useState({
		Name: '',
		AppID: '',
		Price: '',
		"Release date": '',
		"About the game": '',
		Developers: '',
		Publishers: '',
		Website: '',
		"Required age": '',
		"Tags": '',
		"Categories": '',
		"Genres": '',
		"DLC count": '',
		"Achievements": '',
		"Supported languages": '',
		"Full audio languages": '',
		"Metacritic score": '',
		"Metacritic url": '',
		"Support url": '',
		"Support email": '',
		"Header image": '',
		"Screenshots": '',
		"Movies": '',
	});

	const handleForm = (e) => {
		console.log(e)
		let name = e.target.name;
		let value = e.target.value;

		setForm(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const isRequired = (fields) => {
		let error = false;

		fields.forEach(field => {
			if(!form[field]){
				error = true;
				setErrors(prevState => ({
					...prevState,
					[field]: {
						message: `${field} is required!`
					}
				}));
			} else {
				setErrors(prevState => ({
					...prevState,
					[field]: {
						message: ''
					}
				}));
			}
		});

		return error;
	};

	const submitForm = () => {
		if(!isRequired(['Name', 'AppID', 'Price'])){
			axios.post('https://fruity-steam.vercel.app/api/games', form, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			})
				.then(response => {
					console.log(response.data);
					navigate('/games');
				})
				.catch(err => {
					console.error(err);
					console.log(err.response.data.msg)
					setErrors(err.response.data.error);
				});
		}
	};

	// Regular Expression function to enforce numbers only
	const onlyAllowNumber = (input) => {
		const regex = new RegExp("^[0-9]*$");
		if (input.data != null && !regex.test(input.data))
			input.preventDefault();
	}

	// Custom styles to mimic the Windows 95 input field
	const numInputFrame = {
		padding: 1,
		width: '100%',
		height: '2.2rem',
	}
	const inputBgReg = {
		backgroundColor: 'white'
	}
	const inputBgErr = {
		backgroundColor: 'indianred'
	}
	const numInputStyles = {
		width: '90%',
		height: '1.5rem',
		marginTop: 1,
		marginLeft: 8,
		border: 'none',
		outline: 'none',
		fontSize: '1rem',
		font: 'unset'
	}

	// If there is no game props, it's an add form
	if(!props.game){
		return (
			<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
				<Window style={{width: '70vw'}}>
					<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
						<span style={{marginLeft: '0.2rem'}}>Add.exe</span>
						<Link to='/games/'>
							<Button style={{marginTop: '0.2rem'}}>X</Button>
						</Link>
					</WindowHeader>
					<WindowContent>
						<Frame variant='inside' style={{margin: '1rem', padding: '1rem', width: '94%'}}>
							<div style={halfSizeGroupParent}>
								<GroupBox label='Game Title *' style={halfSizeGroupLeft}>
									<TextInput
										placeholder={errors.Name.message ? errors.Name.message : 'Text here...'}
										name="Name"
										onChange={handleForm}
										value={form.Name}
										style={errors.Name.message ? inputBgErr : inputBgReg}
									/>
								</GroupBox>
								<GroupBox label='App ID *' style={halfSizeGroupRight}>
									<Frame variant={"field"} style={numInputFrame}>
									{/* Using regular input because React95 NumberInput is broken */}
									<input
										type="number"
										placeholder={errors.AppID.message ? errors.AppID.message : 'Number here...'}
										name="AppID"
										onChange={handleForm}
										onBeforeInput={onlyAllowNumber}
										value={form.AppID}
										min={2140821}
										max={9999999}
										style={errors.AppID.message
											?
											Object.assign(numInputStyles, inputBgErr)
											:
											Object.assign(numInputStyles, inputBgReg)
										}
									/>
									</Frame>
								</GroupBox>
							</div>
							<div style={halfSizeGroupParent}>
								<GroupBox label='Price ($) *' style={halfSizeGroupLeft}>
									<Frame variant={"field"} style={numInputFrame}>
										<input
											type="number"
											placeholder={errors.Price.message ? errors.Price.message : 'Number here...'}
											name="Price"
											onChange={handleForm}
											onBeforeInput={onlyAllowNumber}
											value={form.Price}
											style={errors.Price.message
												?
												Object.assign(numInputStyles, inputBgErr)
												:
												Object.assign(numInputStyles, inputBgReg)
											}
										/>
									</Frame>
								</GroupBox>
								<GroupBox label='Release Date' style={halfSizeGroupRight}>
									<Frame variant={"field"} style={numInputFrame}>
										<input
											type={"date"}
											placeholder={errors['Release date'].message ? errors['Release date'].message : 'Date here...'}
											style={errors['Release date'].message
												?
												Object.assign(numInputStyles, inputBgErr)
												:
												Object.assign(numInputStyles, inputBgReg)
											}
											name="Release date"
											onChange={handleForm}

										/>
									</Frame>
								</GroupBox>
							</div>
							<GroupBox label='Cover' style={{marginBottom: '1rem'}}>
								<p>COVER UPLOAD</p>
							</GroupBox>
							<GroupBox label='Screenshots' style={{marginBottom: '1rem'}}>
								<p>SCREENSHOT UPLOAD</p>
							</GroupBox>
							<GroupBox label='Movies' style={{marginBottom: '1rem'}}>
								<p>VIDEO UPLOAD</p>
							</GroupBox>
							<GroupBox label='About The Game' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1rem'}}>
								<TextInput
									placeholder={errors['About the game'].message ? errors['About the game'].message : 'Text here...'}
									style={errors['About the game'].message ? inputBgErr : inputBgReg}
									name="About the game"
									onChange={handleForm}
									multiline={true}

								/>
							</span>
							</GroupBox>
							<GroupBox label='Developers' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors.Developers.message ? errors.Developers.message : 'Text here...'}
									style={errors.Developers.message ? inputBgErr : inputBgReg}
									name="Developers"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='Publishers' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors.Publishers.message ? errors.Publishers.message : 'Text here...'}
									style={errors.Publishers.message ? inputBgErr : inputBgReg}
									name="Publishers"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='Website' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors.Website.message ? errors.Website.message : 'Text here...'}
									style={errors.Website.message ? inputBgErr : inputBgReg}
									name="Website"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='Required Age' style={{marginBottom: '1rem'}}>
								<Frame variant={"field"} style={numInputFrame}>
									<input
										type={'number'}
										placeholder={errors['Required age'].message ? errors['Required age'].message : 'Number here...'}
										style={errors['Required age'].message
											?
											Object.assign(numInputStyles, inputBgErr)
											:
											Object.assign(numInputStyles, inputBgReg)
										}
										name="Required age"
										onChange={handleForm}
										onBeforeInput={onlyAllowNumber}
									/>
								</Frame>
							</GroupBox>
							<GroupBox label='Categories' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors.Categories.message ? errors.Categories.message : 'Comma-seperated tags here...'}
									style={errors.Categories.message ? inputBgErr : inputBgReg}
									name="Categories"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='Tags' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors.Tags.message ? errors.Tags.message : 'Comma-seperated tags here...'}
									style={errors.Tags.message ? inputBgErr : inputBgReg}
									name="Tags"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='Genres' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors.Genres.message ? errors.Genres.message : 'Comma-seperated tags here...'}
									style={errors.Genres.message ? inputBgErr : inputBgReg}
									name="Genres"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='DLC Count' style={{marginBottom: '1rem'}}>
								<Frame variant={"field"} style={numInputFrame}>
									<input
										type={'number'}
										placeholder={errors['DLC count'].message ? errors['DLC count'].message : 'Number here...'}
										style={errors['DLC count'].message
											?
											Object.assign(numInputStyles, inputBgErr)
											:
											Object.assign(numInputStyles, inputBgReg)
										}
										name="DLC count"
										onChange={handleForm}
										onBeforeInput={onlyAllowNumber}
									/>
								</Frame>
							</GroupBox>
							<GroupBox label='Achievements' style={{marginBottom: '1rem'}}>
								<Frame variant={"field"} style={numInputFrame}>
									<input
										type={'number'}
										placeholder={errors['Achievements'].message ? errors['Achievements'].message : 'Number here...'}
										style={errors['Achievements'].message
											?
											Object.assign(numInputStyles, inputBgErr)
											:
											Object.assign(numInputStyles, inputBgReg)
										}
										name="Achievements"
										onChange={handleForm}
										onBeforeInput={onlyAllowNumber}
									/>
								</Frame>
							</GroupBox>
							<GroupBox label='Supported Languages' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors['Supported languages'].message ? errors['Supported languages'].message : 'Comma-seperated tags here...'}
									style={errors['Supported languages'].message ? inputBgErr : inputBgReg}
									name="Supported languages"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='Full Audio Languages' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors['Full audio languages'].message ? errors['Full audio languages'].message : 'Comma-seperated tags here...'}
									style={
										errors['Full audio languages'].message ? inputBgErr : inputBgReg}
									name="Full audio languages"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='Metacritic Score' style={{marginBottom: '1rem'}}>
								<Frame variant={"field"} style={numInputFrame}>
									<input
										type={'number'}
										placeholder={errors['Metacritic score'].message ? errors['Metacritic score'].message : 'Number here...'}
										style={errors['Metacritic score'].message
											?
											Object.assign(numInputStyles, inputBgErr)
											:
											Object.assign(numInputStyles, inputBgReg)
										}
										name="Metacritic score"
										onChange={handleForm}
										onBeforeInput={onlyAllowNumber}
									/>
								</Frame>
							</GroupBox>
							<GroupBox label='Support Link' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors['Support url'].message ? errors['Support url'].message : 'Text here...'}
									style={errors['Support url'].message ? inputBgErr : inputBgReg}
									name="Support url"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<GroupBox label='Support Email' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								<TextInput
									placeholder={errors['Support email'].message ? errors['Support email'].message : 'Text here...'}
									style={errors['Support email'].message ? inputBgErr : inputBgReg}
									name="Support email"
									onChange={handleForm}
								/>
							</span>
							</GroupBox>
							<div style={{display: 'flex', justifyContent:'space-evenly'}}>
								<Button>CANCEL</Button>
								<Button onClick={submitForm}>SUBMIT</Button>
							</div>
						</Frame>
					</WindowContent>
				</Window>
			</div>
		);
	}

	// If there is game props, it's an edit form
	else{
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

		for(let i in languages_array){
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

		// TODO: Figure out why videos completely break
		let movies = props.game['Movies']
		let moviesArray = movies.split(',')
		for(let i in moviesArray){
			// console.log(moviesArray[i])
			moviesArray[i] = <ReactPlayer url={moviesArray[i]} width={"100%"} controls={true} key={moviesArray[i]}/>
		}

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
		return (
			<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
				<ResponsiveWrapper>
					<Window>
						<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
							<span style={{marginLeft: '0.2rem'}}>{props.game.Name}.exe (Editing)</span>
							<Link to='/games/'>
								<Button style={{marginTop: '0.2rem'}}>X</Button>
							</Link>
						</WindowHeader>
						<WindowContent>
							<Frame variant='inside' style={{ margin: '1rem', padding: '1rem', width: '94%'}}>
								<a href={`https://store.steampowered.com/app/${props.game['AppID']}`}>
									<img src={props.game['Header image']} alt='Game header' width='100%'/>
								</a>
							</Frame>
							<Frame variant='inside' style={{
								margin: '1rem',
								padding: '1rem'
							}}>
								<GroupBox label='Screenshots' style={{marginBottom: '1rem'}}>
									{screenshot_slider}
								</GroupBox>
								<GroupBox label='Movies' style={{marginBottom: '1rem'}}>
									{movies_slider}
								</GroupBox>
								<div style={halfSizeGroupParent}>
									<GroupBox label='Release date' style={halfSizeGroupLeft}>
								<span style={{fontSize: '1.2rem'}}>
									{date}
								</span>
									</GroupBox>
									<GroupBox label='Price' style={halfSizeGroupRight}>
								<span style={{fontSize: '1.2rem'}}>
									$ {props.game['Price']}
								</span>
									</GroupBox>
								</div>
								<GroupBox label='About The Game' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1rem'}}>
									{props.game['About the game']}
								</span>
								</GroupBox>
								<GroupBox label='Developers' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Developers']}
								</span>
								</GroupBox>
								<GroupBox label='Publishers' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Publishers']}
								</span>
								</GroupBox>
								<GroupBox label='Website' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									<Anchor href={props.game['Website']}>{props.game['Website']}</Anchor>
								</span>
								</GroupBox>
								{ props.game['Required age'] ? (
									<GroupBox label='Required age' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Required age']}
									</span>
									</GroupBox>
								) : (
									<GroupBox label='Required age' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										Unknown
									</span>
									</GroupBox>
								)}
								<GroupBox label='Categories' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{categories_array}
								</span>
								</GroupBox>
								<GroupBox label='Tags' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{tags_array}
								</span>
								</GroupBox>
								<GroupBox label='Genres' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{genres_array}
								</span>
								</GroupBox>
								{ props.game['DLC Count'] ? (
									<GroupBox label='DLC Count' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['DLC count']}
									</span>
									</GroupBox>
								) : (
									<GroupBox label='DLC Count' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										None
									</span>
									</GroupBox>
								)}
								{ props.game['Achievements'] ? (
									<GroupBox label='Achievements' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										{props.game['Achievements']}
									</span>
									</GroupBox>
								) : (
									<GroupBox label='Achievements' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										None
									</span>
									</GroupBox>
								)}
								<GroupBox label='Supported Languages' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{languages_array}
								</span>
								</GroupBox>
								<GroupBox label='Full Audio Languages' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{ audioLanguagesArray ? ({audioLanguagesArray}) : ("None / Unknown") }
								</span>
								</GroupBox>
								<GroupBox label='Metacritic Score' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem', display: "flex", justifyContent:'space-between'}}>
									<Anchor href={props.game['Metacritic url']}>{props.game['Metacritic score']}</Anchor>
								</span>
								</GroupBox>
								{/* TODO: Check if any game has a user score, if not, remove */}
								<GroupBox label='User Score (Broken?)' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['User score'] ? (
										props.game['User score']
									) : (
										"None"
									)}
								</span>
								</GroupBox>
								<div style={halfSizeGroupParent}>
									<GroupBox label='Positive Reviews' style={halfSizeGroupLeft}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Positive']}
								</span>
									</GroupBox>
									<GroupBox label='Negative Reviews' style={halfSizeGroupRight}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Negative']}
								</span>
									</GroupBox>
								</div>
								<GroupBox label='Curator Recommendations' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Recommendations']}
								</span>
								</GroupBox>
								<GroupBox label='Estimated Owners' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Estimated owners']}
								</span>
								</GroupBox>
								<GroupBox label='Peak CCU' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Peak CCU']}
								</span>
								</GroupBox>
								<div style={halfSizeGroupParent}>
									<GroupBox label='Average playtime (forever)' style={halfSizeGroupLeft}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Average playtime forever']} hours
								</span>
									</GroupBox>
									<GroupBox label='Median playtime (forever)' style={halfSizeGroupRight}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Median playtime forever']} hours
								</span>
									</GroupBox>
								</div>
								<div style={halfSizeGroupParent}>
									<GroupBox label='Average playtime (2 weeks)' style={halfSizeGroupLeft}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Average playtime two weeks']} hours
								</span>
									</GroupBox>
									<GroupBox label='Median playtime (2 weeks)' style={halfSizeGroupRight}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Median playtime two weeks']} hours
								</span>
									</GroupBox>
								</div>
								<GroupBox label='Support Link' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									<Anchor href={props.game['Support url']}>{props.game['Support url']}</Anchor>
								</span>
								</GroupBox>
								<GroupBox label='Support Email' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{props.game['Support email'] ? (props.game['Support email']) : ("N/A")}
									<Anchor href={props.game['Support email']}>{props.game['Support email']}</Anchor>
								</span>
								</GroupBox>
							</Frame>
						</WindowContent>
					</Window>
				</ResponsiveWrapper>
			</div>
		);
	}
};

export default GameForm;
