import Ui from "./ui/ui.js"
import Database from "./data/database.js"
import { Clock, Stopwatch, Timer, Alarm, Preiodical } from "./data/event.js"

export class Main {
	ui = new Ui()
	db = new Database()

	constructor() {
	}

	addEvent() {}
	removeEvent() {}
	editEvent() {}
	searchEvent() {}
}

const main = new Main()
