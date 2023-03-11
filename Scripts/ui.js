export default class Ui {
	elems = { container: document.getElementById("dataContainer") }

	mapTo(eventList) {
		eventList.forEach(async (event) => {
			const temp = await this.#renderEvent(event.name, event.date, event.type)
			this.elems.container.append(temp)
		})
	}
	async #renderEvent(name, date, type) {
		const { main } = await import("./main.js")

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
