import { main } from "./main"

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
		container.id = name
		;[name, date, type].forEach((data) => {
			const element = document.createElement("div")
			element.innerHTML = data
			container.append(element)
		})
		;["edit", "remove"].forEach((entry) => {
			const element = document.createElement("button")
			element.innerHTML = entry

			if (entry == "edit") element.onclick = main.editEvent
			else element.onclick = main.removeEvent

			container.append(element)
		})
		container.append(document.createElement("br"))
		container.append(document.createElement("br"))

		return container
	}
}
