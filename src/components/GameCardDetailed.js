import {Button, Frame, GroupBox, Window, WindowContent, WindowHeader} from 'react95';


const GameCard = (props) => {

	// Initialising screenshots string array
	let screenshots = props.game['Screenshots']
	// Splitting screenshots by comma (making a proper array)
	let screenshots_array = screenshots.split(',')
	// console.log(screenshots_array)

	// Converting ISO date string to locale date string
	let date = new Date(props.game['Release date']).toLocaleDateString()

	let languages = props.game['Supported languages']
	// Remove all apostrophes
	let formattedLanguages = languages.replace(/'/g, '')
	// Remove the leading square bracket
	formattedLanguages = formattedLanguages.replace('[', '')
	// Remove the trailing square bracket
	formattedLanguages = formattedLanguages.replace(']', '')
	// Add a space to the beginning of the string
	formattedLanguages = " "+formattedLanguages
	// console.log(formattedLanguages)

	return (
		<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
			<Window style={{width: "600px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>{props.game.Name}.exe</span>
					<Button style={{marginTop: '0.2rem'}}>X</Button>
				</WindowHeader>
				<WindowContent>
					<Frame variant='inside' style={{ margin: '1rem', padding: '1rem', width: '94%'}}>
						<img src={props.game['Header image']} alt='Game header' width='100%'/>
					</Frame>
					<Frame variant='inside' style={{ margin: '1rem', padding: '1rem' }}>
						<GroupBox label='Release date' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								{date}
							</span>
						</GroupBox>
						<GroupBox label='Estimated owners:' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								{props.game['Estimated owners']}
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
						<GroupBox label='Price' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								{props.game['Price']}
							</span>
						</GroupBox>
						{ props.game['DLC Count'] ? (
							<GroupBox label='Price' style={{marginBottom: '1rem'}}>
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
						<GroupBox label='About The Game' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1rem'}}>
								{props.game['About the game']}
							</span>
						</GroupBox>
						<GroupBox label='Supported Languages' style={{marginBottom: '1rem'}}>
							<span style={{fontSize: '1.2rem'}}>
								{formattedLanguages}
							</span>
						</GroupBox>
						<GroupBox label='Screenshots' style={{marginBottom: '1rem'}}>
							{screenshots_array.map((screenshot, i) => {
								return <img src={screenshot} alt='Game screenshots' width='100%'/>
							})
						}
						</GroupBox>
					</Frame>
				</WindowContent>
			</Window>
		</div>
	);
};

export default GameCard;
