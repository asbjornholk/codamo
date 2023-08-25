const { parsePhoneNumber } = require('libphonenumber-js')
const { EleventyRenderPlugin } = require("@11ty/eleventy")
const { DateTime } = require("luxon")

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
	const nrow = table.match(/<tr>/g).length
	const reRow = /<tr>(.*?)<\/tr>/gs

	var tableOut = '<table class="timetable">\n<thead>\n<tr>\n<th>Time</th>\n<th>Speaker</th>\n'
	if (ncol == 3) {
		tableOut += '<th>Title</th>\n'
	} else if (ncol == 4) {
		tableOut += '<th>Title (click for details)</th>\n'
	}
	tableOut += '</tr>\n</thead>\n'

	var _firstrow = reRow.exec(table)

	for (let i = 0; i < nrow-1; i++) {
		var row = reRow.exec(table)
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
	var rowOut = '<tr>\n'

	rowOut += '<td>' + rowContent[0] + '</td>\n<td>' + rowContent[1] + '</td>\n'
	
	if ( ncol == 3 ) {
		rowOut += '<td>' + rowContent[2] + '</td>\n'
	} else if ( ncol == 4 ) {
		var id = (Math.random() + 1).toString(36).substring(2)
		rowOut += `<td><button onclick="openModal('` + id + `')">` + rowContent[2] + '</button></td>\n'
		rowOut += '<dialog class="modal" id="' + id + '">\n<div class="modal-content">\n<h3>' + rowContent[2] + '</h3>\n<p>' + rowContent[3] + '</p>\n</div>\n</dialog>\n'
	}
	rowOut += '</tr>'
	return rowOut
}

module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy('./src/css')
	eleventyConfig.addPassthroughCopy('./src/js')
	eleventyConfig.addPassthroughCopy('./src/assets')

	eleventyConfig.addPlugin(EleventyRenderPlugin)
	
	eleventyConfig.addCollection('upcoming', function(collectionAPI){
		return collectionAPI.getFilteredByTag('event').filter(function(item){
			const currentDate = new Date()
			return item.data.end.getTime() > currentDate.getTime()
		})
	})
	
	eleventyConfig.addCollection('past', function(collectionAPI){
		return collectionAPI.getFilteredByTag('event').filter(function(item){
			const currentDate = new Date()
			return item.data.end.getTime() <= currentDate.getTime()
		})
	})

	eleventyConfig.addFilter('isOneDay', function(event) {
		return event.data.end.getTime() == event.data.start.getTime()
	})

	eleventyConfig.addFilter('formatDate', function(date) {
		return DateTime.fromJSDate(date).toFormat('dd/LL/yy')
	})

	eleventyConfig.addFilter('formatEvent', function(event) {
		const eventContent = event.content
		const event_id = event.data.id

		return formatEvent(eventContent, event_id)
	})

	eleventyConfig.addFilter('formatPhone', function(number) {
		const phoneNumber = parsePhoneNumber(number)
		return phoneNumber.formatInternational()
	})

	eleventyConfig.addFilter('hasPhoneNumber', function(card) {
		return !(card.data.tel === null)
	})

	return {
		dir: {
			input: "src",
			output: "public"
		}
	}
}