import pool from "../connection/Pool";

export const getTodos = async (req, res) => {
  try {
    const todos = await pool.query(`SELECT * FROM todos WHERE user_id = $1`, [
      req.userId,
    ]);
    res.json(todos.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todo = await pool.query(
      `INSERT INTO todos (user_id,title) VALUES ($1,$2) RETURNING *`,
      [req.userId, title]
    );

    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { completed } = req.body;
    const { id } = req.params;
    const todo = await pool.query(
      `UPDATE todos SET completed=$1 WHERE id=$2 AND user_id=$3 RETURNING *`,
      [completed, id, req.userId]
    );
    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(
      "DELETE FROM todos WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, req.userId]
    );
    if (todo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
