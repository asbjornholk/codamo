var carousels = document.querySelectorAll('.carousel');

var flickities = []

for (const carousel of carousels) {
	var flickity = new Flickity (carousel, {
		pageDots: false,
		groupCells: true
	})
	flickities.push(flickity)
}