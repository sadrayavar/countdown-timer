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
	auth() {
		const now = new Date().getTime()
		localStorage.setItem("countdownTimerDatabase", this.database)
	}
}
