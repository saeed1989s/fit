import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["athlete", "trainer"] }).notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  specialties: text("specialties"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  bio: true,
  profileImage: true,
  specialties: true,
});

// Trainer profiles
export const trainerProfiles = pgTable("trainer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  yearsOfExperience: integer("years_of_experience"),
  certifications: text("certifications"),
  specialization: text("specialization"),
  pricePerSession: integer("price_per_session"),
  rating: integer("rating").default(0),
  ratingCount: integer("rating_count").default(0),
});

export const insertTrainerProfileSchema = createInsertSchema(trainerProfiles).pick({
  userId: true,
  yearsOfExperience: true,
  certifications: true,
  specialization: true,
  pricePerSession: true,
});

// Workout plans
export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in weeks
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  price: integer("price").notNull(), // in cents
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).pick({
  trainerId: true,
  title: true,
  description: true,
  duration: true,
  level: true,
  price: true,
  image: true,
});

// Nutrition plans
export const nutritionPlans = pgTable("nutrition_plans", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in weeks
  goal: text("goal", { enum: ["weight_loss", "muscle_gain", "maintenance"] }).notNull(),
  price: integer("price").notNull(), // in cents
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNutritionPlanSchema = createInsertSchema(nutritionPlans).pick({
  trainerId: true,
  title: true,
  description: true,
  duration: true,
  goal: true,
  price: true,
  image: true,
});

// Products for the shop
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  image: text("image"),
  category: text("category", { 
    enum: ["equipment", "apparel", "supplements", "accessories"] 
  }).notNull(),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  image: true,
  category: true,
  inStock: true,
});

// Trainer-athlete connections
export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => users.id),
  athleteId: integer("athlete_id").notNull().references(() => users.id),
  status: text("status", { 
    enum: ["pending", "accepted", "rejected"] 
  }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConnectionSchema = createInsertSchema(connections).pick({
  trainerId: true,
  athleteId: true,
  status: true,
});

// Trainer ratings
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  trainerId: integer("trainer_id").notNull().references(() => users.id),
  athleteId: integer("athlete_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRatingSchema = createInsertSchema(ratings).pick({
  trainerId: true,
  athleteId: true,
  rating: true,
  review: true,
});

// Messages between trainers and athletes
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TrainerProfile = typeof trainerProfiles.$inferSelect;
export type InsertTrainerProfile = z.infer<typeof insertTrainerProfileSchema>;

export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;

export type NutritionPlan = typeof nutritionPlans.$inferSelect;
export type InsertNutritionPlan = z.infer<typeof insertNutritionPlanSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Connection = typeof connections.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
