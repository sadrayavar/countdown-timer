import dummyData from "./dummyData.js"

export default class main {
	data = undefined
	container = document.getElementById("dataContainer")

	constructor() {
		// load data on first load
		this.data = this.initialLoad()

		// map data to ui
		this.mapToUi(this.data, this.container)
	}

	initialLoad() {
		// // uncomment this part in presence of back-end
		// const response = await fetch("api endpoint")
		// const result = await response.json()
		// const body = result.isOk ? result.json() : alert("error on loading initial data" );

		const body = dummyData.events // delete this line in presence of back-end

		return body
	}
	mapToUi(eventList, eventContainer) {
		eventList.forEach((event) => {
			eventContainer.append(this.renderEvent(event.name, event.date, event.type))
		})
	}
	renderEvent(name, date, type) {
		const container = document.createElement("div")

		;[name, date, type].forEach((data) => {
			const element = document.createElement("div")
			element.innerHTML = data
			container.append(data)
			container.append(document.createElement("br"))
		})
		container.append(document.createElement("br"))

		return container
	}
}
new main()
