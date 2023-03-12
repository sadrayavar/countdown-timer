export default class Ui {
	elements = { eventContainer: document.getElementById("dataContainer") }

	constructor() {
		;["login", "signup", "log", "addEvent"].forEach(
			(key) => (document.getElementById(key).onclick = this.#eventListener)
		)
	}

	async #eventListener(event) {
		// get target element
		const targetElement = event.target

		// get name of the event listener function
		const functionName = targetElement.getAttribute("eventListener")

		// run event listener function
		const { main } = await import("./main.js")
		main[functionName](targetElement)
	}
	mapEvents(elementList, container) {
		elementList.forEach(async (event) => {
			const temp = await this.#renderEvent(event.name, event.date, event.type)
			container.append(temp)
		})
	}
	async #renderEvent(name, date, type) {
		const { main } = await import("./main.js")

		// create element
		const container = document.createElement("div")
		container.id = name

		// set given data
		;[name, date, type].forEach((data) => {
			const element = document.createElement("div")
			container.classList.add(Object.keys({ name })[0])
			element.innerHTML = data

			container.append(element)
		})

		// set buttons
		;["edit", "remove"].forEach((entry) => {
			const button = document.createElement("button")
			button.innerHTML = entry

			// add event listeners
			button.setAttribute("eventListener", entry + "Event")
			button.onclick = this.#eventListener

			container.append(button)
		})

		// add white spaces (will be deleted after stylizing)
		container.append(document.createElement("br"))
		container.append(document.createElement("br"))

		return container
	}
}
