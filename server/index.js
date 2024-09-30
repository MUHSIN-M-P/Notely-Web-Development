import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import cookieParser from "cookie-parser";

const app = express();
const saltRounds = 10;
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || "0000";

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
// informing CORS to allow data from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000", // frontend's address
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Notely",
  password: "1234",
  port: "5432",
});
db.connect();

// check whether user have logged in to protect from going to other routes, by this you need JWT token for every request.

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }

    req.user = decoded; // Attach decoded user info (e.g., email) to req.user
    next();
  });
};



app.get("/auth/check-session", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const token = req.cookies.token;
  if (!token) {
    return res
      .status(200)
      .json({ isLoggedIn: false, message: "No token found" });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "Invalid token" });
    }

    // Token is valid
    return [res.status(200).json({ isLoggedIn: true, user: decoded.user })];
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //Find user by email
  try {
    const result = await db.query("SELECT * FROM users WHERE email =$1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;
      //there is no need of converting user entered password into hashed version to compare in bcrypt
      bcrypt.compare(password, storedPassword, (err, result) => {
        if (err) {
          console.log("Error in bcrypt compare", err);
        } else {
          if (result) {
            //create JWT
            const token = jwt.sign(
              { userId: user.id, email: user.email },
              SECRET_KEY,
              { expiresIn: "168h" }
            );
            // expire time of a token

            //set the token in HTTP only cookie
            // max age for cookie . after the JWT token expires, even if the cookie persists, the user will need to re-authenticate.
            res.cookie('token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'Strict',
              path: '/',
              maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
            });
            
            return [res.json({ message: "Login successful", token })];
          } else {
            return res.status(400).json({ message: "Invalid password" });
          }
        }
      });
    }else{
      return res.json({message: 'User not found, try Sign up.'})
    }
  } catch (err) {
    console.log("server error in login", err);
  }
});

