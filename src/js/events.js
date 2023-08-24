toggleEvent = function(button, event_id) {
	var event = document.getElementById(event_id)

	if (event.style.maxHeight) {
		event.style.maxHeight = null
		event.style.padding = "0px 20px 0px 20px"
		button.removeAttribute('open')
	} else {
		button.setAttribute('open', true)
		event.style.padding = "0px 20px 20px 20px"
		event.style.maxHeight = event.scrollHeight + "px"
	}
}

toggleTable = function(button, event_id, table_id) {
	var event = document.getElementById(event_id)
	var table = document.getElementById(table_id)

	if (table.style.maxHeight) {
		table.style.maxHeight = null
		button.removeAttribute('open')
		event.style.maxHeight = event.scrollHeight + "px"
	} else {
		button.setAttribute('open', true)
		table.style.maxHeight = table.scrollHeight + "px"
		event.style.maxHeight = event.scrollHeight + table.scrollHeight + "px"
	}
}