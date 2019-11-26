var router = require('express').Router();
var Todo = require('../../models/todo.model');

/* Todo CRUD */

// GET Todo List by author
router.get('/', async (req, res, next) => {
  const author = req.query.author ? req.query.author : req.user.username;
  try {
    const todoList = await Todo.find({
      author: author
    });
    res.json(todoList);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

// GET All Todo List
router.get('/all', (req, res, next) => {
  // GET All Todo
  Todo.find()
    .then(todoList => res.json(todoList))
    .catch(error => res.status(500).json(error));
});

// GET Todo by id
router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

// CREATE Todo
router.post('/', async (req, res) => {
  const title = req.body.title;
  const author = req.body.author ? req.body.author : req.user.username;
  const completed = req.body.completed ? req.body.completed : false;

  const todo = new Todo({
    title,
    author,
    completed
  });

  try {
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  }
  catch (error) {
    res.status(500).json(error);
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
      res.status(500).json(error);
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
    res.json(updatedTodo);
  }
  catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;