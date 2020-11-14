/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      if (!puzzle|| !coordinate || !value) {
          return res.json({ error: 'Required field(s) missing'});
      }
      let [validPuzzle, errorPuzzle] = solver.validate(puzzle);
      if (!validPuzzle) {
        return res.json({error: errorPuzzle});
      }

      if (!/^[ABCDEFGHI]{1}\d{1}$/.test(coordinate)) {
          return res.json({ error: 'Invalid coordinate'});
      }
      if (!/^\d{1}$/.test(value)) {
          return res.json({ error: 'Invalid value'});
      }
      let [valid, conflict] = solver.validateCoord(puzzle, coordinate, value)
      if (!valid) {
         return res.json({valid:false, conflict: conflict});
      }
      return res.json({valid:true});

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.json({ error: 'Required field missing'})
      }
      let [valid, error] = solver.validate(puzzle);
      if (!valid) {
        return res.json({error: error});
      }
      let [success,solution] = solver.solve(puzzle);
      if (success) {
        return res.json({solution: solution});
      } else {
        return res.json({ error: 'Puzzle cannot be solved' })
      }

    });
};
