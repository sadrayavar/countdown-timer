export default class BackEnd {
	#databaseKey = "fake_back_end_database"
	tokenLife = 1000 * 60 * 0.25
	#initialData = {
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
		if (this.#read() === null) this.#write(this.#initialData)
	}
	tempForLog() {
		return this.#read()
	}
	#read = () => {
		const data = localStorage.getItem(this.#databaseKey)
		if (data === null) return null
		else return JSON.parse(atob(data))
	}
	#write = (data) => localStorage.setItem(this.#databaseKey, btoa(JSON.stringify(data)))
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
			if (existence && users[userPlace].password === password) return userPlace
		}
		return -1
	}
	#validateToken(token) {
		const users = this.#read().users

		for (let i = 0; i < users.length; i++) if (users[i].token == token) return i

		return -1
	}

	signup(username, password) {
		if (this.#checkUser(username) > -1)
			return this.#response(false, "", "you cant sign up because username already exist")
		else {
			const database = this.#read()
			database.users.push({
				username,
				password: password.toString(),
				data: {},
			})
			this.#write(database)

			return this.#response(true, { username, password })
		}
	}
	login(username, password) {
		const userPlace = this.#checkUser(username, password)
		if (userPlace > -1) {
			//create token
			const [token, refreshToken] = this.#generateToken(username, password)

			// save token
			const data = this.#read()
			data.users[userPlace] = { ...data.users[userPlace], token, refreshToken }
			this.#write(data)

			// delete token after specified time
			setTimeout(() => {
				const data = this.#read()

				if (data.users[userPlace].token === token) {
					delete data.users[userPlace].token
					delete data.users[userPlace].refreshToken
					this.#write(data)
				}
			}, this.tokenLife)

			// return response
			return this.#response(true, { username, token, refreshToken })
		} else return this.#response(false, "", "you cant log in - given credentials are not correct")
	}
	refresh(refreshToken) {
		const data = this.#read()
		for (let i = 0; i < data.users.length; i++) {
			// check next user if token is not the same
			if (data.users[i].refreshToken !== refreshToken) continue

			// check token life
			const now = new Date().getTime()
			const tokenBirth = Number(atob(data.users[i].token.split(".")[2]))
			if (now - tokenBirth < this.tokenLife) {
				// create token
				let [token, refreshToken] = this.#generateToken(data.users[i].username, data.users[i].password)

				// save token
				data.users[i] = { ...data.users[i], token, refreshToken }
				this.#write(data)

				// delete token after specified time
				setTimeout(() => {
					const data = this.#read()

					if (data.users[i].token === token) {
						delete data.users[i].token
						delete data.users[i].refreshToken
						this.#write(data)
					}
				}, this.tokenLife)

				//return response
				return this.#response(true, { token, refreshToken })
			} else {
				data.users[i] = { ...data.users[i], token: null, refreshToken: null }
				this.#write(data)
				return this.#response(false, "", "token is dead")
			}
		}
		return this.#response(false, "", "token is unvalid")
	}
	getData(token) {
		const userPlace = this.#validateToken(token)
		if (userPlace > -1) {
			const data = this.#read().users[userPlace].data.events
			return this.#response(true, { data })
		} else return this.#response(false, "", "token is invalid")
	}
	setData(token, newData) {
		const userPlace = this.#validateToken(token)
		if (userPlace > -1) {
			const data = this.#read()
			data.users[userPlace].data.events = newData
			this.#write(data)
			return this.#response(true, { data })
		} else return this.#response(false, "", "token is invalid")
	}
}
