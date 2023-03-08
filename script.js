import dummyData from "./dummyData.js"

export default class main {
	data = undefined

	constructor() {
		// load data on first load
		this.data = this.initialLoad()
	}

	initialLoad() {
		// // uncomment this part in presence of back-end
		// const response = await fetch("api endpoint")
		// const result = await response.json()
		// const body = result.isOk ? result.json() : alert("error on loading initial data" );

		const body = dummyData.events // delete this line in presence of back-end

		return body
	}
}
new main()
