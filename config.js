const details = [
	{
		id: "newCasesByPublishDate",
		title: "Daily Cases",
	},
	{
		id: "cumCasesByPublishDate",
		title: "Cumulative Cases",
	},
	{
		id: "newDeaths28DaysByDeathDate",
		title: "Daily Deaths",
	},
	{
		id: "cumDeaths28DaysByDeathDate",
		title: "Cumulative Deaths",
	},
	{
		id: "newAdmissions",
		title: "Daily Admissions",
	},
];

const detailsAccessor = (id) => {
	return details.find((el) => el.id === id);
};

const base = "https://api.coronavirus.data.gov.uk/v2/data?";
const areaType = "overview";
const structure = details.map((d) => d.id);
const format = "json";
