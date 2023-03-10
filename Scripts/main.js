import FakeBackEnd from "./fakeBackEnd.js"
import Database from "./database.js"
import Ui from "./ui.js"

export default class Main {
	db = new Database()
	ui = new Ui()
	api = new FakeBackEnd()

	async log() {
		const { main } = await import("./main.js")

		console.log("front database:\n", main.db.read(), "\n", "back database:\n", main.api.tempForLog().users)
	}
	constructor() {
		// add button event listeners
		;["signup", "login", "log"].forEach((key) => (document.getElementById(key).onclick = this[key]))

		this.#firstLoad()
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
	#updateSession(res) {
		// save tokens
		const { token, refreshToken } = JSON.parse(res.body)
		main.db.write(token, "token")
		main.db.write(refreshToken, "refreshToken")

		// save last log
		main.db.write(new Date().getTime(), "lastLog")
		main.db.write(true, "alive")
	}
	async signup(event) {
		// get username and password that are in input field
		let { username, password } = event.target.parentElement.children
		username = username.value
		password = password.value

		// import backend api and database
		const { main } = await import("./main.js")

		const res = main.api.signup(username, password)

		if (res.isOk) {
			// save username and password
			const { username, password } = JSON.parse(res.body)
			main.db.write(username, "username")

			// login
			const logRes = main.api.login(username, password)
			if (logRes.isOk) main.#updateSession(res)
			else alert(logRes.error)
		} else alert(res.error)

		main.log()
	}
	async login(event) {
		// get username and password that are in input field
		let { username, password } = event.target.parentElement.children
		username = username.value
		password = password.value

		// import backend api and database
		const { main } = await import("./main.js")

		const res = main.api.login(username, password)

		if (res.isOk) {
			main.#updateSession(res)

			// start to refresh the token
			setTimeout(() => main.refresh(), main.api.tokenLife * 0.9)
		} else alert(res.error)

		main.log()
	}
	async refresh(event) {
		// import backend api and database
		const { main } = await import("./main.js")

		const res = main.api.refresh(main.db.read("refreshToken"))

		if (res.isOk) {
			main.#updateSession(res)
			setTimeout(() => main.refresh(), this.api.tokenLife * 0.9)
		} else alert(res.error)

		main.log()
	}
}
export const main = new Main()
