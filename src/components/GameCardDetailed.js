import { Frame } from 'react95';


const GameCard = (props) => {

	let screenshots = props.game['Screenshots']
	let screenshots_array = screenshots.split(',')
	// console.log(screenshots_array)

	return (
		<Frame
			variant='outside'
			shadow
			style={{ padding: '0.5rem', lineHeight: '1.5', width: 600 }}
		>
			<h1 style={{fontSize: '32px', padding: '1rem'}}>{props.game.Name}</h1>
			<Frame variant='inside' style={{ margin: '1rem', padding: '1rem', width: '94%'}}>
				<img src={props.game['Header image']} alt='Game header' width='100%'/>
			</Frame>
			<Frame variant='inside' style={{ margin: '1rem', padding: '1rem' }}>
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>Title:</b> {props.game.Name}
				</Frame>
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>Release date:</b> {props.game['Release date']}
				</Frame>
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>Estimated owners:</b> {props.game['Estimated owners']}
				</Frame>
				{ props.game['Required age'] ? (
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>Required age:</b> {props.game['Required age']}
				</Frame>
				) : (
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>Required age:</b> Unknown
				</Frame>
				)}
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>Price:</b> {props.game['Price']}
				</Frame>
				{ props.game['DLC count'] ? (
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>DLC count:</b> {props.game['DLC count']}
				</Frame>
				) : (
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>DLC count:</b> None
				</Frame>
				)}
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>About the game:</b> {props.game['About the game']}
				</Frame>
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>Supported languages:</b> {props.game['Supported languages']}
				</Frame>
				<Frame
					variant='field'
					style={{
						marginTop: '1rem',
						padding: '1rem',
						width: '100%'
					}}
				>
					<b>Screenshots:</b>
					{ screenshots_array.map((screenshot, i) => {
						return <img src={screenshot} alt='Game screenshots' width='100%'/>
					})
				}
				</Frame>
			</Frame>
		</Frame>
	);
};

export default GameCard;
