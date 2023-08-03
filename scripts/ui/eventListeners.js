export default class EventListeners {
	select(event) {
		const target = event.target
		const selected = target.children[target.selectedIndex]

		// add selected text to leverage
		for (const option of target.parentNode.children) {
			if (option.className.trim() === "widthLeverage") {
				option.innerHTML = selected.innerHTML
				const width = option.clientWidth === 0 ? 14 : option.clientWidth + 25
				target.style.width = `${width}px`
			}
		}
	}
	input(event) {
		const target = event.target
		const parent = target.parentNode

		// put text into p
		const leverage = target.parentNode.children[1]
		leverage.innerHTML = target.value

		// set parent width equal as p width
		const width = leverage.clientWidth
		const button = target.parentNode.parentNode
		const maxWidth = button.parentNode.clientWidth - 200

		if (width === 0) parent.style.width = `${110}px`
		else if (button.clientWidth < maxWidth) parent.style.width = `${width + 10}px`
	}
}
