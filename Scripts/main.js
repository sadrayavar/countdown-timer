import FakeBackEnd from "./fakeBackEnd.js"
import Ui from "./ui.js"

export default class Main {
	ui = new Ui()
	api = new FakeBackEnd()
	timeEdge = 1000 * 5

	constructor() {
		let data = []

		if (this.#alive()) {
			// start to refresh the token
			this.refresh(localStorage.getItem("token"), localStorage.getItem("refreshToken"))

			// load data from backend
			data = this.getData(localStorage.getItem("token"))
		} else {
			const temp = localStorage.getItem(this.api.databaseKey)
			localStorage.clear()
			localStorage.setItem("lastLog", null)
			localStorage.setItem(this.api.databaseKey, temp)
		}

		// map data to ui
		this.ui.mapEvents(data, this.ui.elements.eventContainer)
	}

	#alive() {
		// check if its authenticated
		const lastLog = Number(localStorage.getItem("lastLog"))

		if (isNaN(lastLog)) return false

		const now = new Date().getTime()
		const pastTime = now - lastLog
		return pastTime < this.api.tokenLife - this.timeEdge
	}

	signup(target) {
		// get username and password that are in input field
		let { username, password } = target.parentElement.children
		username = username.value
		password = password.value

		const res = this.api.signup(username, password)

		if (res.isOk) this.login(target, JSON.parse(res.body))
		else alert(res.error)
	}
	login(target, credentials = undefined) {
		// get username and password that are in input field
		let { username, password } = target.parentElement.children
		username = username.value
		password = password.value

		if (credentials != undefined) {
			username = credentials.username
			password = credentials.password
		}

		const res = this.api.login(username, password)

		if (res.isOk) {
			// save username
			const { username, token, refreshToken } = JSON.parse(res.body)
			localStorage.setItem("username", username)

			// start to refresh the token
			this.refresh(token, refreshToken)

			// get data from back after login
			const data = this.getData(localStorage.getItem("token"))

			// map data to ui
			const eventContainer = this.ui.elements.eventContainer
			eventContainer.innerHTML = ""
			this.ui.mapEvents(data, eventContainer)
		} else alert(res.error)
	}
	logout() {
		// delete database
		localStorage.setItem("lastLog", null)

		// refresh page
		location.reload()
	}
	refresh(token, refreshToken) {
		// save tokens
		localStorage.setItem("token", token)
		localStorage.setItem("refreshToken", refreshToken)

		// save last log
		localStorage.setItem("lastLog", new Date().getTime())

		setTimeout(() => {
			const res = this.api.refresh(localStorage.getItem("refreshToken"))

			if (res.isOk) {
				const { token, refreshToken } = JSON.parse(res.body)
				this.refresh(token, refreshToken)
			} else alert(res.error)
		}, this.api.tokenLife - this.timeEdge)
	}

	getData(token) {
		const res = this.api.getData(token)

		if (res.isOk) return JSON.parse(res.body).data
		else {
			alert(res.error)
			return []
		}
	}
	addEvent(target) {
		// define event object and get info from ui
		const eventObject = { name: "", date: "", type: "" }
		eventObject.name = target.parentElement.children[0].value.trim()

		// send data to backend
		const res = this.api.setData(localStorage.getItem("token"), eventObject)

		if (res.isOk) {
			const data = JSON.parse(res.body).newData

			// add event to ui
			this.ui.mapEvents([data], this.ui.elements.eventContainer)
		} else return alert(res.error)
	}
	removeEvent(target) {
		const parent = target.parentElement

		if (this.#alive()) {
			// send delete request to backend
			const name = parent.children[0].innerHTML
			const res = this.api.removeData(localStorage.getItem("token"), name)

			if (!res.isOk) return alert(res.error)
		}

		// remove element from ui
		parent.style.opacity = "0"
		setTimeout(() => parent.remove(), 600)
	}
	editEvent(target) {
		const id = target.parentElement.id
		console.log(id)
	}

	addEventTest() {
		const container = document.createElement("div")
		container.style.cssText = "display:flex;flex-direction:column;justify-content:center"

		const keys = ["name", "date", "type"]
		keys.forEach((key) => {
			const input = document.createElement("input")
			// input.id = key

			const label = document.createElement("label")
			label.setAttribute("for", key)

			container.appendChild(label)
			container.appendChild(input)
		})

		this.ui.openModal(container)
	}
}
export const main = new Main()
