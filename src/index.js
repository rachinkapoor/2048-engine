class GameEngine {
  
  constructor () {
    const oThis = this;
    oThis.cells = []
    oThis.score = 0
    oThis.over  = false
    oThis.won   = false
    oThis.callbacks = {}
  }

  start() {
    const oThis = this;
    oThis.init()
  }

  restart() {
    const oThis = this;
    oThis.init()
  }

  up() {
    const oThis = this;
    let score = 0

    for (let rowIndex = 12; rowIndex < 16; rowIndex++) {
      let index = rowIndex

      for (let columnIndex = rowIndex - 4; columnIndex >= rowIndex - 12; columnIndex -= 4) {
        let rowValue = oThis.cells[index]
        let colValue = oThis.cells[columnIndex]

        if (colValue === 0) {
          oThis.cells[index] = 0
          oThis.cells[columnIndex] = rowValue
        } else if (rowValue === colValue) {
          oThis.cells[index] = 0
          oThis.cells[columnIndex] = rowValue + colValue
          score += rowValue
          if (oThis.cells[columnIndex] === 2048) {
            oThis.won = true
            oThis.callbacks['won'] && oThis.callbacks['won']()
          }

          if (columnIndex > rowIndex - 12 && oThis.cells[columnIndex - 4] === oThis.cells[columnIndex]) break
        }

        index = columnIndex
      }
    }

    if (score !== 0) {
      oThis.addScore(score);
    }
  }

  down() {
    const oThis = this;
    let score = 0

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      let index = rowIndex

      for (let columnIndex = rowIndex + 4; columnIndex <= rowIndex + 12; columnIndex += 4) {
        let rowValue = oThis.cells[index]
        let colValue = oThis.cells[columnIndex]

        if (colValue === 0) {
          oThis.cells[index] = 0
          oThis.cells[columnIndex] = rowValue
        } else if (rowValue === colValue) {
          oThis.cells[index] = 0
          oThis.cells[columnIndex] = rowValue + colValue
          score += rowValue

          if (oThis.cells[columnIndex] === 2048) {
            oThis.won = true
            oThis.callbacks['won'] && oThis.callbacks['won']()
          }

          if (columnIndex < rowIndex + 12 && oThis.cells[columnIndex + 4] === oThis.cells[columnIndex]) {
            break;
          }
        }
        index = columnIndex
      }
    }

    if (score !== 0) {
      oThis.addScore(score);
    }
  }

  left() {
    const oThis = this;
    let score = 0

    for (let columnIndex = 3; columnIndex <= 15; columnIndex += 4) {
      let index = columnIndex

      for (let rowIndex = columnIndex - 1; rowIndex >= columnIndex - 3; rowIndex--) {
        let columnValue = oThis.cells[index]
        let rowValue = oThis.cells[rowIndex]

        if (rowValue === 0) {
          oThis.cells[index] = 0
          oThis.cells[rowIndex] = columnValue
        } else if (columnValue === rowValue) {
          oThis.cells[index] = 0
          oThis.cells[rowIndex] = columnValue + rowValue
          score += columnValue

          if (this.cells[rowIndex] === 2048) {
            oThis.won = true
            oThis.callbacks['won'] && oThis.callbacks['won']()
          }

          if (rowIndex < columnIndex - 3 && oThis.cells[rowIndex - 1] === oThis.cells[rowIndex]) {
            break;
          }
        }
        index = rowIndex
      }
    }

    if (score !== 0) {
      oThis.addScore(score);
    }
}

  right() {
    const oThis = this;
    let score = 0;

    for (let columnIndex = 0; columnIndex <= 12; columnIndex += 4) {
      let index = columnIndex

      for (let rowIndex = columnIndex + 1; rowIndex <= columnIndex + 3; rowIndex++) {
        let columnValue = oThis.cells[index]
        let rowValue = oThis.cells[rowIndex]

        if (rowValue === 0) {
          oThis.cells[index] = 0
          oThis.cells[rowIndex] = columnValue
        } else if (columnValue === rowValue) {
          oThis.cells[index] = 0
          oThis.cells[rowIndex] = columnValue + rowValue
          score += columnValue

          if (oThis.cells[rowIndex] === 2048) {
            oThis.won = true
            oThis.callbacks['won'] && oThis.callbacks['won']()
          }

          if (rowIndex < columnIndex + 3 && oThis.cells[rowIndex + 1] === oThis.cells[rowIndex]) {
            break;
          }
        }

        index = rowIndex
      }
    }

    if (score !== 0) {
      oThis.addScore(score);
    }
  }

  dispatch (step) {
    const oThis = this;
    switch (step) {
      case "up":
        oThis.up()
        return true
      case "down":
        oThis.down()
        return true
      case "left":
        oThis.left()
        return true
      case "right":
        oThis.right()
        return true
      default:
        return false
    }
  }

  respond (step) {
    const oThis = this;
    if (!oThis.over && !oThis.won && oThis.dispatch(step)) {
      oThis.generateBlock();
      oThis.checkOver();
      return true
    }

    return false
  }

  addCallback (event, callback)  {
    const oThis = this;
    oThis.callbacks[event] = callback
  }

  removeCallback(event)  {
    const oThis = this;
    delete oThis.callbacks[event]
  }

   init ()  {
    const oThis = this;
    oThis.cells = Array(16).fill(0)
    Array(2).fill(null).forEach(oThis.generateBlock.bind(oThis))
    oThis.score = 0
    oThis.won = false
    oThis.over = false
  }

   checkOver() {
    const oThis = this;
    if (oThis.hasEmptyCell()) return false

    for (let i = 0; i < Game.Steps.length; i++) {
      const cells = oThis.cells.slice()

      oThis.dispatch(Game.Steps[i])

      if (oThis.hasEmptyCell()) {
        oThis.cells = cells
        return false
      }

      oThis.cells = cells
    }

    oThis.over = true
    oThis.callbacks['over'] && oThis.callbacks['over']()
    return true
  }

   addScore (score) {
    const oThis = this;
    oThis.score = oThis.score + score
    oThis.callbacks['addScore'] && oThis.callbacks['addScore'](score);
  }

   hasEmptyCell() {
    const oThis = this;
    return oThis.cells.filter(cell => cell === 0).length !== 0
  }

   generateBlock() {
    const oThis = this;
    while (oThis.hasEmptyCell()) {
      const randomIndex = Math.floor(Math.random() * 16);

      if (oThis.cells[randomIndex] === 0) {
        if (Math.random() < 0.5) {
          oThis.cells[randomIndex] = 2;
        } else {
          oThis.cells[randomIndex] = 4;
        }
        break;
      }
    }
  }
}

export default new GameEngine();