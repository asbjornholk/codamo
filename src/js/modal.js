openModal = function(modal_id) {
	var modal = document.getElementById(modal_id)
	modal.showModal()
	for (const flickity of flickities) {
		flickity.resize()
	}
}

closeModal = function(modal_id) {
	var modal = document.getElementById(modal_id)
		
	modal.setAttribute("closing", true)

	modal.addEventListener(
		"animationend",
		() => {
			modal.removeAttribute("closing")
			modal.close()
		},
		{ once: true }
	)
}

document.addEventListener("click", (e) => {
	target = e.target
	if (target.className == "modal") {
		closeModal(target.id)
	}
})
