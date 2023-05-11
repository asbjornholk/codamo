const canvas = document.getElementById("particles")
const context = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function boxMuller (sd=1) {
	let u = Math.random()
	let v = Math.random()
	let z_1 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
	let z_2 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v)

	return [z_1 * sd, z_2 * sd]
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

		this.draw = function () {
			context.beginPath()
			context.fillStyle = this.color
			context.arc(this.x+canvas.width/2, this.y+canvas.height/2, this.size, 0, Math.PI * 2)
			context.fill()
		}

		this.update = function () {
			let z = boxMuller(1)
			this.x = this.x - this.theta * this.x * this.dt + this.sigma * z[0]
			this.y = this.y - this.theta * this.y * this.dt + this.sigma * z[1]
		}

		this.animate = function () {
			this.update()
			this.draw()
		}
	}
}

class ParticleTrail {
	constructor(x, y, size, color, theta, sigma, dt, length) {
		this.length = length
		this.size = size
		this.color = color
		this.particle_trail = []
		this.particle = new Particle(x, y, size, color, theta, sigma, dt)

		for (let i=0; i<length; i++) {
			this.particle_trail.push([this.particle.x, this.particle.y])
		}

		this.update = function () {
			this.particle.update()
			this.particle_trail.push([this.particle.x, this.particle.y])
			this.particle_trail.shift()
		}

		this.draw = function () {
			context.beginPath()
			context.lineWidth = this.size
			context.strokeStyle = this.color
			this.particle_trail.slice().reverse().forEach(point => {
				context.lineWidth -= this.size / this.length
				context.lineTo(point[0]+canvas.width/2, point[1]+canvas.height/2)
				context.stroke()
			});
		}

		this.animate = function () {
			this.update()
			this.draw()
		}
	}
}

function Update () {
	addEventListener("resize", (e) => {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
	})
	context.clearRect(0, 0, canvas.width, canvas.height)
	
	particles.forEach(p => {
		p.animate()
	});

	requestAnimationFrame(Update)
}

let particles = []

// Hyperparameters //

let n = 50
let size = 0.1
let color = 'tomato'
let theta = 0.00001
let sigma = 3
let dt = 1
let length = 100

/////////////////////

for (let i=0; i < n; i++) {
	particles.push(new ParticleTrail(0, 0, size, color, theta, sigma, dt, length))
}

Update()