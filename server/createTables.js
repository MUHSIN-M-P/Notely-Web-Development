import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar_img VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        color VARCHAR(50) DEFAULT 'white',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reminder TIMESTAMP,
        pinned BOOLEAN DEFAULT FALSE
      );
      
      CREATE TABLE IF NOT EXISTS bin (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        color VARCHAR(50) DEFAULT 'white',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create function to insert default note for new users
      CREATE OR REPLACE FUNCTION create_default_note()
      RETURNS TRIGGER AS $$
      DECLARE
        default_content TEXT;
      BEGIN
        default_content := '<h2>🗓️ To-Do</h2>
<p><input type="checkbox"> Buy groceries</p>
<p><input type="checkbox"> Complete project report</p>
<p><input type="checkbox"> Call dentist for appointment</p>
<p><input type="checkbox"> Exercise for 30 minutes</p>
<p><input type="checkbox"> Read a chapter of a book</p>
<p><input type="checkbox"> Plan weekend activities</p>';

        INSERT INTO notes (user_id, content, color, pinned)
        VALUES (NEW.id, default_content, '#3d93f5cc', true);

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Drop trigger if exists and create new one
      DROP TRIGGER IF EXISTS trigger_create_default_note ON users;
      
      CREATE TRIGGER trigger_create_default_note
      AFTER INSERT ON users
      FOR EACH ROW
      EXECUTE FUNCTION create_default_note();
    `);

    console.log("Tables and triggers created successfully!");
    db.end();
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

createTables();
