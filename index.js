const fetchData = async () => {
	const base = "https://api.coronavirus.data.gov.uk/v2/data?";
	const areaType = "overview";
	const structure = ["newCasesByPublishDate", "cumCasesByPublishDate"];
	const format = "json";

	const url = `${base}areaType=${areaType}&metric=${structure.join(
		"&metric="
	)}&format=${format}`;
	const res = await fetch(url);
	return await res.json();
};

const drawChart = async () => {
	// 1. Access Data
	const { body } = await fetchData();
	const dataset = (metric) =>
		body.map((el) => {
			return {
				date: el.date,
				value: el[metric],
			};
		});

	// 2. Create Chart Dimensions
	const dimensions = {
		width: 1000,
		height: 500,
		margins: {
			top: 15,
			right: 15,
			bottom: 40,
			left: 60,
		},
		boundedWidth: 0,
		boundedHeight: 0,
	};

	dimensions.boundedWidth =
		dimensions.width - dimensions.margins.left - dimensions.margins.right;
	dimensions.boundedHeight =
		dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

	// 3. Draw Canvas
	const svg = d3
		.select("#wrapper")
		.append("svg")
		.attr("width", dimensions.width)
		.attr("height", dimensions.height);

	const bounds = svg
		.append("g")
		.style(
			"transform",
			`translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`
		);

	const title = d3.select("#title");
	title.text("Covid-19 Cases in the UK (Daily)");
	const caption = d3.select("fig-caption");
	caption.text(
		`Data: data.gov.uk - ${dateFns.format(new Date(), "YYYY-MM-DD")}`
	);

	bounds.append("g").attr("class", "line");
	// Set data accessors

	const yAccessor = (d) => d.value;
	const dateParser = d3.timeParse("%Y-%m-%d");
	const xAccessor = (d) => dateParser(d.date);

	// Create Scales and Axes
	const xScale = d3
		.scaleTime()
		.domain(d3.extent(dataset("newCasesByPublishDate"), xAccessor))
		.range([0, dimensions.boundedWidth])
		.nice();

	let yScale = d3.scaleLinear().range([dimensions.boundedHeight, 0]).nice();

	yScale.domain(d3.extent(dataset("newCasesByPublishDate"), yAccessor));

	let yAxisGenerator = d3.axisLeft(yScale);

	let yAxis = svg
		.append("g")
		.attr("class", "y-axis")
		.attr(
			"transform",
			`translate(${dimensions.margins.left}, ${dimensions.margins.top})`
		)
		.call(yAxisGenerator);

	const XAxisGenerator = d3.axisBottom(xScale);
	const xAxis = svg
		.append("g")
		.attr(
			"transform",
			`translate(${dimensions.margins.left}, ${
				dimensions.boundedHeight + dimensions.margins.top
			})`
		)
		.call(XAxisGenerator);

	const lineGenerator = d3
		.line()
		.x((d) => xScale(xAccessor(d)))
		.y((d) => yScale(yAccessor(d)));

	bounds
		.append("path")
		.attr("class", "line-data")
		.attr("d", lineGenerator(dataset("newCasesByPublishDate")))
		.attr("fill", "none")
		.attr("stroke", "#E259A4")
		.attr("stroke-width", 3);

	const dailyButton = d3.select(".daily-btn");
	const cumulativeButton = d3.select(".cumulative-btn");

	let metric = 0;

	const details = [
		{
			id: "newCasesByPublishDate",
			title: "Covid-19 Cases in the UK (Daily)",
		},
		{
			id: "cumCasesByPublishDate",
			title: "Covid-19 Cases in the UK (Cumulative)",
		},
	];

	dailyButton.node().addEventListener("click", () => {
		metric = 0;
		onClick();
	});
	cumulativeButton.node().addEventListener("click", () => {
		metric = 1;
		onClick();
	});

	function onClick() {
		title.text(details[metric].title);

		const svg = d3.select("body").transition();
		yScale.domain(d3.extent(dataset(details[metric].id), yAccessor));
		svg
			.select(".line-data") // change the line
			.duration(750)
			.attr("d", lineGenerator(dataset(details[metric].id)));

		svg
			.select(".y-axis") // change the y axis
			.duration(750)
			.call(yAxisGenerator);
	}
};

drawChart("newCasesByPublishDate");
