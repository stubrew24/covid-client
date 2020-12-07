class App {
	active;
	buttons = [];
	events = {};

	constructor(initialMetric) {
		this.active = initialMetric.id;
		this.addMetricButtons();
		this.addEventButtons();
		this.showCaption();
	}

	addMetricButtons() {
		const btnClass = [
			"py-2",
			"focus:outline-none",
			"mt-2",
			"w-full",
			"hover:text-gray-800",
			"hover:bg-pink-300",
			"focus:text-gray-800",
			"focus:bg-pink-400",
			"daily-cases",
		];

		const metricsButtons = document.getElementById("metricsBtnGroup");

		keyMetrics.forEach((d) => {
			const newButton = document.createElement("button");
			newButton.innerText = d.label;
			newButton.id = d.id;
			newButton.classList.add(...btnClass);
			newButton.addEventListener("click", () => {
				this.active = d.id;
				chart.metric = d;
				this.setButtonState();
			});
			this.buttons.push(newButton);
			metricsButtons.appendChild(newButton);
		});
		this.setButtonState();
	}

	setButtonState() {
		this.buttons.forEach((btn) => {
			if (btn.id === this.active) {
				btn.classList.add("bg-pink-400", "text-gray-800");
			} else {
				btn.classList.remove("bg-pink-400", "text-gray-800");
			}
		});
	}

	addEventButtons() {
		const eventsButtons = document.getElementById("eventsBtnGroup");
		events.forEach((d) => {
			this.events[d.id] = false;
			const checkbox = document.createElement("div");
			checkbox.innerHTML = `<input type='checkbox' class='hidden' id='${d.id}-checkbox'><label for='lockdown-checkbox' class='cursor-pointer'> ${d.label}</label>`;
			checkbox.classList.add("py-2", "mt-2");
			checkbox.id = d.id;
			checkbox.addEventListener("click", () => {
				this.events[d.id] = !this.events[d.id];
				chart.events = { key: d.id, value: this.events[d.id] };
				if (this.events[d.id]) {
					checkbox.classList.add(d.twColor, "text-gray-800");
				} else {
					checkbox.classList.remove(d.twColor, "text-gray-800");
				}
			});
			eventsButtons.appendChild(checkbox);
		});
	}

	showCaption() {
		d3.select("fig-caption").text(
			`Data: data.gov.uk - ${dateFns.format(new Date(), "YYYY-MM-DD")}`
		);
	}
}
