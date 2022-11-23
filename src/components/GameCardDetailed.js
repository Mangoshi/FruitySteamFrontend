const GameCard = (props) => {
	return (

		<div>
			<p><b>Title:</b> {props.game.Name} </p>
			<hr/>
			<p><b>Release date:</b> {props.game['Release date']} </p>
			<hr/>
			<p><b>Estimated owners:</b> {props.game['Estimated owners']} </p>
			<hr/>
			{ props.game['Required age'] ? (
				<p><b>Required age:</b> {props.game['Required age']} </p>
			) : (
				<p><b>Required age:</b> Unknown </p>
			)}
			<hr/>
			<p><b>Price:</b> {props.game['Price']} </p>
			<hr/>
			{ props.game['DLC count'] ? (
				<p><b>DLC count:</b> {props.game['DLC count']} </p>
			) : (
				<p><b>DLC count:</b> None </p>
			)}
			<hr/>
			<p><b>About the game:</b> {props.game['About the game']} </p>
			<hr/>
			<p><b>Supported languages:</b> {props.game['Supported languages']} </p>
			<hr/>
		</div>
	);
};

export default GameCard;
