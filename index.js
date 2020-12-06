const state = {
	current: "newCasesByPublishDate",
	events: {},
};

const api = new API(base, areaType, structure, format);

const btnClass = [
	"py-2",
	"focus:outline-none",
	"mt-2",
	"w-full",
	"hover:text-green-500",
	"focus:text-pink-400",
	"daily-cases",
];

const metricsButtons = document.getElementById("metricsBtnGroup");
const eventsButtons = document.getElementById("eventsBtnGroup");

keyMetrics.forEach((d) => {
	const newButton = document.createElement("button");
	newButton.innerText = d.label;
	newButton.id = d.id;
	newButton.classList.add(...btnClass);
	metricsButtons.appendChild(newButton);
});

events.forEach((d) => {
	const checkbox = document.createElement("div");
	checkbox.innerHTML = `<input type='checkbox' class='hidden' id='${d.id}-checkbox'><label for='lockdown-checkbox' class='cursor-pointer'> ${d.label}</label>`;
	checkbox.classList.add("py-2", "mt-2");
	checkbox.id = d.id;
	eventsButtons.appendChild(checkbox);
});

const initial = keyMetrics[0].id;
updateState(initial);
drawChart(initial);

// todo: Add 7day average prediction - get 7 days averages of averages?
// todo: Add event markers: eat out to help etc....
// todo: Fix mobile layout jumping (refactor menu?)
// todo: Chart tooltips
// todo: Change location - national, regional etc...
// todo: Check performance of bar chart - grouping?
// todo: Fix shadow line - abstract line drawing
