const PORT = process.env.PORT || 8000;
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');

app.use(cors());
app.use(express.json());

app.get('/todos/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail; 
    try {
        const todos = await pool.query("SELECT * FROM todos WHERE user_email = $1", [userEmail]);
        res.json(todos.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/todos', async (req, res) => {
    const { user_email, title, progress, date, category_id, priority } = req.body;
    const id = uuidv4();
    try {
        const newToDo = await pool.query(
            `INSERT INTO todos(id, user_email, title, progress, date, category_id, priority)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, user_email, title, progress, date, category_id, priority]
        );
        res.json(newToDo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.patch('/todos/setDaily/:id', async (req, res) => {
    const { id } = req.params;
    const { isDaily } = req.body;
    try {
        const result = await pool.query(
            'UPDATE todos SET is_daily = $1 WHERE id = $2 RETURNING *',
            [isDaily, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: `Task ${isDaily ? 'marked as' : 'unmarked from'} daily`, task: result.rows[0] });
    } catch (err) {
        console.error('Error toggling daily status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/categories', async (req, res) => {
    const { category_name, user_email } = req.body;

    try {
        const newCategory = await pool.query(
            `INSERT INTO categories(category_name, user_email) VALUES ($1, $2) RETURNING *`, 
            [category_name, user_email]
        );

        console.log('New category:', newCategory.rows[0]);

        res.json(newCategory.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/categories/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail; 

    try {
        const categories = await pool.query("SELECT * FROM categories WHERE user_email = $1", [userEmail]);
        res.json(categories.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/categories/:category_id', async (req, res) => {
    const { category_id } = req.params; 
    try {
        await pool.query('DELETE FROM categories WHERE category_id = $1', [category_id]);
        res.json({ success: true, message: "Category deleted successfully" });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { user_email, title, progress, date, category_id, priority } = req.body;
    try {
        const editTodo = await pool.query(
            `UPDATE todos 
            SET user_email = $1, title = $2, progress = $3, date = $4, category_id = $5, priority = $6 
            WHERE id = $7`,
            [user_email, title, progress, date, category_id, priority, id]
        );
        res.json(editTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteToDo =  await pool.query(`DELETE FROM todos WHERE id= $1`,[id]);
        res.json(deleteToDo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        const signup = await pool.query("INSERT INTO users (email, hashed_password) VALUES ($1, $2)", [email, hashedPassword]);
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

        res.json({ email, token });
    } catch (err) {
        console.log(err);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ detail: 'User not found' });
        }

        const hashedPassword = user.rows[0].hashed_password;
        const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ detail: 'Invalid password' });
        }

        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

        res.json({ email, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ detail: 'Internal server error' });
    }
});

cron.schedule('0 0 * * *', async () => {
    try {
            const today = new Date();
        const todayDate = today.toISOString();

        await pool.query('UPDATE todos SET progress = 0, due_date = $1 WHERE is_daily = TRUE', [today]);

        console.log('Daily tasks reset');
    } catch (error) {
        console.error('Error resetting daily tasks:', error);
    }
});



app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
