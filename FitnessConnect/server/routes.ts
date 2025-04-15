import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertWorkoutPlanSchema, 
  insertNutritionPlanSchema, 
  insertConnectionSchema,
  insertRatingSchema,
  insertMessageSchema,
  insertProductSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Error handler for validation errors
  const handleZodError = (error: ZodError, res: Response) => {
    return res.status(400).json({ 
      message: "Validation error", 
      errors: error.errors 
    });
  };

  // API Routes
  // Trainers
  app.get("/api/trainers", async (req, res) => {
    try {
      const trainers = await storage.getAllTrainers();
      res.json(trainers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trainers" });
    }
  });

  app.get("/api/trainers/:id", async (req, res) => {
    try {
      const trainer = await storage.getTrainerById(Number(req.params.id));
      if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
      }
      res.json(trainer);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trainer" });
    }
  });

  app.put("/api/protected/trainer-profile/:id", async (req, res) => {
    try {
      if (req.user?.id !== Number(req.params.id) && req.user?.role !== "trainer") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const profile = await storage.updateTrainerProfile(Number(req.params.id), req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error updating trainer profile" });
    }
  });

  // Workout Plans
  app.get("/api/workout-plans", async (req, res) => {
    try {
      const workoutPlans = await storage.getAllWorkoutPlans();
      res.json(workoutPlans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workout plans" });
    }
  });

  app.get("/api/workout-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getWorkoutPlanById(Number(req.params.id));
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workout plan" });
    }
  });

  app.get("/api/trainers/:id/workout-plans", async (req, res) => {
    try {
      const plans = await storage.getWorkoutPlansByTrainer(Number(req.params.id));
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trainer's workout plans" });
    }
  });

  app.post("/api/trainer/workout-plans", async (req, res) => {
    try {
      const validatedData = insertWorkoutPlanSchema.parse({
        ...req.body,
        trainerId: req.user?.id
      });
      
      const plan = await storage.createWorkoutPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Error creating workout plan" });
    }
  });

  // Nutrition Plans
  app.get("/api/nutrition-plans", async (req, res) => {
    try {
      const nutritionPlans = await storage.getAllNutritionPlans();
      res.json(nutritionPlans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching nutrition plans" });
    }
  });

  app.get("/api/nutrition-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getNutritionPlanById(Number(req.params.id));
      if (!plan) {
        return res.status(404).json({ message: "Nutrition plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Error fetching nutrition plan" });
    }
  });

  app.get("/api/trainers/:id/nutrition-plans", async (req, res) => {
    try {
      const plans = await storage.getNutritionPlansByTrainer(Number(req.params.id));
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trainer's nutrition plans" });
    }
  });

  app.post("/api/trainer/nutrition-plans", async (req, res) => {
    try {
      const validatedData = insertNutritionPlanSchema.parse({
        ...req.body,
        trainerId: req.user?.id
      });
      
      const plan = await storage.createNutritionPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Error creating nutrition plan" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.post("/api/protected/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });

  // Connections
  app.get("/api/protected/connections/athlete", async (req, res) => {
    try {
      const connections = await storage.getAthleteConnections(req.user!.id);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Error fetching athlete connections" });
    }
  });

  app.get("/api/protected/connections/trainer", async (req, res) => {
    try {
      const connections = await storage.getTrainerConnections(req.user!.id);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trainer connections" });
    }
  });

  app.post("/api/protected/connections", async (req, res) => {
    try {
      // Ensure the athlete making the request is the one in the connection
      if (req.user?.role !== "athlete") {
        return res.status(403).json({ message: "Only athletes can request connections" });
      }

      const validatedData = insertConnectionSchema.parse({
        ...req.body,
        athleteId: req.user.id,
      });
      
      const connection = await storage.createConnection(validatedData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Error creating connection" });
    }
  });

  app.put("/api/protected/connections/:id", async (req, res) => {
    try {
      const connectionId = Number(req.params.id);
      const connection = await storage.getConnectionById(connectionId);
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }
      
      // Only the trainer can update the connection status
      if (req.user?.id !== connection.trainerId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updatedConnection = await storage.updateConnectionStatus(
        connectionId, 
        req.body.status
      );
      
      res.json(updatedConnection);
    } catch (error) {
      res.status(500).json({ message: "Error updating connection" });
    }
  });

  // Ratings
  app.get("/api/trainers/:id/ratings", async (req, res) => {
    try {
      const ratings = await storage.getTrainerRatings(Number(req.params.id));
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trainer ratings" });
    }
  });

  app.post("/api/protected/ratings", async (req, res) => {
    try {
      // Ensure the athlete making the request is the one giving the rating
      if (req.user?.role !== "athlete") {
        return res.status(403).json({ message: "Only athletes can rate trainers" });
      }

      const validatedData = insertRatingSchema.parse({
        ...req.body,
        athleteId: req.user.id,
      });
      
      const rating = await storage.createRating(validatedData);
      res.status(201).json(rating);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Error creating rating" });
    }
  });

  // Messages
  app.get("/api/protected/messages/:userId", async (req, res) => {
    try {
      const messages = await storage.getConversation(
        req.user!.id, 
        Number(req.params.userId)
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.post("/api/protected/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user!.id,
      });
      
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Error sending message" });
    }
  });

  app.put("/api/protected/messages/read/:userId", async (req, res) => {
    try {
      await storage.markMessagesAsRead(Number(req.params.userId), req.user!.id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error marking messages as read" });
    }
  });

  // Profile
  app.put("/api/protected/profile", async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(req.user!.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
