import {Anchor, Button, Frame, GroupBox, Window, WindowContent, WindowHeader} from 'react95';
import {Link} from "react-router-dom";
import Carousel from "nuka-carousel";
import ReactPlayer from 'react-player'
import ResponsiveWrapper from "./ResponsiveWrapper";

const GameCardDetailed = (props) => {

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

	// TODO: Add ALL game data!
	return (
		<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
			<ResponsiveWrapper>
				<Window style={{width: '100%'}}>
					<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
						<span style={{marginLeft: '0.2rem'}}>{props.game.Name}.exe</span>
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
							padding: '1rem',
							width: '94%'
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
};

export default GameCardDetailed;
