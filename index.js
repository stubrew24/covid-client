const api = new API(base, areaType, structure, format);

const initialMetric = keyMetrics[0];
const app = new App(initialMetric);
let chart;

(async function () {
	const { body: dataset } = await api.fetchData();
	chart = new Chart(initialMetric, dataset);
})();

// todo: Select location - national, regional etc...
