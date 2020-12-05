const drawChart = async (metric) => {
	// 1. Access Data
	const { body } = await api.fetchData();
	const dataset = (metric) =>
		body
			.map((el) => {
				return {
					date: el.date,
					value: el[metric],
				};
			})
			.slice(2);

	let avg = getSevenDayAvg(dataset(state.current));

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
		.attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

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

	const yAccessor = (d) => d.value || 0;
	const dateParser = d3.timeParse("%Y-%m-%d");
	const xAccessor = (d) => dateParser(d.date);

	// Create Scales and Axes
	const xScale = d3
		.scaleTime()
		.domain(d3.extent(dataset(metric), xAccessor))
		.range([0, dimensions.boundedWidth])
		.nice();

	let yScale = d3.scaleLinear().range([dimensions.boundedHeight, 0]);

	// @ts-ignore
	yScale.domain(d3.extent(dataset(metric), yAccessor)).nice();

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
		.y((d) => yScale(yAccessor(d)))
		.curve(d3.curveBasis);

	bounds
		.selectAll(".bar")
		.data(dataset(metric))
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", (d) => xScale(xAccessor(d)))
		.attr("width", dimensions.boundedWidth / dataset(metric).length)
		.attr("y", (d) => yScale(yAccessor(d)))
		.attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
		.style("fill", "#6EE7B7")
		.style("opacity", "0.2")
		.attr("stroke-width", "0.5")
		.attr("stroke", "#1F2937");

	bounds
		.append("path")
		.attr("class", "line-data")
		.attr("d", lineGenerator(avg))
		.attr("fill", "none")
		.attr("stroke", "#F472B6")
		.attr("stroke-width", 3);

	details.forEach((d) => {
		d3.select(`#${d.id}`)
			.node()
			.addEventListener("click", () => {
				metric = d.id;
				onClick();
			});
	});

	function onClick() {
		updateState(detailsAccessor(metric).id);
		const newTitle = detailsAccessor(metric).title.split(" ");
		title.text(`COVID-19 ${newTitle[1]} IN THE UK (${newTitle[0]})`);

		const svg = d3.select("body").transition();

		yScale.domain(d3.extent(dataset(state.current).slice(2), yAccessor)).nice();

		d3.selectAll(".bar")
			.data(dataset(metric))
			.transition()
			.duration(750)
			.attr("y", (d) => yScale(yAccessor(d)))
			.attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)));

		avg = getSevenDayAvg(dataset(state.current));
		svg.select(".line-data").duration(750).attr("d", lineGenerator(avg));

		svg.select(".y-axis").duration(750).call(yAxisGenerator);
	}
};
