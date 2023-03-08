export default class Authentication {
	isAuth(lastLog) {
		if (typeof lastLog === "number") {
			const now = new Date().getTime()

			if (now - lastLog < 600000) {
				return false
			} else {
				return true
			}
		} else {
			return false
		}
	}
	auth(db) {
		const now = new Date().getTime()
		db.lastLog = now
		localStorage.setItem("countdownTimerDatabase", JSON.stringify(db))
	}
}
