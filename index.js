const state = {
	current: "newCasesByPublishDate",
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

const buttonsEl = document.getElementById("buttons");

details.forEach((d) => {
	const newButton = document.createElement("button");
	newButton.innerText = d.title;
	newButton.id = d.id;
	newButton.classList.add(...btnClass);
	buttonsEl.appendChild(newButton);
});

const initial = details[0].id;
updateState(initial);
drawChart(initial);
