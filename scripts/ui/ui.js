/**
 * Manage ui elements like adding or removing it
 */
export default class Ui {
	constructor() {
		// add form search
		const form = document.getElementsByTagName("form")[0]
		form.append(this.formSearch())

		// add event listeners
		this.#addEventListeners()
		this.#setSelectOptionSize()
	}

	// ############################################### methods

	#setSelectOptionSize() {
		for (const element of document.getElementsByClassName("hasEvent")) {
			for (const child of element.children) {
				if (child.tagName === "SELECT") {
					child.style.width = `${75}px`
					console.log()
				}
			}
		}
	}

	async #addEventListeners() {
		const module = await import("./eventListeners.js")
		const EventListeners = module.default

		for (const element of document.getElementsByClassName("hasEvent")) {
			const attribute = element.getAttribute("eventListenerName")
			if (typeof attribute !== "string") continue
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
		const p = this.createElement({ name: "p", values: ["Search"] })

		// select
		const selectDiv = this.#select([{ value: "Name", active: true }, { value: "Description" }])

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
			values: [p, selectDiv, inputGroup],
			attributes: { id: "formSearch" },
			classList: ["rowFlex", "radius", "primary", "baseline"],
		})

		return main
	}

	/**
	 * @param {Array} listOfOptions list of objects that represent options and they default state like [{value:'a',default:false},{value:'b',default:true},{value:'c',default:false}]
	 * @returns HTML tag
	 */
	#select(listOfOptions) {
		const select = this.createElement({
			name: "select",
			values: listOfOptions.map((options) =>
				this.createElement({
					name: "option",
					values: [options.value],
					attributes: options.active === true ? { selected: "" } : {},
				})
			),
			attributes: {
				id: "2",
				title: "Where to search from",
			},
		})
		const selectP = this.createElement({ name: "p", classList: ["widthLeverage"] })

		const selectDiv = this.createElement({
			name: "div",
			values: [select, selectP],
			classList: ["columnFlex", "hasEvent"],
			attributes: {
				eventListenerName: "change_select",
			},
		})

		return selectDiv
	}

	#input(placeHolder) {
		return inputGroup
	}
}
