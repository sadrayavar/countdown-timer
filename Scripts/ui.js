export default class Ui {
	elements = {
		eventContainer: document.getElementById("eventContainer"),
		foreground: document.getElementsByTagName("foreground")[0],
		modal: document.getElementsByTagName("modal")[0],
	}

	constructor() {
		const keys = ["login", "signup", "addEvent", "logout", "addEventTest"]

		keys.forEach((key) => {
			document.getElementById(key).onclick = this.#eventListener
		})
	}

	async #eventListener(event) {
		// get target element
		const targetElement = event.target

		// get name of the event listener function
		const functionName = targetElement.id

		// run event listener function
		const { main } = await import("./main.js")
		main[functionName](targetElement)
	}
	mapEvents(elementList, container) {
		elementList.forEach(async (event) => {
			const elem = await this.#renderEvent(event.name, event.date, event.type)
			container.append(elem)
		})
	}
	async #renderEvent(name, date, type) {
		const { main } = await import("./main.js")

		// create element
		const event = document.createElement("div")
		event.id = name
		event.className += "event bordered-container"

		// set given data
		for (let i = 0; i < 3; i++) {
			const element = document.createElement("div")

			switch (i) {
				case 0:
					element.innerHTML = name
					element.classList.add(Object.keys({ name })[0])
					break

				case 1:
					element.innerHTML = date
					element.classList.add(Object.keys({ date })[0])
					break

				case 2:
					element.innerHTML = type
					element.classList.add(Object.keys({ type })[0])
					break
			}

			event.append(element)
		}

		// set buttons
		for (let i = 0; i < 2; i++) {
			const text = i ? "remove" : "edit"

			const button = document.createElement("button")
			button.innerHTML = text

			button.classList.add(text)

			// add event listeners
			button.setAttribute("eventListener", text + "Event")
			button.onclick = this.#eventListener
			event.append(button)
		}

		event.style.opacity = "0"
		setTimeout(() => (event.style.opacity = "100%"), 10)
		return event
	}

	setModalStyles(bgColor, mouse, bottom) {
		this.elements.foreground.style.backgroundColor = bgColor
		this.elements.foreground.style.pointerEvents = mouse

		this.elements.modal.style.bottom = bottom
	}
	openModal(element) {
		this.elements.modal.appendChild(element)

		this.setModalStyles("rgb(0, 0, 0, 0.9)", "all", "50%")
	}
	closeModal(extractData) {
		this.setModalStyles("rgb(0, 0, 0, 0)", "none", "-25%")

		extractData()

		setTimeout(() => (this.elements.modal.innerHTML = ""), 300)
	}
}
