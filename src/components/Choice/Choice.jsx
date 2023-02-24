import styles from './Choice.module.css';

function Choice({ choices, upper = false }) {
	return (
		<div
			className={upper ? styles.choiceContainerUpper : styles.choiceContainer}
		>
			{choices.map((choice, idx) => {
				return (
					<div
						key={idx}
						className={styles.choice}
						onClick={() => choice.func()}
					>
						{choice.text}
					</div>
				);
			})}
		</div>
	);
}

export default Choice;
