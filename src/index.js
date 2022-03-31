class GameEngine {

  static Steps = ['up', 'down', 'left', 'right'];
  constructor () {
    this.cells = []
    this.score = 0
    this.over  = false
    this.won   = false
    this.callbacks = {}
  }

  start () {
    this.init()
  }

  restart () {
    this.init()
  }

  up () {
    let score = 0

    for (let rowIndex = 12; rowIndex < 16; rowIndex++) {
      let index = rowIndex

      for (let columnIndex = rowIndex - 4; columnIndex >= rowIndex - 12; columnIndex -= 4) {
        let rowValue = this.cells[index]
        let colValue = this.cells[columnIndex]

        if (colValue === 0) {
          this.cells[index] = 0
          this.cells[columnIndex] = rowValue
        } else if (rowValue === colValue) {
          this.cells[index] = 0
          this.cells[columnIndex] = rowValue + colValue
          score += rowValue
          if (this.cells[columnIndex] === 2048) {
            this.won = true
            this.callbacks['won'] && this.callbacks['won']()
          }

          if (columnIndex > rowIndex - 12 && this.cells[columnIndex - 4] === this.cells[columnIndex]) break
        }

        index = columnIndex
      }
    }

    if (score !== 0) this.addScore(score)
  }

  down () {
    let score = 0

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      let index = rowIndex

      for (let columnIndex = rowIndex + 4; columnIndex <= rowIndex + 12; columnIndex += 4) {
        let rowValue = this.cells[index]
        let colValue = this.cells[columnIndex]

        if (colValue === 0) {
          this.cells[index] = 0
          this.cells[columnIndex] = rowValue
        } else if (rowValue === colValue) {
          this.cells[index] = 0
          this.cells[columnIndex] = rowValue + colValue
          score += rowValue

          if (this.cells[columnIndex] === 2048) {
            this.won = true
            this.callbacks['won'] && this.callbacks['won']()
          }

          if (columnIndex < rowIndex + 12 && this.cells[columnIndex + 4] === this.cells[columnIndex]) break
        }

        index = columnIndex
      }
    }

    if (score !== 0) this.addScore(score)
  }

  left () {
    let score = 0

    for (let columnIndex = 3; columnIndex <= 15; columnIndex += 4) {
      let index = columnIndex

      for (let rowIndex = columnIndex - 1; rowIndex >= columnIndex - 3; rowIndex--) {
        let columnValue = this.cells[index]
        let rowValue = this.cells[rowIndex]

        if (rowValue === 0) {
          this.cells[index] = 0
          this.cells[rowIndex] = columnValue
        } else if (columnValue === rowValue) {
          this.cells[index] = 0
          this.cells[rowIndex] = columnValue + rowValue
          score += columnValue

          if (this.cells[rowIndex] === 2048) {
            this.won = true
            this.callbacks['won'] && this.callbacks['won']()
          }

          if (rowIndex < columnIndex - 3 && this.cells[rowIndex - 1] === this.cells[rowIndex]) break
        }

        index = rowIndex
      }
    }

    if (score !== 0) this.addScore(score)
  }

  right () {
    let score = 0

    for (let columnIndex = 0; columnIndex <= 12; columnIndex += 4) {
      let index = columnIndex

      for (let rowIndex = columnIndex + 1; rowIndex <= columnIndex + 3; rowIndex++) {
        let columnValue = this.cells[index]
        let rowValue = this.cells[rowIndex]

        if (rowValue === 0) {
          this.cells[index] = 0
          this.cells[rowIndex] = columnValue
        } else if (columnValue === rowValue) {
          this.cells[index] = 0
          this.cells[rowIndex] = columnValue + rowValue
          score += columnValue

          if (this.cells[rowIndex] === 2048) {
            this.won = true
            this.callbacks['won'] && this.callbacks['won']()
          }

          if (rowIndex < columnIndex + 3 && this.cells[rowIndex + 1] === this.cells[rowIndex]) break
        }

        index = rowIndex
      }
    }

    if (score !== 0) this.addScore(score)
  }

  dispatch (step) {
    switch (step) {
      case "up":
        this.up()
        return true
      case "down":
        this.down()
        return true
      case "left":
        this.left()
        return true
      case "right":
        this.right()
        return true
      default:
        return false
    }
  }

  respond (step) {
    if (!this.over && !this.won && this.dispatch(step)) {
      this.generateBlock()
      this.checkOver()
      return true
    }

    return false
  }

  addCallback (event, callback) {
    this.callbacks[event] = callback
  }

  removeCallback (event) {
    delete this.callbacks[event]
  }

  init () {
    this.cells = Array(16).fill(0)
    Array(2).fill(null).forEach(this.generateBlock.bind(this))
    this.score = 0
    this.won = false
    this.over = false
  }

  checkOver () {
    let emptyCells = this.cells.filter(cell => cell === 0).length; 
    if ( emptyCells > 1) { return; } 

    for (let i = 0; i < Game.Steps.length; i++) {
      const cells = this.cells.slice()

      this.dispatch(Game.Steps[i])

      if (this.hasEmptyCell()) {
        this.cells = cells
        return false
      }

      this.cells = cells
    }

    this.over = true
    this.callbacks['over'] && this.callbacks['over']()
    return true
  }

  addScore (score) {
    this.score = this.score + score

    this.callbacks['addScore'] && this.callbacks['addScore'](score)
  }

  hasEmptyCell () {
    return this.cells.filter(cell => cell === 0).length !== 0
  }

  generateBlock (){
    while (this.hasEmptyCell()) {
      const randomIndex = Math.floor(Math.random() * 16)

      if (this.cells[randomIndex] === 0) {
        if (Math.random() < 0.5) {
          this.cells[randomIndex] = 2
        } else {
          this.cells[randomIndex] = 4
        }
        break
      }
    }
  }
}

export default new GameEngine();