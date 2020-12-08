const keyMetrics = [
	{
		id: "newCasesByPublishDate",
		label: "Daily Cases",
		title: "Newly reported cases by day",
	},
	{
		id: "cumCasesByPublishDate",
		label: "Cumulative Cases",
		title: "Total reported cases",
	},
	{
		id: "newDeaths28DaysByDeathDate",
		label: "Daily Deaths",
		title: "Newly reported deaths by day",
	},
	{
		id: "cumDeaths28DaysByDeathDate",
		label: "Cumulative Deaths",
		title: "Total reported deaths",
	},
	{
		id: "newAdmissions",
		label: "Hospital Admissions",
		title: "New hospital admissions by day",
	},
];

const keyMetricsAccessor = (id) => {
	return keyMetrics.find((el) => el.id === id);
};

const events = [
	{
		id: "firstCaseConfirmed",
		label: "First Confirmed Case",
		hexColor: "#A78BFA",
		twColor: "bg-purple-400",
		start: "2020-01-31",
		end: "2020-02-01",
	},
	{
		id: "firstNationalLockdown",
		label: "First National Lockdown",
		hexColor: "#F87171",
		twColor: "bg-red-400",
		start: "2020-03-26",
		end: "2020-07-04",
	},
	{
		id: "eatOutToHelpOut",
		label: "Eat Out To Help Out",
		hexColor: "#34D399",
		twColor: "bg-green-400",
		start: "2020-08-03",
		end: "2020-08-31",
	},
	{
		id: "secondNationalLockdown",
		label: "Second National Lockdown",
		hexColor: "#FBBF24",
		twColor: "bg-yellow-400",
		start: "2020-11-05",
		end: "2020-12-04",
	},
	{
		id: "firstVaccineJab",
		label: "First Vaccine Jab",
		hexColor: "#60A5FA",
		twColor: "bg-blue-400",
		start: "2020-12-08",
		end: "2020-12-09",
	},
];

const eventsAccessor = (id) => {
	return events.find((el) => el.id === id);
};

const base = "https://api.coronavirus.data.gov.uk/v2/data?";
const areaType = "overview";
const structure = keyMetrics.map((d) => d.id);
const format = "json";
