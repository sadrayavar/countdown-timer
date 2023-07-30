import Ui from "./ui.js"
import Database from "./database.js"
import { Clock, Stopwatch, Timer, Alarm, Preiodical } from "./event.js"

export class Main {
	ui = new Ui()
	db = new Database()

	constructor() {
		this.dbd
	}

	addEvent() {}
	removeEvent() {}
	editEvent() {}
	searchEvent() {}
}

const main = new Main()
export default main
