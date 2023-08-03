import Ui from "./ui/ui.js"
import Database from "./data/database.js"
import { Clock, Stopwatch, Timer, Alarm, Preiodical } from "./data/event.js"

export class Main {
	ui = new Ui()
	db = new Database()

	constructor() {
		// add form elements
		const form = document.getElementsByTagName("form")[0]
		form.append(this.ui.formSearch())

		// add event listeners
		this.ui.addEventListener({ all: true })
	}

	addEvent() {}
	removeEvent() {}
	editEvent() {}
	searchEvent() {}
}

const main = new Main()
