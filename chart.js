class Chart {
	data;
	dimensions = {
		width: 1000,
		height: 500,
		margins: {
			top: 15,
			right: 40,
			bottom: 100,
			left: 112,
		},
	};
	svg;
	bounds;
	yAccessor;
	xAccessor;
	yScale;
	xScale;

	_metric;
	_events = {};
	_options = {
		bars: false,
		metricsButtons: true,
		eventsButtons: true,
	};

	constructor(metric, data) {
		this.data = data;
		this._metric = metric.id;
		this.title = metric.title;

		this.dimensions.boundedWidth =
			this.dimensions.width -
			this.dimensions.margins.left -
			this.dimensions.margins.right;
		this.dimensions.boundedHeight =
			this.dimensions.height -
			this.dimensions.margins.top -
			this.dimensions.margins.bottom;

		this.drawCanvas();
		this.setAccessors();
		this.renderChart();
	}

	get dataset() {
		const result = this.data.map((el) => ({
			date: el.date,
			value: el[this._metric],
		}));
		while (result[0].value === null) {
			result.shift();
		}
		return result;
	}

	get averageData() {
		return getSevenDayAvg(this.dataset);
	}

	get lineGenerator() {
		return d3
			.line()
			.x((d) => this.xScale(this.xAccessor(d)))
			.y((d) => this.yScale(this.yAccessor(d)))
			.curve(d3.curveBasis);
	}

	set title(title) {
		const titleEl = d3.select("#title");
		titleEl.text(title);
	}

	set metric(metric) {
		this._metric = metric.id;
		this.title = metric.title;
		this.createScales();
		this.updateYAxis();
		this.updateLine();
		this.updateBars();
	}

	set events({ key, value }) {
		this._events[key] = value;
		this.toggleEvents();
	}

	renderChart() {
		this.createScales();
		this.drawAxes();
		this.drawEvents();
		this.drawBars();
		this.drawLine();
		this.barsToggle();
		this.toggleEvents();
		this.toggleMetricsButtons();
	}

	drawCanvas() {
		const {
			width,
			height,
			margins,
			boundedHeight,
			boundedWidth,
		} = this.dimensions;

		this.svg = d3
			.select("#wrapper")
			.append("svg")
			.attr("viewBox", `0 0 ${width} ${height}`);
		this.bounds = this.svg
			.append("g")
			.style("transform", `translate(${margins.left}px, ${margins.top}px)`);

		this.bounds
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", boundedHeight)
			.attr("width", boundedWidth)
			.attr("fill", "#111827")
			.style("opacity", "0.5");
	}

	setAccessors() {
		const dateParser = d3.timeParse("%Y-%m-%d");
		this.yAccessor = (d) => d.value || 0;
		this.xAccessor = (d) => dateParser(d.date);
	}

	createScales() {
		this.xScale = d3
			.scaleTime()
			.range([0, this.dimensions.boundedWidth])
			.domain(d3.extent(this.dataset, this.xAccessor))
			.nice();

		this.yScale = d3
			.scaleLinear()
			.range([this.dimensions.boundedHeight, 0])
			.domain(d3.extent(this.dataset, this.yAccessor))
			.nice();
	}

	drawAxes() {
		const yAxisGenerator = d3.axisLeft(this.yScale);
		const xAxisGenerator = d3.axisBottom(this.xScale);
		this.svg
			.append("g")
			.attr("class", "y-axis text-2xl md:text-lg lg:text-xs")
			.attr(
				"transform",
				`translate(${this.dimensions.margins.left}, ${this.dimensions.margins.top})`
			)
			.call(yAxisGenerator);
		this.svg
			.append("g")
			.attr(
				"transform",
				`translate(${this.dimensions.margins.left}, ${
					this.dimensions.boundedHeight + this.dimensions.margins.top
				})`
			)
			.call(xAxisGenerator)
			.selectAll("text")
			.attr("class", "text-2xl md:text-lg lg:text-xs")
			.attr("y", 10)
			.attr("x", 10)
			.attr("dy", ".35em")
			.attr("transform", "rotate(45)")
			.style("text-anchor", "start");
	}

	drawLine() {
		// Shadow line
		const d = getForecast(3, this.averageData);
		this.bounds
			.append("path")
			.attr("class", "line-stroke")
			.attr("d", this.lineGenerator(d))
			.attr("fill", "none")
			.attr("stroke", "#1A212E")
			.attr("stroke-width", 5);

		// Main line
		this.bounds
			.append("path")
			.attr("class", "line-data")
			.attr("d", this.lineGenerator(d))
			.attr("fill", "none")
			.attr("stroke", "#F472B6")
			.attr("stroke-width", 3);
	}

	drawBars() {
		this.bounds
			.selectAll(".bar")
			.data(this.dataset)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d) => this.xScale(this.xAccessor(d)))
			.attr("width", this.dimensions.boundedWidth / this.dataset.length)
			.attr("y", (d) => this.yScale(this.yAccessor(d)))
			.attr(
				"height",
				(d) => this.dimensions.boundedHeight - this.yScale(this.yAccessor(d))
			)
			.style("fill", "#6EE7B7")
			.attr("stroke-width", "0.5")
			.attr("stroke", "#1F2937")
			.style("opacity", "0");
	}

	updateBars() {
		d3.selectAll(".bar")
			.data(this.dataset)
			.transition()
			.duration(750)
			.attr("y", (d) => this.yScale(this.yAccessor(d)))
			.attr(
				"height",
				(d) => this.dimensions.boundedHeight - this.yScale(this.yAccessor(d))
			)
			.attr("x", (d) => this.xScale(this.xAccessor(d)))
			.attr("width", this.dimensions.boundedWidth / this.dataset.length);
	}

	updateYAxis() {
		const svg = d3.select("body").transition();
		const yAxisGenerator = d3.axisLeft(this.yScale);
		svg.select(".y-axis").duration(750).call(yAxisGenerator);
	}

	updateLine() {
		const svg = d3.select("body").transition();
		const d = getForecast(3, this.averageData);
		svg.select(".line-stroke").duration(750).attr("d", this.lineGenerator(d));
		svg.select(".line-data").duration(750).attr("d", this.lineGenerator(d));
	}

	drawEvents() {
		events.forEach(({ start, end, hexColor, id }) => {
			const eventStart = this.xScale(new Date(start));
			const startEnd = this.xScale(new Date(end));

			this.bounds
				.append("rect")
				.attr("x", eventStart)
				.attr("y", 0)
				.attr("height", this.dimensions.boundedHeight)
				.attr("width", startEnd - eventStart)
				.attr("fill", hexColor)
				.style("opacity", "0")
				.attr("class", `${id}-highlight`);
		});
	}

	toggleEvents() {
		Object.keys(this._events).forEach((id) => {
			const event = this._events[id];
			d3.selectAll(`.${id}-highlight`)
				.transition()
				.duration(150)
				.style("opacity", () => (event ? "1" : "0"));
		});
	}

	barsToggle() {
		d3.select("#toggleBars")
			.node()
			.addEventListener("click", (e) => {
				this._options.bars = e.target.checked;
				const bars = d3.selectAll(".bar");

				if (this._options.bars) {
					bars.style("opacity", "0.4");
				} else {
					bars.style("opacity", "0");
				}
			});
	}

	toggleMetricsButtons() {
		for (const group of ["metrics", "events"]) {
			d3.select(`#${group}-title`)
				.node()
				.addEventListener("click", () => {
					this._options[`${group}Buttons`] = !this._options[`${group}Buttons`];
					const btn = d3.select(`#${group}BtnGroup`).node();
					if (this._options[`${group}Buttons`]) {
						btn.classList.add("hidden");
						btn.classList.remove("md:block");
					} else {
						btn.classList.remove("hidden");
					}
				});
		}
	}
}
