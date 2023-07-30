export default class EventListeners {
	select(event) {
		const target = event.target
		const selected = target.children[target.selectedIndex]

		console.log('changed');
		
		// add selected text to leverage
		for (const option of target.parentNode.children) {
			if (option.className.trim() === "widthLeverage") {
				option.innerHTML = selected.innerHTML
				const width = option.clientWidth === 0 ? 14 : option.clientWidth + 25
				target.style.width = `${width}px`
			}
		}
	}
}
