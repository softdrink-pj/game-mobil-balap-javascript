let myCar
let myRoad
let myObstacles = []
let myScore

function startGame() {
    myGameArea.start()

    myRoad = new component(216, 360, 'gray', 216, 0)
    myCar = new component(40, 72, 'img/redCar.png', 277, 270, 'image')
    myScore = new component('30px', 'Consolas', 'black', 440, 40, 'text')
}

let myGameArea = {
    canvas: document.getElementById('canvas'),
    start: function() {
        this.canvas.width = 640
        this.canvas.height = 360
        this.context = this.canvas.getContext('2d')
        this.frameNo = 0
        this.interval = setInterval(updateGameArea, 20)

        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || [])
            myGameArea.keys[e.key] = true
        })
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.key] = false
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    stop: function() {
        clearInterval(this.interval)
    }
}

function component(width, height, color, x, y, type) {
    this.width = width
    this.height = height
    this.color = color
    this.x = x
    this.y = y
    this.type = type

    if (this.type == 'image') {
        this.image = new Image()
        this.image.src = color
    }

    this.update = function() {
        ctx = myGameArea.context

        if (this.type == 'text') {
            ctx.font = this.width + ' ' + this.height
            ctx.fillStyle = color
            ctx.fillText(this.text, this.x, this.y)
        } else if (this.type == 'image') {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else {
            ctx.fillStyle = color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    this.crashWith = function(otherobj) {
        let myleft = this.x
        let myright = this.x + this.width
        let mytop = this.y
        let mybottom = this.y + this.height

        let otherleft = otherobj.x
        let otherright = otherobj.x + otherobj.width
        let othertop = otherobj.y
        let otherbottom = otherobj.y + otherobj.height

        let crash = true

        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false
        }

        return crash
    }
}

var myScoreText = 0

function updateGameArea() {
    for (i = 0; i < myObstacles.length; i++) {
        if (myCar.crashWith(myObstacles[i])) {
            myGameArea.stop()
        }
    }

    myGameArea.clear()
    myGameArea.frameNo++

    if (myGameArea.frameNo == 1 || everyinterval(60)) {
        myObstacleColor = ['greenCar', 'yellowCar', 'redCar', 'oil']
        myObstacleX = [223, 277, 331, 385]
        
        color = myObstacleColor[Math.floor(Math.random() * myObstacleColor.length)]
        x = myObstacleX[Math.floor(Math.random() * myObstacleX.length)]

        myObstacles.push(new component(40, 72, 'img/' + color + '.png', x, -80, 'image'))
    }

    if ((myGameArea.keys && myGameArea.keys['a']) && myCar.x > 216) { myCar.x -= 4 }
    if ((myGameArea.keys && myGameArea.keys['d']) && myCar.x < 392) { myCar.x += 4 }
    
    myRoad.update()

    for (i = 0; i < myObstacles.length; i++) {
        if (myObstacles[i].y == 344) {
            if (myObstacles[i].color == 'img/greenCar.png') {
                myScoreText += 50
            } else if (myObstacles[i].color == 'img/yellowCar.png') {
                myScoreText += 100
            } else if (myObstacles[i].color == 'img/redCar.png') {
                myScoreText += 150
            } else if (myObstacles[i].color == 'img/oil.png') {
                myScoreText += 200
            } else {
                myScoreText += 1
                console.log(myObstacles[i].color)
            }
        }
    }
        
    for (i = 0; i < myObstacles.length; i++) {
        myObstacles[i].y += 4
        myObstacles[i].update()
    }

    myCar.update()

    myScore.text = 'Score : ' + myScoreText
    myScore.update()
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true
    }

    return false
}
