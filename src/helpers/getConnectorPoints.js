export default function getConnectorPoints(
	from,
	to,
	isMulti = false,
	second = false
) {
	const delta = second ? 7 : -7;
	const fromX = isMulti ? from.x - delta : from.x;
	const fromY = isMulti ? from.y - delta : from.y;
	const toX = isMulti ? to.x - delta : to.x;
	const toY = isMulti ? to.y - delta : to.y;
	const dx = toX - fromX;
	const dy = toY - fromY;
	const radiusFrom = from.radius;
	const radiusTo = to.radius;
	const angle = Math.atan2(-dy, dx);

	return [
		fromX + -radiusFrom * Math.cos(angle + Math.PI),
		fromY + radiusFrom * Math.sin(angle + Math.PI),
		toX + -radiusTo * Math.cos(angle),
		toY + radiusTo * Math.sin(angle),
	];
}
