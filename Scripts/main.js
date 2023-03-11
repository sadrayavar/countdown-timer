import FakeBackEnd from "./fakeBackEnd.js"
import Database from "./database.js"
import Ui from "./ui.js"

export default class Main {
	db = new Database()
	ui = new Ui()
	api = new FakeBackEnd()

	constructor() {
		// add button event listeners
		;["signup", "login", "log"].forEach((key) => (document.getElementById(key).onclick = this.#eventListener))

		this.#firstLoad()
	}
	async log() {
		const { main } = await import("./main.js")

		console.log("front database:\n", main.db.read(), "\n", "back database:\n", main.api.tempForLog().users)
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
		if (alive) {
			// start to refresh after n seconds
			setTimeout(() => this.refresh(), leftTime(lastLog))
		} else {
			// clean browser storage
			localStorage.removeItem(this.db.databaseKey)
			// create new database
			this.db.write({ lastLog: null, alive: false, events: [] })
		}
		// load data from database
		const data = this.db.read("events")
		// map data to ui
		this.ui.mapTo(data)
	}
	async #eventListener(event) {
		const target = event.target
		const { main } = await import("./main.js")
		main[target.getAttribute("evetListener")](target)
	}
	signup(target) {
		// get username and password that are in input field
		let { username, password } = target.parentElement.children
		username = username.value
		password = password.value

		const res = this.api.signup(username, password)

		if (res.isOk) this.login(target, JSON.parse(res.body))
		else {
			alert(res.error)
			this.log()
		}
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
		} else {
			alert(res.error)
			this.log()
		}
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
			const { token, refreshToken } = JSON.parse(res.body)

			if (res.isOk) this.refresh(token, refreshToken)
			else alert(res.error)
		}, this.api.tokenLife * 0.9)

		this.log()
	}
}
export const main = new Main()
