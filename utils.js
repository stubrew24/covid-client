const updateState = (id) => {
	state.current = id;

	keyMetrics.forEach((d) => {
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
			value: +getAvg(dataset.slice(start, end + 1)).toFixed(),
		});
	});
	return result;
};

const getForecast = (days, dataset) => {
	let result = [...dataset];
	for (let i = 0; i < days; i++) {
		const nextGroup = getSevenDayAvg(result.slice(0, 7));
		const difs = nextGroup.map((el, i) => ({
			value: el.value - nextGroup[i + 1]?.value || null,
		}));
		const next = getAvg(difs);
		const rawDate = dateFns.addDays(new Date(result[0].date), 1);
		const date = dateFns.format(rawDate, "YYYY-MM-DD");
		result = [{ date, value: +result[0].value + next }, ...result];
	}
	return result;
};
