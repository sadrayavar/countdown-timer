import FakeBackEnd from "./fakeBackEnd.js"
import Database from "./database.js"
import Ui from "./ui.js"

export default class Main {
	db = new Database()
	ui = new Ui()
	api = new FakeBackEnd()

	constructor() {
		this.#firstLoad()
	}
	async log() {
		// const { main } = await import("./main.js")

		console.log("front database:\n", this.db.read(), "\n", "back database:\n", this.api.tempForLog().users)
	}
	#firstLoad() {
		function leftTime(lastLog) {
			if (lastLog === null) return 0
			else {
				const now = new Date().getTime()

				return now - lastLog
			}
		}

		// check if its authenticated
		const lastLog = this.db.read("lastLog")
		const alive = leftTime(lastLog) > this.api.tokenLife / 10
		if (alive) this.refresh(this.db.read("refreshToken"))
		else {
			// clean browser storage
			localStorage.removeItem(this.db.databaseKey)
			// create new database
			this.db.write({ lastLog: null, alive: false, events: [] })
		}
		// load data from database
		const data = this.db.read("events")
		// map data to ui
		this.ui.mapEvents(data, this.ui.elements.eventContainer)
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
			this.db.write(username, "username")

			// start to refresh the token
			this.refresh(token, refreshToken)

			// get data from back after login
			this.getData(this.db.read("token"))

			// map data to ui
			const data = this.db.read("events")
			const eventContainer = this.ui.elements.eventContainer
			eventContainer.innerHTML = ""
			this.ui.mapEvents(data, eventContainer)
		} else alert(res.error)
	}
	logout() {
		// delete database
		this.db.write({ lastLog: null }, undefined)

		// refresh page
		location.reload()
	}
	refresh(token, refreshToken) {
		// save tokens
		this.db.write(token, "token")
		this.db.write(refreshToken, "refreshToken")

		// save last log
		this.db.write(new Date().getTime(), "lastLog")
		this.db.write(true, "alive")

		setTimeout(() => {
			const res = this.api.refresh(this.db.read("refreshToken"))

			if (res.isOk) {
				const { token, refreshToken } = JSON.parse(res.body)
				this.refresh(token, refreshToken)
			} else alert(res.error)
		}, this.api.tokenLife * 0.9)
	}
	getData(token) {
		const res = this.api.getData(this.db.read("token"))

		if (res.isOk) {
			let events = JSON.parse(res.body).data
			if (events == undefined) events = []

			this.db.write(events, "events")
		}
	}
	addEvent(target) {
		// define event object
		const eventObject = { name: "", date: "", type: "" }

		// get event info from ui
		eventObject.name = target.parentElement.children[0].value

		// check for existence
		const events = this.db.read("events")
		for (let i = 0; i < events.length; i++)
			if (events[i].name === eventObject.name) return alert("this event already exists")

		// add event to database
		events.push(eventObject)
		this.db.write(events, "events")

		// add event to ui
		this.ui.mapEvents([eventObject], this.ui.elements.eventContainer)

		// send data to backend
		this.api.setData(this.db.read("token"), this.db.read("events"))
	}
	removeEvent(target) {
		const parent = target.parentElement

		// remove element from database
		const events = this.db.read("events")
		for (let i = 0; i < events.length; i++) if (events[i].name === parent.children[0].innerHTML) events.splice(i, 1)
		this.db.write(events, "events")

		// remove element from ui
		target.parentElement.remove()

		// send remove signal to backend
		this.api.setData(this.db.read("token"), this.db.read("events"))
	}
	editEvent(target) {
		const id = target.parentElement.id
		console.log(id)
	}
}
export const main = new Main()
