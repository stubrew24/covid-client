const api = new API(base, areaType, structure, format);

const initialMetric = keyMetrics[0];
const app = new App(initialMetric);
let chart;

(async function () {
	const { body: dataset } = await api.fetchData();
	chart = new Chart(initialMetric, dataset);
})();

// todo: Fix mobile layout jumping (refactor menu?)
// todo: Chart tooltips
// todo: Change location - national, regional etc...
// todo: Check performance of bar chart - grouping?
// todo: Fix bars on top