app.post("/signup", async (req, res) => {
  const { fName, lName, email, password } = req.body;
  const username = fName + " " + lName;
  try {


    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error in bcrypt hashing", err);
        } else {
          // Push the new user into the db
          const avatar_img = 'user'
          const result = await db.query(
            "INSERT INTO users (username,email,password,avatar_img) VALUES ($1,$2,$3,$4)",
            [username, email, hash,avatar_img]
          );
          console.log(result);
          if (result.rows.length > 0) {
            user = result.rows[0]; // user is the first (and only) row from the query result
          }
          // Create JWT
          const token = jwt.sign(
            { userId: user.id, email: user.email },
            SECRET_KEY,
            { expiresIn: "1h" }
          );

          // Set the token in HTTP-only cookie
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
          });

          return res.json({ message: "Signup successful", token });
        }
      });
    }
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// getting notes
app.get("/home", authMiddleware, async (req, res) => {
  const userEmail = req.user.email; // Get user's email from JWT token

  try {
    // Query to join users and notes tables and retrieve all relevant fields
    const notesResult = await db.query(
      `SELECT notes.id, notes.user_id, notes.content, notes.color, notes.updated_at, notes.reminder ,notes.pinned
       FROM notes 
       INNER JOIN users ON users.id = notes.user_id 
       WHERE users.email = $1`,
      [userEmail]
    );

    if (notesResult.rows.length > 0) {
      res.json({ notes: notesResult.rows });
    } else {
      res.json({ message: "No notes found for this user." });
    }
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// storing notes

app.post("/home/create-note", authMiddleware, async (req, res) => {
  const { content, color = "white", reminder, time } = req.body;
  const userId = req.user.userId; // Get user ID from JWT token
  const createdAt = new Date()
    .toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .replace(",", "");

  try {
    const result = await db.query(
      `INSERT INTO notes (user_id, content, color, updated_at, reminder) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, content, color, createdAt, reminder]
    );

    return res.json({
      message: "Note saved successfully",
      note: result.rows[0],
    });
  } catch (err) {
    console.error("Error saving note:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/home/account',authMiddleware,async(req,res)=>{
  const email = req.user.email
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1",[email])
    if(result.rowCount>0){
      res.status(200).json({message:'data fetching about account successful',user:result.rows[0]})
    }else{
      res.status(404).json({message:'user not found'})
    }
  } catch (error) {
    res.status(500).json({message:'error in fetching data',error})
  }
})

app.post('/home/update-account', authMiddleware, async (req, res) => {
  const { userId } = req.user; // Assuming authMiddleware adds user info to req
  const { username, email, avatar_img, newPassword } = req.body;

  try {
    let updateFields = [];
    let queryParams = [];
    let queryCount = 1;

    // Build the update query dynamically based on changed fields
    if (username) {
      updateFields.push(`username = $${queryCount}`);
      queryParams.push(username);
      queryCount++;
    }

    if (email) {
      updateFields.push(`email = $${queryCount}`);
      queryParams.push(email);
      queryCount++;
    }

    if (avatar_img) {
      updateFields.push(`avatar_img = $${queryCount}`);
      queryParams.push(avatar_img);
      queryCount++;
    }

    if (newPassword) {
      // You should hash the password here before saving
      updateFields.push(`password = $${queryCount}`);
      const hashedPassword = await hashPassword(newPassword); // Create a hashPassword function
      queryParams.push(hashedPassword);
      queryCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No changes detected' });
    }

    // Build and run the query
    const query = `
    UPDATE users
    SET ${updateFields.join(', ')}
    WHERE id = $${queryParams.length + 1}`;
  queryParams.push(userId);
  
  // Use db.query here
  await db.query(query, queryParams);
  

    res.json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/home/edit/:id', async (req, res) => {
  const noteId = req.params.id;  // Note ID from the URL
  const { content, color = "white", reminder } = req.body;
  const updated_at = new Date()
    .toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .replace(",", "");
    
  try {
    const result = await db.query(
      `UPDATE notes 
       SET content = $1, color = $2, updated_at = $3, reminder = $4 
       WHERE id = $5 
       RETURNING *`,
      [content, color, updated_at, reminder, noteId]  // Correct order of parameters
    );
    
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Note updated successfully', note: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update note', err });
  }
});


app.get('/home/pin',authMiddleware,async(req,res)=>{
  const user_id = req.user.userId
  try {
    const result = await db.query('SELECT * FROM notes WHERE user_id=$1 AND pinned=$2',[user_id,true])
    if(result.rows.length>0){
        res.json({notes:result.rows})
      }else{
        res.json({message: "No pinned notes available"})
      }
  } catch (error) {
    res.status(500).json({message:'Failed to load pinned notes',error})
  }

})

app.put('/home/pin/:id',async(req,res)=>{
  const noteId = req.params.id;
  const {pin } = req.body
  const isPinned = Boolean(pin)
  try {
    const result = db.query(`UPDATE notes SET pinned = $1 WHERE id =$2 RETURNING *`,[!isPinned,noteId])
    if((await result).rowCount>0){
      res.status(200).json({message:'Note pinned successfully'})
    }else{
      res.status(404).json({message:'Note not found'})
    }
  } catch (error) {
    res.status(500).json({message:'Failed to pin Note',error})
  }
})

app.delete('/home/:id',authMiddleware, async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId; 
  try {
      // Start a transaction
      await db.query('BEGIN');

      const noteResult = await db.query(
          'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
          [noteId, userId]
      );
      const noteContent = noteResult.rows[0].content;
      const color = noteResult.rows[0].color;
      const updated_at = noteResult.rows[0].updated_at
      await db.query(
          'INSERT INTO bin (user_id, content,color,updated_at) VALUES ($1, $2,$3,$4)',
          [userId, noteContent,color,updated_at]
      );

      await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [noteId, userId]);

      // Commit the transaction
      await db.query('COMMIT');

      res.status(200).json({ message: 'Note moved to bin' });
  } catch (err) {
      await db.query('ROLLBACK');
      // The purpose of ROLLBACK in a transaction is to undo any changes made during the transaction if an error or issue occurs before the transaction is completed.
      res.status(500).json({ error: 'Failed to delete note' });
  }
});


app.delete('/home/bin/:id',async(req,res)=>{
  const noteId = req.params.id
  try{
    const result = await db.query(`DELETE FROM bin WHERE id = $1 RETURNING *`,[noteId])
    //, RETURNING * will return the entire record (all columns) that was just deleted.
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  }catch(err){
    res.status(500).json({messeage:'Failed to delete the note from Backend',err})
  }
})

app.put('/home/bin/:id',authMiddleware,async(req,res)=>{
  const noteId = req.params.id
  const userId = req.user.userId
  try {
    await db.query('BEGIN')
    const noteResult = await db.query('SELECT * FROM bin WHERE id=$1 AND user_id=$2',[noteId,userId])
    const noteContent = noteResult.rows[0].content;
    const color = noteResult.rows[0].color;
    const updated_at = noteResult.rows[0].updated_at;
    await db.query('INSERT INTO notes (user_id,content,color,updated_at) VALUES($1,$2,$3,$4)',[userId,noteContent,color,updated_at])

    await db.query('DELETE FROM bin WHERE id = $1 AND user_id= $2',[noteId,userId])

    await db.query('COMMIT');
    res.status(200).json({message:'Note Restores successfully'})

  } catch (error) {
    await db.query('ROLLBACK')
    res.status(500).json({message:'Failed to Restore Notes',error})
  }
})

app.get("/home/reminders", authMiddleware, async (req, res) => {
  const userEmail = req.user.email; // Get user's email from JWT token

  try {
    // Query to join users and notes tables and retrieve all relevant fields
    const notesResult = await db.query(
      `SELECT notes.id, notes.content, notes.color, notes.updated_at, notes.reminder
       FROM notes 
       INNER JOIN users ON users.id = notes.user_id 
       WHERE users.email = $1 AND notes.reminder IS NOT NULL`,
      [userEmail]
    );

    if (notesResult.rows.length > 0) {
      res.json({ notes: notesResult.rows });
    } else {
      res.json({ message: "No notes found for this user." });
    }
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/home/bin", authMiddleware, async (req, res) => {
  const userEmail = req.user.email; // Get user's email from JWT token

  try {
    // Query to join users and notes tables and retrieve all relevant fields
    const notesResult = await db.query(
      `SELECT bin.id, bin.content, bin.color, bin.updated_at
       FROM bin
       INNER JOIN users ON users.id = bin.user_id 
       WHERE users.email = $1 `,
      [userEmail]
    );

    if (notesResult.rows.length > 0) {
      res.json({ notes: notesResult.rows });
    } else {
      res.json({ message: "No notes found for this user." });
    }
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true });
  return res.json({ message: "Logout successful" });
});



app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
