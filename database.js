export default class Database {
	database = sessionStorage.getItem("countdownTimerDatabase")
		? sessionStorage.getItem("countdownTimerDatabase")
		: { lastLog: undefined }

	newDatabase() {
		this.database = { lastLog: undefined, events: [] }
		localStorage.setItem("countdownTimerDatabase", JSON.stringify(this.database))
	}
}
