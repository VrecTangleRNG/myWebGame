export function yoyo(f) {
	return t => {
		if (t < 0.5) {
			return f(2 * t);
		}
		else {
			return 1 - f(2 * (t - 0.5));
		}
	}
}
