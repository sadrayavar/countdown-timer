export default class Authentication {
	isAuth(lastLog) {
		const isNumber = !isNaN(lastLog)
		if (isNumber) {
			const now = new Date().getTime()

			if (now - lastLog < sessionLife) {
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
