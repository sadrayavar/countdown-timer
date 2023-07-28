import Ui from "./ui.js"
import Database from "./database.js"

export default class Main {
	ui = new Ui()
	db = new Database()

	constructor() {}

	addEvent() {}
	removeEvent() {}
	editEvent() {}
	searchEvent() {}
}
export const main = new Main()
