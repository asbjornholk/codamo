const canvas = document.getElementById("particles")
const context = canvas.getContext("2d")
// canvas.width = window.innerWidth
// canvas.height = window.innerHeight

function boxMuller () {
	let u = Math.random()
	let v = Math.random()
	let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

	return z
}

class Particle {
	constructor(x, y, size, color, theta, sigma, dt) {
		this.x = x
		this.y = y
		this.size = size
		this.color = color
		this.theta = theta
		this.sigma = sigma
		this.dt = dt

		this.update = function () {
			let z = boxMuller()
			this.y = this.y - this.theta * this.y * this.dt + this.sigma * z
		}
	}
}

class ParticleTrail {
	constructor(x, y, size, color, theta, sigma, dt, length) {
		this.length = length
		this.size = size
		this.color = color
		this.particle_trail = []
		this.dt = dt
		this.particle = new Particle(x, y, size, color, theta, sigma, dt)

		for (let i=0; i<length; i++) {
			this.particle_trail.push(this.particle.y)
		}

		this.update = function () {
			this.particle.update()
			this.particle_trail.push(this.particle.y)
			this.particle_trail.shift()
		}

		this.draw = function () {
			context.strokeStyle = this.color
			context.lineWidth = this.size
			context.beginPath()
			
			for (let i=0; i<length; i++) {
				let y = this.particle_trail.slice().reverse()[i]
				context.lineTo((i*this.dt)+canvas.width/2, y+canvas.height/2)
			}
			context.stroke()

			context.beginPath()
			for (let i=0; i<length; i++) {
				let y = this.particle_trail.slice().reverse()[i]
				context.lineTo(-(i*this.dt)+canvas.width/2, y+canvas.height/2)
			}
			context.stroke()

			// for (let i=0; i<length; i++) {
			// 	context.lineWidth = this.size - i/this.length
			// 	let y = this.particle_trail.slice().reverse()[i]
			// 	context.lineTo((i*this.dt)+canvas.width/2, y+canvas.height/2)
			// 	context.stroke()
			// }

			// context.beginPath()
			// context.lineWidth = this.size
			// for (let i=0; i<length; i++) {
			// 	context.lineWidth = this.size - i/this.length
			// 	let y = this.particle_trail.slice().reverse()[i]
			// 	context.lineTo(-(i*this.dt)+canvas.width/2, y+canvas.height/2)
			// 	context.stroke()
			// }


	}

		this.animate = function () {
			this.update()
			this.draw()
		}
	}
}

function Update () {
	// addEventListener("resize", (e) => {
	// 	canvas.width = window.innerWidth
	// 	canvas.height = window.innerHeight
	// })
	context.clearRect(0, 0, canvas.width, canvas.height)
	
	particles.forEach(p => {
		p.animate()
	});

	setTimeout(() => {
		requestAnimationFrame(Update)
	}, 1000 / fps)
	
}

let particles = []

// Hyperparameters //

const n = 3
const size = 1
const color = 'white'
const theta = 0.01
const sigma = 30
const dt = 3
const length = 100
const fps = 24

/////////////////////

for (let i=0; i < n; i++) {
	particles.push(new ParticleTrail(0, 0, size, color, theta, sigma, dt, length))
}

Update()