export default function getConnectorPoints(from, to) {
	const dx = to.x - from.x;
	const dy = to.y - from.y;
	const radiusFrom = from.radius;
	const radiusTo = to.radius;
	const angle = Math.atan2(-dy, dx);

	return [
		from.x + -radiusFrom * Math.cos(angle + Math.PI),
		from.y + radiusFrom * Math.sin(angle + Math.PI),
		to.x + -radiusTo * Math.cos(angle),
		to.y + radiusTo * Math.sin(angle),
	];
}
