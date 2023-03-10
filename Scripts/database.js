export default class Database {
	databaseKey = "countdown_timer_database"

	write(data, property = undefined) {
		if (property == undefined) localStorage.setItem(this.databaseKey, btoa(JSON.stringify(data)))
		else {
			const database = this.read()
			database[property] = data
			this.write(database)
		}
	}

	read(property = undefined) {
		const data = localStorage.getItem(this.databaseKey)

		if (data === null) return null

		if (property === undefined) return JSON.parse(atob(data))
		else return JSON.parse(atob(data))[property]
	}
}
