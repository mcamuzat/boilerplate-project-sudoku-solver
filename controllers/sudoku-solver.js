class SudokuSolver {

  validate(puzzleString) {
    if(!/^[0-9.]*$/.test(puzzleString)) {
      return [false, 'Invalid characters in puzzle'];
    }
    if(puzzleString.length !== 81) {
      return [false, 'Expected puzzle to be 81 characters long'];
    }

    return [true, null];
  }

  validateCoord(puzzleString, coord, value) 
  {
    let [column, row] = coord.split('');
    column = ['A','B','C','D','E','F','G','H','I'].indexOf(column);
    row = row-1;
    let conflict = ['row','column','region'];
    if (this.checkRowPlacement(puzzleString, row, column, value)) {
       var index = conflict.indexOf('row');
       conflict.splice(index, 1);
    }
    if (this.checkColPlacement(puzzleString, row, column, value)) {
      var index = conflict.indexOf('column');
      conflict.splice(index, 1);
    }
    if (this.checkRegionPlacement(puzzleString, row, column, value)) {
        var index = conflict.indexOf('region');
        conflict.splice(index, 1);
    }
    if (conflict.length == 0) {
      return [true, []]
    }
    
    return [false, conflict];
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[column*9+i] == value) {
          return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[i*9+row] == value) {
          return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(column / 3) + i % 3;
      if (puzzleString[n*9+m] == value) {
          return false;
      }
    }
    return true
  }

  isValid(puzzleString, row, col, value) {
    return this.checkRowPlacement(puzzleString, row, col, value) &&
           this.checkColPlacement(puzzleString, row, col, value) &&
           this.checkRegionPlacement(puzzleString, row, col, value);
  }

  solve(puzzleString) {
    for (let col = 0;  col< 9; col++) {
      for (let row = 0; row < 9; row++) {
        if (puzzleString[9*col+row] === '.') {
          for (let k = 1; k <= 9; k++) {
            if (this.isValid(puzzleString, row, col, k)) {
              puzzleString = puzzleString.split('');
              puzzleString[9*col+row] = k;
              puzzleString = puzzleString.join('');
              let [success, data] = this.solve(puzzleString);
              if (success) {
                  return [true, data];
              } else {
                puzzleString = puzzleString.split('');
                puzzleString[9*col+row] = '.';
                puzzleString = puzzleString.join('');
              }
            }
          }
          return [false, puzzleString];
        }
      }
    }
  
    for (let col = 0;  col< 9; col++) {
      for (let row = 0; row < 9; row++) {
        let value = puzzleString[9*col+row];
        let s = puzzleString.split('');
        s[9*col+row] = '.';
        s = s.join('');
        if (!this.isValid(s, row, col, value)) {
          return [false, puzzleString];
        }       
      }
    }

    return [true,puzzleString];
  }
}

module.exports = SudokuSolver;

