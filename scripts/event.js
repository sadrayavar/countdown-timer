class Event {
	#validTypes = ["stopwatch", "clock", "timer", "alarm", "periodical"]
	#id = "" // name
	#description = ""
	#active = false

	renameEvent() {}
}

class Clock extends Event {
	region = ""
	
	constructor(region) {
		this.region = region
	}
}

class Stopwatch extends Event {
	#laps = []

	constructor() {}

	addLap(time) {
		this.#laps.push(time)
	}
}

class Timer extends Event {
	time = 0
	constructor() {}
}

class Alarm extends Timer {
	constructor() {}
}

class Preiodical extends Timer {
	constructor() {}
}

export { Clock, Stopwatch, Timer, Alarm, Preiodical }
