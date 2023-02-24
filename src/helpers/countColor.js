export default function countColor(color, diff) {
	return (
		'#' + Math.abs(parseInt(color.substring(1), 16) - diff).toString(16)
	).substring(0, 7);
}
