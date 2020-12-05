class API {
	base;
	areaType;
	structure;
	format;

	constructor(base, areaType, structure, format) {
		this.base = base;
		this.areaType = areaType;
		this.structure = structure;
		this.format = format;
	}

	get url() {
		return (
			this.base +
			"areaType=" +
			this.areaType +
			"&metric=" +
			this.structure.join("&metric=") +
			"&format=" +
			this.format
		);
	}

	async fetchData() {
		const res = await fetch(this.url);
		return await res.json();
	}
}
