export default class Ui {
	elems = { container: document.getElementById("dataContainer") }

	mapTo(eventList) {
		eventList.forEach((event) => {
			const temp = this.renderEvent(event.name, event.date, event.type)
			this.elems.container.append(temp)
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
