export default class Database {
	database = undefined

	constructor() {
		let temp = JSON.parse(localStorage.getItem("countdownTimerDatabase"))

		if (temp == null) temp = { lastLog: null }

		this.database = temp
	}

	newDatabase() {
		this.database = { lastLog: undefined, events: [] }
		localStorage.setItem("countdownTimerDatabase", JSON.stringify(this.database))
	}
}
