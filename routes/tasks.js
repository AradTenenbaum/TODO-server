const router = require("express").Router();
const jwt = require('jsonwebtoken');

const {TOKEN_SECRET} = require('../config');
const db = require("../pgdb");
const Task = require("../models/Task");
const verify = require("./verifyToken");
const { UNDONE, DONE } = require("../constants/todoStatus");

// Get user tasks
router.get("/tasks", verify, async (req, res) => {
  // Get the username
  const {username} = jwt.verify(req.header('auth-token'), TOKEN_SECRET);
  try {
    const { rows } = await db.query("SELECT * FROM tasks WHERE username = $1", [
      username,
    ]);
    if (rows.length === 0) {
      const tasks = await Task.find({ username: username });
      if (!tasks) res.send([]);
    }
    res.send(rows);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add new task
router.post("/add", verify, async (req, res) => {
  // Save task to DB
  try {
    const {
      rows,
    } = await db.query(
      "INSERT INTO tasks VALUES(DEFAULT ,$1, $2, $3) RETURNING task_id",
      [req.body.username, req.body.text, UNDONE]
    );
    const task = new Task({
      ownId: rows[0].task_id || "",
      username: req.body.username,
      text: req.body.text,
    });
    const savedTask = await task.save();
    res.send({ task_id: rows[0].task_id });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Make a task Done\Undone
router.patch("/finish/:taskId", verify, async (req, res) => {
  const taskId = parseInt(req.params.taskId);
  try {
    // Get task
    const {
      rows: task,
    } = await db.query("SELECT * FROM tasks WHERE task_id = $1", [taskId]);

    if (task.length === 0) {
      task = await Task.findOne({ ownId: taskId });
    }
    if (!task) res.status(404).send("Task not found");
    // Update on PostgreSQL
    const {
      rows,
    } = await db.query("UPDATE tasks SET status = $1 WHERE task_id = $2", [
      (task.status || task[0].status) === DONE ? UNDONE : DONE,
      taskId,
    ]);
    // Update on MongoDB
    const changeTask = await Task.updateOne(
      { ownId: taskId },
      {
        $set: {
          status: (task.status || task[0].status) === DONE ? UNDONE : DONE,
        },
      }
    );
    res.send("Task changed ");
  } catch (error) {
    res.send(error);
  }
});

// Delete task
router.delete("/delete/:taskId", verify, async (req, res) => {
  try {
    const { rows } = await db.query("DELETE FROM tasks WHERE task_id = $1", [
      req.params.taskId,
    ]);
    const removedTask = await Task.deleteOne({ ownId: req.params.taskId });
    res.send("Task deleted successfully");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
