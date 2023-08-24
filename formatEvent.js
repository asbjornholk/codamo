formatEvent = function(event, event_id) {
	const firstIndex = /<h3>/.exec(event).index
	const reSchedules = /<h3>(.*?)<\/h3>/g
	const reTables = /<table>(.*?)<\/table>/gs

	var eventOut = event.substring(0, firstIndex)
	
	while (true) {
		var name = reSchedules.exec(event)
		var table = reTables.exec(event)

		if (name === null) {
			break
		}

		var id = (Math.random() + 1).toString(36).substring(2)
		eventOut += `<button class="event-button schedule-button" onclick="toggleTable(this, '` + event_id + `', '` + id + `')">` + name[1] + '</button>\n'
		eventOut += '<div class="event-content timetable-container" id="' + id + '">\n'
		eventOut += formatTable(table[1]) + "\n</div>\n"

	}
	
	return eventOut
}

formatTable = function(table) {
	const ncol = table.match(/<th>/g).length
	const reRow = /<tr>(.*?)<\/tr>/g

	var tableOut = '<table>\n<thead>\n<tr>\n<th>Time</th>\n<th>Speaker</th>\n'
	if (ncol == 3) {
		tableOut += '<th>Title</th>\n'
	} else if (ncol == 4) {
		tableOut += '<th>Title (click for details)</th>\n'
	}
	tableOut += '</tr>\n</thead>\n'

	var _firstrow = reRow.exec(table)

	while (true) {
		var row = reRow.exec(table)
		if (row === null) {
			break
		}

		tableOut += '\n' + formatRow(row[1], ncol)
	}

	tableOut += '</table>'

	return tableOut
}

formatRow = function(row, ncol) {
	const reContent = /<td>(.*?)<\/td>/g
	var rowContent = []
	for (let i = 0; i < ncol; i++) {
		rowContent.push(reContent.exec(row)[1])
	}
	
	var rowOut = '<tr>'

	if (ncol == 2) {
		rowOut += '<td>' + rowContent[0] + '</td><td>' + rowContent[1] + '</td>'
	} else if (ncol == 3) {
		rowOut += '<td>' + rowContent[0] + '</td><td>' + rowContent[1] + '</td><td>' + rowContent[2] + '</td>'
	} else {
		var id = (Math.random() + 1).toString(36).substring(2)
		rowOut += '<td>' + rowContent[0] + '</td><td>' + rowContent[1] + `</td><td><button onclick="openModal('` + id + `')">` + rowContent[2] + '</button></td>'
		rowOut += '<dialog class="modal" id="' + id + '"><div class="modal-content"><h3>' + rowContent[2] + '</h3><p>' + rowContent[3] + '</p></div></dialog>'
	}
	rowOut += '</tr>'
	return rowOut
}

const test1 = '<h1>Test event!</h1>\n' +
'<h2>Practical details</h2>\n' +
'<ul>\n' +
'<li>Location: Aarhus University Aud. G2</li>\n' +
'<li>Date and Time: December 15th 9.15-17.00</li>\n' +
'<li>Address: Ny Munkegade 118, 8000 Aarhus C</li>\n' +
'</ul>\n' +
'<h2>Description</h2>\n' +
'<p>Test event!</p>\n' +
'<h3>Schedule</h3>\n' +
'<table>\n' +
'<thead>\n' +
'<tr>\n' +
'<th>time</th>\n' +
'<th>speaker</th>\n' +
'<th>title</th>\n' +
'<th>abstract</th>\n' +
'</tr>\n' +
'</thead>\n' +
'<tbody>\n' +
'<tr>\n' +
'<td>1</td>\n' +
'<td>bobo</td>\n' +
'<td>al</td>\n' +
'<td>abs</td>\n' +
'</tr>\n' +
'</tbody>\n' +
'</table>\n' +
'<h3>Schedule2</h3>\n' +
'<table>\n' +
'<thead>\n' +
'<tr>\n' +
'<th>time</th>\n' +
'<th>speaker</th>\n' +
'<th>title</th>\n' +
'<th>abstract</th>\n' +
'</tr>\n' +
'</thead>\n' +
'<tbody>\n' +
'<tr>\n' +
'<td>2</td>\n' +
'<td>po</td>\n' +
'<td>by</td>\n' +
'<td>pas</td>\n' +
'</tr>\n' +
'</tbody>\n' +
'</table>\n' +
'<h3>Schedule3</h3>\n' +
'<table>\n' +
'<thead>\n' +
'<tr>\n' +
'<th>time</th>\n' +
'<th>speaker</th>\n' +
'<th>title</th>\n' +
'</tr>\n' +
'</thead>\n' +
'<tbody>\n' +
'<tr>\n' +
'<td>1</td>\n' +
'<td>bobo</td>\n' +
'<td>al</td>\n' +
'</tr>\n' +
'<tr>\n' +
'<td>2</td>\n' +
'<td>po</td>\n' +
'<td>by</td>\n' +
'</tr>\n' +
'</tbody>\n' +
'</table>\n'

console.log(formatEvent(test1))