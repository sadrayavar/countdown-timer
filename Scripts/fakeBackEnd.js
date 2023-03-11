export default class BackEnd {
	databaseKey = "fake_back_end_database"
	tokenLife = 1000 * 60 * 3
	initialData = {
		users: [
			{
				username: "sadra",
				password: "123",
				data: {
					events: [
						{
							name: "Mom's birthday",
							date: 1678294104178,
							type: "yearly",
						},
						{
							name: "Toothbrush",
							date: 1673294404178,
							type: "daily",
						},
						{
							name: "deliver package",
							date: 1678294101178,
							type: "once",
						},
					],
				},
			},
			{
				username: "ali",
				password: "456",
				data: {},
			},
		],
	}
	constructor() {
		if (this.#read() === null) this.#write(this.initialData)
	}
	#read = () => {
		const data = localStorage.getItem(this.databaseKey)
		if (data === null) return null
		else return JSON.parse(atob(data))
	}
	#write = (data) => localStorage.setItem(this.databaseKey, btoa(JSON.stringify(data)))
	#response = (isOk, body = undefined, error = undefined) => {
		if (isOk)
			return {
				isOk,
				body: JSON.stringify(body),
			}
		else return { isOk, error }
		// if (body === undefined) return { isOk }
		// else return { isOk, body: JSON.stringify(body) }
	}
	#generateToken = (username, password) => {
		username = btoa(username)
		password = btoa(password)
		const now = btoa(new Date().getTime())
		const pin = btoa(Math.floor(Math.random() * 10000000))

		const token = `${username}.${password}.${now}`
		const refreshToken = `${username}.${password}.${pin}`

		const database = this.#read()
		database.users.forEach((user) => {
			if (user.username === username) {
				user.token = token
				user.refreshToken = refreshToken
			}
		})

		return [token, refreshToken]
	}
	#checkUser = (username, password = undefined) => {
		const users = this.#read().users

		let existence = false
		let userPlace = 0

		users.forEach((user) => {
			if (user.username === username) existence = true
			if (!existence) userPlace++
		})

		if (password == undefined) {
			if (existence) return userPlace
		} else {
			if (users[userPlace].password === password) return userPlace
		}
		return -1
	}
	auth(db) {
		const now = new Date().getTime()
		db.lastLog = now
		localStorage.setItem("countdownTimerDatabase", JSON.stringify(db))
	}

	signup(username, password) {
		if (this.#checkUser(username) > -1)
			return this.#response(false, "", "you cant sign up because username already exist")
		else {
			const database = this.#read()
			database.users.push({
				username,
				password: password.toString(),
				events: [],
			})
			this.#write(database)

			return this.#response(true, { username, password })
		}
	}
	login(username, password) {
		const userPlace = this.#checkUser(username, password)
		if (userPlace > -1) {
			const [token, refreshToken] = this.#generateToken(username, password)

			const data = this.#read()
			data.users[userPlace] = { ...data.users[userPlace], token, refreshToken }
			this.#write(data)

			return this.#response(true, { username, token, refreshToken })
		} else return this.#response(false, "", "you cant log in because username " + username + " doesnt exist")
	}
	refresh(refreshToken) {
		this.#read().users.forEach((user) => {
			if (user.refreshToken === refreshToken) {
				const now = new Date().getTime()
				const tokenBirth = Number(atob(user.token.split(".")[2]))

				if (now - tokenBirth < this.tokenLife) {
					let [token, refreshToken] = this.#generateToken(user.username, user.password)

					user.token = token
					user.refreshToken = refreshToken
					this.#write(data)

					return this.#response(true, { token, refreshToken })
				} else {
					delete user.token
					delete user.refreshToken
					this.#write(data)
					return this.#response(false, "", "token is dead")
				}
			} else return this.#response(false, "", "token is unvallid")
		})
	}
	tempForLog = () => this.#read()
}
