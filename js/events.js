toggleEvent = function(button, event_id) {
	var event = document.getElementById(event_id)

	if (event.style.maxHeight) {
		event.style.maxHeight = null
		button.removeAttribute('open')
	} else {
		button.setAttribute('open', true)
		event.style.maxHeight = event.scrollHeight + "px"
	}
}