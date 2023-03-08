import Authentication from "./authentication.js"
import Database from "./database.js"
import Api from "./api.js"
import Ui from "./ui.js"

// constant values
const sessionLife = 600000

class Main {
	auth = new Authentication()
	db = new Database()
	api = new Api()
	ui = new Ui()

	constructor() {
		// check if its authenticated
		const lastLog = this.db.database.lastLog
		const temp = this.auth.isAuth(lastLog)
		if (temp === false) {
			// create new database
			this.db.newDatabase()

			// authenticate
			this.auth.auth()

			// get and save data on database
			this.db.database.events = this.api.getData()
		}

		// load data from database
		const data = this.db.database.events

		// map data to ui
		this.ui.mapTo(data)
	}
}
const main = new Main()
export default main
