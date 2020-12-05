const updateState = (id) => {
	state.current = id;

	details.forEach((d) => {
		if (id === d.id) {
			document
				.getElementById(d.id)
				.classList.add("text-pink-400", "font-semibold");
		} else {
			document
				.getElementById(d.id)
				.classList.remove("text-pink-400", "font-semibold");
		}
	});
};

const getAvg = (arr) => {
	return arr.reduce((acc, cur) => acc + cur.value, 0) / arr.length;
};

const getSevenDayAvg = (dataset) => {
	let result = [];
	dataset.forEach((el, i) => {
		const start = i - 3 >= 0 ? i - 3 : 0;
		const end = i + 3 <= dataset.length - 1 ? i + 3 : dataset.length - 1;
		result.push({
			date: el.date,
			value: getAvg(dataset.slice(start, end + 1)).toFixed(2),
		});
	});
	return result;
};
