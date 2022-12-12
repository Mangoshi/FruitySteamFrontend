// UI imports
import {
	Button,
	Frame,
	GroupBox,
	TextInput,
	Window,
	WindowContent,
	WindowHeader
} from 'react95';
import ResponsiveWrapper from "./ResponsiveWrapper";

// React Router imports
import {useNavigate} from "react-router-dom";

// HTTP request imports
import axios from "axios";

// State imports
import {useContext, useState} from "react";
import {AuthContext} from "../AuthContext";
import {useGame} from "../useGame";

const GameForm = ({game, setGame}) => {

	// Importing token context to check if logged-in
	const {token} = useContext(AuthContext)
	// Importing useNavigate from React Router to handle redirects
	const navigate = useNavigate();

	// Importing updateGameState function from useGame
	const { updateGameState } = useGame()
	// If game props are passed, set the game state to the game
	if(game){
		updateGameState(game.Name)
	}

	// State for form inputs
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

	// State for form errors
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

	// State for request errors
	const [error , setError] = useState(null);

	// Function to handle form input changes
	const handleForm = (e) => {
		console.log(e)
		let name = e.target.name;
		let value = e.target.value;
		if(!game){
			setForm(prevState => ({
				...prevState,
				[name]: value
			}));
		} else {
			setGame(prevState => ({
				...prevState,
				[name]: value
			}));
		}
	};

	// Function to handle required fields
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

	// Initialising formatted form data variables
	let formattedCategories,
		formattedTags,
		formattedGenres,
		formattedLanguages,
		formattedAudioLanguages

	// Function to submit form data
	const submitForm = () => {
		// If a game wasn't passed as a prop, request is a POST
		if(!game){
			if(!isRequired(['Name', 'AppID', 'Price'])){
				axios.post('https://fruity-steam.vercel.app/api/games', form, {
				headers: {
					"Authorization": `Bearer ${token}`
				}})
				.then(response => {
					console.log(response.data);
					navigate(-1);
				})
				.catch(err => {
					console.error(err);
					console.log(err.response.data.msg)
					setError(err.response.data.msg);
				});
			}
		// If a game was passed as a prop, request is a PUT
		} else {
			// TODO: Figure out why isRequired is not working here
			axios.put(`https://fruity-steam.vercel.app/api/games/id/${game._id}`, game, {
			headers: {
				"Authorization": `Bearer ${token}`
			}})
			.then(response => {
				console.log(response.data);
				navigate(-1);
			})
			.catch(err => {
				console.error(err);
				console.log(err.response.data.msg)
				setError(err.response.data.error);
				});
		}
	};

	// Regular Expression function to enforce numbers and full-stops only
	const onlyAllowNumber = (input) => {
		const regex = new RegExp("^[0-9.]*$");
		if (input.data != null && !regex.test(input.data))
			input.preventDefault();
	}

	// Function to format dates to YYYY-MM-DD for edit form
	const dateFormatted = (date) => {
		if(date){
			let dateObj = new Date(date);
			return dateObj.toISOString().split('T')[0];
		}
	}

	// Custom styles to mimic the Windows 95 input field
	const numInputFrame = {
		padding: 1,
		width: '100%',
		height: '2.2rem',
	}
	const inputBgReg = {
		textDecoration: 'none'
	}
	const inputBgErr = {
		textDecoration: 'underline red'
	}
	const numInputStyles = {
		width: '90%',
		height: '1.5rem',
		marginTop: 1,
		marginLeft: 8,
		border: 'none',
		outline: 'none',
		fontSize: '1rem',
		font: 'unset',
		backgroundColor: 'white',
	}

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

	// If there is no game props, it's an add form
	if(!game){
		return (
			<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
				<ResponsiveWrapper>
					<Window style={{width: '100%'}}>
						<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
							<span style={{marginLeft: '0.2rem'}}>Add.exe</span>
							<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
						</WindowHeader>
						<WindowContent>
							<Frame variant='inside' style={{margin: '1rem', padding: '1rem', width: '94%'}}>
								<div style={halfSizeGroupParent}>
									<GroupBox label='Game Title *' style={halfSizeGroupLeft}>
										<TextInput
											placeholder={'Text here...'}
											name="Name"
											onChange={handleForm}
											value={form.Name}
										/>
										{errors.Name.message &&
										<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
											<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
												{errors.Name.message}
											</small>
										</div>
										}
									</GroupBox>
									<GroupBox label='App ID *' style={halfSizeGroupRight}>
										<Frame variant={"field"} style={numInputFrame}>
										{/* Using regular input because React95 NumberInput is broken */}
										<input
											type="number"
											placeholder={'Number here...'}
											name="AppID"
											onChange={handleForm}
											onBeforeInput={onlyAllowNumber}
											value={form.AppID}
											min={2140821}
											max={9999999}
											style={numInputStyles}
										/>
											{errors.AppID.message &&
												<div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
													<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
														{errors.AppID.message}
													</small>
												</div>
											}
										</Frame>
									</GroupBox>
								</div>
								<div style={halfSizeGroupParent}>
									<GroupBox label='Price ($) *' style={halfSizeGroupLeft}>
										<Frame variant={"field"} style={numInputFrame}>
											<input
												type="number"
												placeholder={'Number here...'}
												name="Price"
												onChange={handleForm}
												onBeforeInput={onlyAllowNumber}
												value={form.Price}
												style={numInputStyles}
											/>
											{errors.Price.message &&
											<div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
												<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
													{errors.Price.message}
												</small>
											</div>
											}
										</Frame>
									</GroupBox>
									<GroupBox label='Release Date' style={halfSizeGroupRight}>
										<Frame variant={"field"} style={numInputFrame}>
											<input
												type={"date"}
												style={numInputStyles}
												name="Release date"
												onChange={handleForm}
											/>
										</Frame>
										{errors['Release date'].message &&
											<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
												<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
													{errors["Release date"].message}
												</small>
											</div>
										}
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
											placeholder={'Text here...'}
											name="About the game"
											onChange={handleForm}
											multiline={true}
										/>
									</span>
									{errors['About the game'].message &&
										<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
											<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
												{errors["About the game"].message}
											</small>
										</div>
									}
								</GroupBox>
								<GroupBox label='Developers' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Text here...'}
											name="Developers"
											onChange={handleForm}
										/>
									</span>
									{errors.Developers.message &&
										<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
											<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
												{errors.Developers.message}
											</small>
										</div>
									}
								</GroupBox>
								<GroupBox label='Publishers' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Text here...'}
											name="Publishers"
											onChange={handleForm}
										/>
									</span>
									{errors.Publishers.message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors.Publishers.message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Website' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Text here...'}
											name="Website"
											onChange={handleForm}
										/>
									</span>
									{errors.Website.message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors.Website.message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Required Age' style={{marginBottom: '1rem'}}>
									<Frame variant={"field"} style={numInputFrame}>
										<input
											type={'number'}
											placeholder={'Number here...'}
											style={numInputStyles}
											name="Required age"
											onChange={handleForm}
											onBeforeInput={onlyAllowNumber}
										/>
									</Frame>
									{errors['Required age'].message &&
									<div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors["Required age"].message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Categories' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Comma-seperated tags here...'}
											name="Categories"
											onChange={handleForm}
										/>
									</span>
									{errors.Categories.message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors.Categories.message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Tags' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Comma-seperated tags here...'}
											name="Tags"
											onChange={handleForm}
										/>
									</span>
									{errors.Tags.message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors.Tags.message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Genres' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Comma-seperated tags here...'}
											name="Genres"
											onChange={handleForm}
										/>
									</span>
									{errors.Genres.message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors.Genres.message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='DLC Count' style={{marginBottom: '1rem'}}>
									<Frame variant={"field"} style={numInputFrame}>
										<input
											type={'number'}
											placeholder={'Number here...'}
											style={numInputStyles}
											name="DLC count"
											onChange={handleForm}
											onBeforeInput={onlyAllowNumber}
										/>
									</Frame>
									{errors['DLC count'].message &&
									<div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors["DLC count"].message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Achievements' style={{marginBottom: '1rem'}}>
									<Frame variant={"field"} style={numInputFrame}>
										<input
											type={'number'}
											placeholder={'Number here...'}
											style={numInputStyles}
											name="Achievements"
											onChange={handleForm}
											onBeforeInput={onlyAllowNumber}
										/>
									</Frame>
									{errors.Achievements.message &&
									<div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors.Achievements.message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Supported Languages' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Comma-seperated tags here...'}
											name="Supported languages"
											onChange={handleForm}
										/>
									</span>
									{errors['Supported languages'].message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors["Supported languages"].message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Full Audio Languages' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Comma-seperated tags here...'}
											name="Full audio languages"
											onChange={handleForm}
										/>
									</span>
									{errors['Full audio languages'].message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors["Full audio languages"].message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Metacritic Score' style={{marginBottom: '1rem'}}>
									<Frame variant={"field"} style={numInputFrame}>
										<input
											type={'number'}
											placeholder={'Number here...'}
											style={numInputStyles}
											name="Metacritic score"
											onChange={handleForm}
											onBeforeInput={onlyAllowNumber}
										/>
									</Frame>
									{errors['Metacritic score'].message &&
									<div style={{marginTop: '1rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors["Metacritic score"].message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Support Link' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Text here...'}
											name="Support url"
											onChange={handleForm}
										/>
									</span>
									{errors['Support url'].message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors["Support url"].message}
										</small>
									</div>
									}
								</GroupBox>
								<GroupBox label='Support Email' style={{marginBottom: '1rem'}}>
									<span style={{fontSize: '1.2rem'}}>
										<TextInput
											placeholder={'Text here...'}
											name="Support email"
											onChange={handleForm}
										/>
									</span>
									{errors['Support email'].message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors["Support email"].message}
										</small>
									</div>
									}
								</GroupBox>
								{error &&
								<div style={{display: 'flex', justifyContent:'center', marginBottom: '1rem'}}>
									<p style={{color: 'red', backgroundColor: '#666', padding: 5}}>{error}</p>
								</div>
								}
								<div style={{display: 'flex', justifyContent:'space-evenly'}}>
									<Button onClick={() => navigate(-1)}>CANCEL</Button>
									<Button onClick={submitForm}>SUBMIT</Button>
								</div>
							</Frame>
						</WindowContent>
					</Window>
				</ResponsiveWrapper>
			</div>
		);
	}

	// If there is game props, it's an edit form
	else{

		// Adding a space after each comma in categories string
		formattedCategories = game['Categories'].replaceAll(',', ', ')

		// Adding a space after each comma in tags string
		formattedTags = game['Tags'].replaceAll(',', ', ')

		// Adding a space after each comma in genres string
		formattedGenres = game['Genres'].replaceAll(',', ', ')

		formattedLanguages = game['Supported languages']
			// Removing all apostrophes from supported languages string
			.replaceAll("'", '')
			// Removing leading square bracket
			.replace('[', '')
			// Removing trailing square bracket
			.replace(']', '')

		formattedAudioLanguages = game['Full audio languages']
			.replaceAll("'", '')
			.replace('[','')
			.replace(']','')

		return (
			<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
				<ResponsiveWrapper>
					<Window style={{width: '100%'}}>
						<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
							<span style={{marginLeft: '0.2rem'}}>Edit.exe</span>
							<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
						</WindowHeader>
						<WindowContent>
							<Frame variant='inside' style={{margin: '1rem', padding: '1rem', width: '94%'}}>
								<div style={halfSizeGroupParent}>
									<GroupBox label='Game Title *' style={halfSizeGroupLeft}>
										<TextInput
											placeholder={errors.Name.message ? errors.Name.message : 'Text here...'}
											name="Name"
											onChange={handleForm}
											value={game.Name}
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
												value={game.AppID}
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
												value={game.Price}
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
												value={dateFormatted(game['Release date'])}
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
									value={game['About the game']}
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
									value={game.Developers}
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
									value={game.Publishers}
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
									value={game.Website}
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
											value={game['Required age']}
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
									defaultValue={formattedCategories}
									multiline={true}
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
									defaultValue={formattedTags}
									multiline={true}
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
									defaultValue={formattedGenres}
									multiline={true}
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
											value={game['DLC count']}
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
											value={game.Achievements}
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
									value={formattedLanguages}
									multiline={true}
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
									value={formattedAudioLanguages}
									multiline={true}
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
											value={game['Metacritic score']}
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
									value={game['Support url']}
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
									value={game['Support email']}
								/>
							</span>
								</GroupBox>
								<div style={{display: 'flex', justifyContent:'space-evenly'}}>
									<Button onClick={() => navigate(-1)}>CANCEL</Button>
									<Button onClick={submitForm}>SUBMIT</Button>
								</div>
							</Frame>
						</WindowContent>
					</Window>
				</ResponsiveWrapper>
			</div>
		);
	}
};

export default GameForm;
