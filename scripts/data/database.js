/**
 * A database platform  that has 4 main methods:
 * - add
 * - remove
 * - edit
 * - read
 * Saves data in browser localStorage
 */
export default class Database {
	#databaseName = ""
	#debug = 0

	/**
	 * you can decide the type of the database you want to use:
	 * 	- new database
	 * 	- fetch from localStorage
	 * @param {string} name name of the database that will be saved as a key on localStorage
	 * @param {object | false}  initData data object if you want to make new database and false if you want to use the database that is saved in local storage
	 * @param {number} debug 2 for error and logs, 1 inly for errors and 0 for nothing
	 */
	constructor(name, initData, debug = 0) {
		// initialize debug condition
		this.#debug = debug

		this.#databaseName = name
		this.#log("database.js-constructor: database is created with this name:", this.#databaseName)

		// if the initData is object
		if (typeof initData === "object" && !Array.isArray(initData) && initData !== null) {
			this.#saveData(initData)
			this.#log("database.js-constructor: database initialized with given database")
		}
		// fetch data from localStorage
		else if (initData === false) {
			this.#log("database.js-constructor: database initialized with data in the localStorage")
		}
		// if the given initData is not valid
		else {
			this.#error(
				`database.js-constructor: try again and use true or data object in "initData" parameter. current initData is: ${initData}`
			)
		}
	}

	// ################################################################# secondary methods

	/**
	 * saves given data in browser's local storage
	 * @param {object} data
	 */
	#saveData = (data) => {
		try {
			const stringified = JSON.stringify(data)
			const encoded = btoa(stringified)
			localStorage.setItem(this.#databaseName, encoded)
			this.#log("database.js-saveData: data succesfully saved in localStorage")
		} catch (error) {
			this.#error(`database.js-saveData: something went wrong. ${error}`)
		}
	}

	/**
	 * loads data from browsers localStorage with current database key
	 * @returns data
	 */
	#loadData = () => {
		try {
			const stringified = localStorage.getItem(this.#databaseName)
			if (stringified === null) {
				this.#error(`database.js-loadData: data didnt load because it was: ${stringified}`)
				return false
			}

			this.#log("database.js-loadData: data loaded succcesfully")
			const decoded = atob(stringified)
			return JSON.parse(decoded)
		} catch (error) {
			this.#error(`database.js-loadData: something went wrong. ${error}`)
		}
	}

	/**
	 * logs input in the console if #debug key is true
	 * @param {*} input
	 */
	#log(...input) {
		try {
			if (this.#debug === 2) console.log(...input)
		} catch (error) {
			console.log(`database.js-saveData: something went wrong. ${error}`)
		}
	}

	/**
	 * logs input in the console as error if #debug key is true
	 * @param {*} input
	 */
	#error(...input) {
		try {
			if (this.#debug >= 1) console.error(...input)
		} catch (error) {
			console.error(`database.js-saveData: something went wrong. ${error}`)
		}
	}

	/**
	 * checks if the given table name exist in database or not
	 * @param {string } inputName table name that you want to make sure that its exist or not
	 * @returns {string | false} the name of the table if its found and false if it doesnt
	 */
	#checkTableName(inputName) {
		try {
			const tableNames = Object.keys(this.#loadData())

			for (let index = 0; index < tableNames.length; index++) {
				const table = tableNames[index]
				if (inputName === table) {
					this.#log("database.js-checkTableName: the table that you are looking for is", table, "and exists")
					return table
				}
			}

			this.#error(`database.js-checkTableName: table with this name doesnt exist: ${inputName}`)
			return false
		} catch (error) {
			this.#error(`database.js-checkTableName: something went wrong. ${error}`)
		}
	}

	/**
	 * get the data index
	 * @param {string} inputTable the name of the table that the data will be searched on
	 * @param {number} inpuId the data id that user want to search
	 * @returns {number | false} index of the data if its found, and false if it isnt found
	 */
	#checkDataExist(inputTable, inputId) {
		try {
			// check if table name exist in database
			const tableName = this.#checkTableName(inputTable)
			if (tableName === false) {
				this.#error(`database.js-add: data is not added because this table name doesnt exist: ${tableName}`)
				return false
			}

			const database = this.#loadData()
			const table = database[tableName]
			for (let i = 0; i < table.length; i++) {
				if (database[tableName][i].id === inputId) {
					this.#log(`database.js-checkExist: Data found in  ${i}, with the table name of: ${tableName}`)
					return i
				}
			}

			this.#log("database.js-checkDataExist: Given data id doesnt exist")
			return false
		} catch (error) {
			this.#error(`database.js-checkDataExist: something went wrong. ${error}`)
		}
	}

	// ################################################################# main methods

	/**
	 * adds data to database
	 * @param {string} inputTable the table you want to add the data on
	 * @param {object} inputData data you want to add (it must have id field)
	 * @returns {boolean} whether data is added or not
	 */
	add(inputTable, inputData) {
		try {
			// check if table name exist in database
			const tableName = this.#checkTableName(inputTable)
			if (tableName === false) {
				this.#error(`database.js-add: data is not added because ${tableName} table doesnt exist`)
				return false
			}

			// check if data exists in the table
			const dataPlace = this.#checkDataExist(inputTable, inputData.id)
			if (dataPlace !== false) {
				this.#error(
					`database.js-add: data is not added because data with this id already exists: ${dataPlace} in this table: ${tableName}`
				)
				return false
			}

			// add data
			const database = this.#loadData()
			database[tableName].push(inputData)
			this.#saveData(database)
			this.#log(`database.js-add: data added succesfully to database in ${tableName} table`)
			return true
		} catch (error) {
			this.#error(`database.js-add: something went wrong. ${error}`)
			return false
		}
	}

	/**
	 * deletes data
	 * @param {string} inputTable the table you want to to delete the data from
	 * @param {number | string} inputId the id of the data that you want to delete
	 * @returns {boolean} whether data is deleted or not
	 */
	remove(inputTable, inputId) {
		try {
			// check if table name exist in database
			const tableName = this.#checkTableName(inputTable)
			if (tableName === false) {
				this.#error(`database.js-remove: data is not removed because this table doesnt exist: ${tableName}`)
				return false
			}

			// check if data exists in the table
			const dataPlace = this.#checkDataExist(inputTable, inputId)
			if (dataPlace === false) {
				this.#error(`database.js-remove: data is not removed because data with this id does not exists: ${dataPlace}`)
				return false
			}

			// remove data
			const database = this.#loadData()
			database[tableName].splice(dataPlace, 1)
			this.#saveData(database)
			this.#log(`database.js-remove: data in the ${dataPlace} remvoed`)
			return true
		} catch (error) {
			this.#error(`database.js-remove: something went wrong. ${error}`)
			return false
		}
	}

	/**
	 * edits data
	 * data must have a unique id field
	 * @param {string} inputTable the table of the data that you want to edit
	 * @param {object} inputData new form of the data you want to edit (remember that you cant edit id field)
	 * @returns {boolean} whether data is edited or not
	 */
	edit(inputTable, inputData) {
		try {
			this.remove(inputTable, inputData.id)
			this.add(inputTable, inputData)
			return true
		} catch (error) {
			this.#error(`database.js-edit: something went wrong. ${error}`)
			return false
		}
	}

	/**
	 * outputs the data that you want to get
	 * @param {string} inputTable the table you want to to read the data from
	 * @param {number | string} inputId the id of the data that you want to get
	 * @returns {object | false} the object data and false if it cant
	 */
	read(inputTable, inputId) {
		try {
			// check if table name exist in database
			const tableName = this.#checkTableName(inputTable)
			if (tableName === false) {
				this.#error(`database.js-read: data is not readed because table with this name doesnt exist: ${tableName}`)
				return false
			}

			// check if data exists in the table
			const dataPlace = this.#checkDataExist(tableName, inputId)
			if (dataPlace === false) {
				this.#error(`database.js-read: data is not readed because data with this id does not exists: ${dataPlace}`)
				return false
			}

			// read data
			const database = this.#loadData()
			const table = database[tableName]
			const data = table[dataPlace]
			return data
		} catch (error) {
			this.#error(`database.js-read: something went wrong. ${error}`)
			return false
		}
	}
}
