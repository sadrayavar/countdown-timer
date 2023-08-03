import EventListeners from "./eventListeners.js"

/**
 * Manage ui elements like adding or removing it
 */
export default class Ui {
	// ############################################### methods
	async addEventListener(params = { id, all: false }) {
		const { id, all } = params
		const eventListeners = (await import("./eventListeners.js")).default

		let elemList
		if (all === true) {
			elemList = document.getElementsByClassName("hasEvent")
		} else {
			for (const child of document.getElementById(id).children) {
				if (child.getAttribute("eventListenerName") !== null) {
					elemList = [child]
				}
			}
		}

		for (const element of elemList) {
			const attribute = element.getAttribute("eventListenerName")
			const [eventName, methodName] = attribute.split("_")
			element.addEventListener(eventName, new EventListeners()[methodName])
		}
	}

	createElement(params = { name, values: [], classList: [], attributes: {} }) {
		const { name, values, classList, attributes } = params

		// create element
		const element = document.createElement(name)

		// add value
		values !== undefined &&
			values.forEach((value) => {
				element.append(value)
			})

		// set className
		classList !== undefined &&
			classList.forEach((className) => {
				element.className += ` ${className}`
			})

		// add attributes
		attributes !== undefined &&
			Object.entries(attributes).forEach((pair) => {
				element.setAttribute(pair[0], pair[1])
			})

		return element
	}

	// ############################################### elements
	formSearch() {
		// p
		const search = this.createElement({ name: "p", values: ["Search"] })

		// select
		const selectGroup = this.#select(
			[{ value: "Name", active: true }, { value: "Description" }],
			"Where to search from",
			75
		)

		// input
		const input = this.createElement({
			name: "input",
			attributes: {
				placeholder: "Type here...",
			},
		})
		const inputWidthHandle = this.createElement({ name: "p", classList: ["widthLeverage"] })
		const inputGroup = this.createElement({
			name: "div",
			values: [input, inputWidthHandle],
			classList: ["hasEvent"],
			attributes: { eventListenerName: "input_input" },
		})
		inputGroup.style.width = "110px"

		// main
		const main = this.createElement({
			name: "div",
			values: [search, selectGroup, inputGroup],
			attributes: { id: "formSearch" },
			classList: ["rowFlex", "radius", "primary", "baseline"],
		})

		return main
	}
	formEventType() {
		// p
		const p = this.createElement({ name: "p", values: ["Event Type:"] })

		// select
		const selectGroup = this.#select(
			[{ value: "All", active: true }, { value: "Alarm" }, { value: "Clock" }],
			"Event type to search from",
			45
		)

		// main
		const main = this.createElement({
			name: "div",
			values: [p, selectGroup],
			attributes: { id: "formEventType" },
			classList: ["rowFlex", "radius", "primary"],
		})
		main.style.opacity = "0"

		return main
	}

	/**
	 * @param {Array} listOfOptions list of objects that represent options and they default state like [{value:'a',default:false},{value:'b',default:true},{value:'c',default:false}]
	 * @returns HTML tag
	 */
	#select(listOfOptions, title, size) {
		const select = this.createElement({
			name: "select",
			values: listOfOptions.map((options) =>
				this.createElement({
					name: "option",
					values: [options.value],
					attributes: options.active === true ? { selected: "" } : {},
				})
			),
			attributes: { title },
		})
		select.style.width = `${size}px`

		const leverage = this.createElement({ name: "p", classList: ["widthLeverage"] })

		const group = this.createElement({
			name: "div",
			values: [select, leverage],
			classList: ["columnFlex", "hasEvent"],
			attributes: {
				eventListenerName: "change_select",
			},
		})

		return group
	}
}
