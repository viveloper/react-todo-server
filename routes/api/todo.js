var router = require('express').Router();
var Todo = require('../../models/todo.model');

/* Todo CRUD */

// GET Todo List by author
router.get('/', async (req, res, next) => {
  const author = req.query.author ? req.query.author : req.user.username;
  const todoList = await Todo.find({
    author: author
  });
  res.json(todoList);
});

// GET All Todo List
router.get('/all', (req, res, next) => {
  // GET All Todo
  Todo.find()
    .then(todoList => res.json(todoList))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET Todo by id
router.get('/:id', async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);
  res.json(todo);
});

// CREATE Todo
router.post('/', async (req, res) => {
  const title = req.body.title;
  const author = req.body.author ? req.body.author : req.user.username;
  const completed = req.body.completed;

  const todo = new Todo({
    title,
    author,
    completed
  });

  try {
    const savedTodo = await todo.save();
    res.status(201).json({
      success: true,
      message: 'Todo added.',
      todo: savedTodo
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to add todo.'
    });
  }
});

//  DELETE Todo
router.delete('/:id', (req, res) => {
  Todo.findByIdAndDelete(req.params.id)
    .then(() => res.json({
      success: true,
      message: 'Todo deleted.'
    }))
    .catch(error => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete todo.'
      })
    });
});

// UPDATE Todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.title = req.body.title;
    todo.author = req.body.author ? req.body.author : req.user.username;;
    todo.completed = req.body.completed;

    const updatedTodo = await todo.save();
    res.json({
      success: true,
      message: 'Todo updated.'
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update todo.'
    });
  }
});

module.exports = router;