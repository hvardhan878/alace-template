import type { Express } from "express";
import { createServer, type Server } from "http";
import { db, initializeDatabase } from "./db";
import { users, insertUserSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database
  initializeDatabase();

  // Get all users
  app.get('/api/users', async (req, res) => {
    try {
      const allUsers = db.select().from(users).all();
      res.json({
        status: 200,
        data: allUsers,
        message: 'Users retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({
        status: 500,
        message: 'Error retrieving users'
      });
    }
  });

  // Get a user by ID
  app.get('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = db.select().from(users).where(eq(users.id, id)).get();

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found'
        });
      }

      res.json({
        status: 200,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({
        status: 500,
        message: 'Error retrieving user'
      });
    }
  });

  // Create a new user
  app.post('/api/users', async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          status: 400,
          message: 'Invalid request body',
          errors: validationResult.error.format()
        });
      }

      const { name, email } = validationResult.data;

      // Check if email already exists
      const existingUser = db.select().from(users).where(eq(users.email, email)).get();
      if (existingUser) {
        return res.status(409).json({
          status: 409,
          message: 'Email already exists'
        });
      }

      // Create user
      const result = db.insert(users).values({
        name,
        email
      }).run();

      // Get the newly created user
      const newUser = db.select().from(users).where(eq(users.id, result.lastInsertRowid)).get();

      res.status(201).json({
        status: 201,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        status: 500,
        message: 'Error creating user'
      });
    }
  });

  // Update a user
  app.put('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if user exists
      const existingUser = db.select().from(users).where(eq(users.id, id)).get();
      if (!existingUser) {
        return res.status(404).json({
          status: 404,
          message: 'User not found'
        });
      }

      // Validate request body
      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          status: 400,
          message: 'Invalid request body',
          errors: validationResult.error.format()
        });
      }

      const { name, email } = validationResult.data;

      // Check if email is taken by another user
      if (email !== existingUser.email) {
        const emailExists = db.select().from(users).where(eq(users.email, email)).get();
        if (emailExists) {
          return res.status(409).json({
            status: 409,
            message: 'Email already exists'
          });
        }
      }

      // Update user
      db.update(users)
        .set({
          name,
          email
        })
        .where(eq(users.id, id))
        .run();

      // Get the updated user
      const updatedUser = db.select().from(users).where(eq(users.id, id)).get();

      res.json({
        status: 200,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        status: 500,
        message: 'Error updating user'
      });
    }
  });

  // Delete a user
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if user exists
      const existingUser = db.select().from(users).where(eq(users.id, id)).get();
      if (!existingUser) {
        return res.status(404).json({
          status: 404,
          message: 'User not found'
        });
      }

      // Delete user
      db.delete(users).where(eq(users.id, id)).run();

      res.json({
        status: 200,
        data: existingUser,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        status: 500,
        message: 'Error deleting user'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
