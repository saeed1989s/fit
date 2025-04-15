import { 
  User, InsertUser, 
  TrainerProfile, InsertTrainerProfile,
  WorkoutPlan, InsertWorkoutPlan,
  NutritionPlan, InsertNutritionPlan,
  Product, InsertProduct,
  Connection, InsertConnection,
  Rating, InsertRating,
  Message, InsertMessage
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  
  // Trainer profile operations
  getTrainerProfile(userId: number): Promise<TrainerProfile | undefined>;
  createTrainerProfile(profile: InsertTrainerProfile): Promise<TrainerProfile>;
  updateTrainerProfile(userId: number, profileData: Partial<TrainerProfile>): Promise<TrainerProfile>;
  getAllTrainers(): Promise<Array<User & { trainerProfile?: TrainerProfile }>>;
  getTrainerById(id: number): Promise<(User & { trainerProfile?: TrainerProfile }) | undefined>;
  
  // Workout plan operations
  getAllWorkoutPlans(): Promise<Array<WorkoutPlan & { trainer: User }>>;
  getWorkoutPlanById(id: number): Promise<(WorkoutPlan & { trainer: User }) | undefined>;
  getWorkoutPlansByTrainer(trainerId: number): Promise<WorkoutPlan[]>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  
  // Nutrition plan operations
  getAllNutritionPlans(): Promise<Array<NutritionPlan & { trainer: User }>>;
  getNutritionPlanById(id: number): Promise<(NutritionPlan & { trainer: User }) | undefined>;
  getNutritionPlansByTrainer(trainerId: number): Promise<NutritionPlan[]>;
  createNutritionPlan(plan: InsertNutritionPlan): Promise<NutritionPlan>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Connection operations
  getConnectionById(id: number): Promise<Connection | undefined>;
  getAthleteConnections(athleteId: number): Promise<Array<Connection & { trainer: User }>>;
  getTrainerConnections(trainerId: number): Promise<Array<Connection & { athlete: User }>>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnectionStatus(id: number, status: string): Promise<Connection>;
  
  // Rating operations
  getTrainerRatings(trainerId: number): Promise<Array<Rating & { athlete: User }>>;
  createRating(rating: InsertRating): Promise<Rating>;
  
  // Message operations
  getConversation(userId1: number, userId2: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(senderId: number, receiverId: number): Promise<void>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trainerProfiles: Map<number, TrainerProfile>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private nutritionPlans: Map<number, NutritionPlan>;
  private products: Map<number, Product>;
  private connections: Map<number, Connection>;
  private ratings: Map<number, Rating>;
  private messages: Map<number, Message>;
  
  sessionStore: session.SessionStore;
  
  private userId: number = 1;
  private trainerProfileId: number = 1;
  private workoutPlanId: number = 1;
  private nutritionPlanId: number = 1;
  private productId: number = 1;
  private connectionId: number = 1;
  private ratingId: number = 1;
  private messageId: number = 1;

  constructor() {
    this.users = new Map();
    this.trainerProfiles = new Map();
    this.workoutPlans = new Map();
    this.nutritionPlans = new Map();
    this.products = new Map();
    this.connections = new Map();
    this.ratings = new Map();
    this.messages = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Don't allow updating id, role, or password through this method
    const { id: _, role: __, password: ___, ...updateData } = userData;
    
    const updatedUser = {
      ...user,
      ...updateData,
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Trainer profile operations
  async getTrainerProfile(userId: number): Promise<TrainerProfile | undefined> {
    return Array.from(this.trainerProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createTrainerProfile(profile: InsertTrainerProfile): Promise<TrainerProfile> {
    const id = this.trainerProfileId++;
    const trainerProfile: TrainerProfile = { 
      ...profile, 
      id, 
      rating: 0,
      ratingCount: 0
    };
    this.trainerProfiles.set(id, trainerProfile);
    return trainerProfile;
  }

  async updateTrainerProfile(userId: number, profileData: Partial<TrainerProfile>): Promise<TrainerProfile> {
    const profile = await this.getTrainerProfile(userId);
    if (!profile) {
      throw new Error("Trainer profile not found");
    }
    
    // Don't allow updating id or userId
    const { id: _, userId: __, ...updateData } = profileData;
    
    const updatedProfile = {
      ...profile,
      ...updateData,
    };
    
    this.trainerProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async getAllTrainers(): Promise<Array<User & { trainerProfile?: TrainerProfile }>> {
    const trainers = Array.from(this.users.values())
      .filter((user) => user.role === "trainer");
    
    return Promise.all(
      trainers.map(async (trainer) => {
        const trainerProfile = await this.getTrainerProfile(trainer.id);
        return {
          ...trainer,
          trainerProfile,
        };
      })
    );
  }

  async getTrainerById(id: number): Promise<(User & { trainerProfile?: TrainerProfile }) | undefined> {
    const trainer = await this.getUser(id);
    if (!trainer || trainer.role !== "trainer") {
      return undefined;
    }
    
    const trainerProfile = await this.getTrainerProfile(id);
    return {
      ...trainer,
      trainerProfile,
    };
  }

  // Workout plan operations
  async getAllWorkoutPlans(): Promise<Array<WorkoutPlan & { trainer: User }>> {
    const plans = Array.from(this.workoutPlans.values());
    
    return Promise.all(
      plans.map(async (plan) => {
        const trainer = await this.getUser(plan.trainerId);
        if (!trainer) {
          throw new Error("Trainer not found for workout plan");
        }
        return {
          ...plan,
          trainer,
        };
      })
    );
  }

  async getWorkoutPlanById(id: number): Promise<(WorkoutPlan & { trainer: User }) | undefined> {
    const plan = this.workoutPlans.get(id);
    if (!plan) {
      return undefined;
    }
    
    const trainer = await this.getUser(plan.trainerId);
    if (!trainer) {
      throw new Error("Trainer not found for workout plan");
    }
    
    return {
      ...plan,
      trainer,
    };
  }

  async getWorkoutPlansByTrainer(trainerId: number): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values())
      .filter((plan) => plan.trainerId === trainerId);
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = this.workoutPlanId++;
    const createdAt = new Date();
    const workoutPlan: WorkoutPlan = { ...plan, id, createdAt };
    this.workoutPlans.set(id, workoutPlan);
    return workoutPlan;
  }

  // Nutrition plan operations
  async getAllNutritionPlans(): Promise<Array<NutritionPlan & { trainer: User }>> {
    const plans = Array.from(this.nutritionPlans.values());
    
    return Promise.all(
      plans.map(async (plan) => {
        const trainer = await this.getUser(plan.trainerId);
        if (!trainer) {
          throw new Error("Trainer not found for nutrition plan");
        }
        return {
          ...plan,
          trainer,
        };
      })
    );
  }

  async getNutritionPlanById(id: number): Promise<(NutritionPlan & { trainer: User }) | undefined> {
    const plan = this.nutritionPlans.get(id);
    if (!plan) {
      return undefined;
    }
    
    const trainer = await this.getUser(plan.trainerId);
    if (!trainer) {
      throw new Error("Trainer not found for nutrition plan");
    }
    
    return {
      ...plan,
      trainer,
    };
  }

  async getNutritionPlansByTrainer(trainerId: number): Promise<NutritionPlan[]> {
    return Array.from(this.nutritionPlans.values())
      .filter((plan) => plan.trainerId === trainerId);
  }

  async createNutritionPlan(plan: InsertNutritionPlan): Promise<NutritionPlan> {
    const id = this.nutritionPlanId++;
    const createdAt = new Date();
    const nutritionPlan: NutritionPlan = { ...plan, id, createdAt };
    this.nutritionPlans.set(id, nutritionPlan);
    return nutritionPlan;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const createdAt = new Date();
    const newProduct: Product = { ...product, id, createdAt };
    this.products.set(id, newProduct);
    return newProduct;
  }

  // Connection operations
  async getConnectionById(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async getAthleteConnections(athleteId: number): Promise<Array<Connection & { trainer: User }>> {
    const connections = Array.from(this.connections.values())
      .filter((conn) => conn.athleteId === athleteId);
    
    return Promise.all(
      connections.map(async (connection) => {
        const trainer = await this.getUser(connection.trainerId);
        if (!trainer) {
          throw new Error("Trainer not found for connection");
        }
        return {
          ...connection,
          trainer,
        };
      })
    );
  }

  async getTrainerConnections(trainerId: number): Promise<Array<Connection & { athlete: User }>> {
    const connections = Array.from(this.connections.values())
      .filter((conn) => conn.trainerId === trainerId);
    
    return Promise.all(
      connections.map(async (connection) => {
        const athlete = await this.getUser(connection.athleteId);
        if (!athlete) {
          throw new Error("Athlete not found for connection");
        }
        return {
          ...connection,
          athlete,
        };
      })
    );
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    const id = this.connectionId++;
    const createdAt = new Date();
    const newConnection: Connection = { ...connection, id, createdAt };
    this.connections.set(id, newConnection);
    return newConnection;
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection> {
    const connection = this.connections.get(id);
    if (!connection) {
      throw new Error("Connection not found");
    }
    
    const updatedConnection = {
      ...connection,
      status,
    };
    
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }

  // Rating operations
  async getTrainerRatings(trainerId: number): Promise<Array<Rating & { athlete: User }>> {
    const ratings = Array.from(this.ratings.values())
      .filter((rating) => rating.trainerId === trainerId);
    
    return Promise.all(
      ratings.map(async (rating) => {
        const athlete = await this.getUser(rating.athleteId);
        if (!athlete) {
          throw new Error("Athlete not found for rating");
        }
        return {
          ...rating,
          athlete,
        };
      })
    );
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const id = this.ratingId++;
    const createdAt = new Date();
    const newRating: Rating = { ...rating, id, createdAt };
    this.ratings.set(id, newRating);
    
    // Update trainer rating
    const trainerProfile = await this.getTrainerProfile(rating.trainerId);
    if (trainerProfile) {
      const totalRatings = trainerProfile.ratingCount;
      const currentRating = trainerProfile.rating;
      
      // Calculate new average rating
      const newRatingCount = totalRatings + 1;
      const newRating = ((currentRating * totalRatings) + rating.rating) / newRatingCount;
      
      await this.updateTrainerProfile(rating.trainerId, {
        rating: Math.round(newRating * 10) / 10, // Round to 1 decimal place
        ratingCount: newRatingCount,
      });
    }
    
    return newRating;
  }

  // Message operations
  async getConversation(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => 
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const createdAt = new Date();
    const newMessage: Message = { ...message, id, read: false, createdAt };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    const messages = Array.from(this.messages.values())
      .filter((message) => 
        message.senderId === senderId && 
        message.receiverId === receiverId &&
        !message.read
      );
    
    messages.forEach((message) => {
      this.messages.set(message.id, { ...message, read: true });
    });
  }

  // Initialize with some sample data for development
  private async initializeData() {
    // Sample products
    this.createProduct({
      name: "Premium Yoga Mat",
      description: "High-quality non-slip yoga mat for all yoga practices.",
      price: 4599, // $45.99
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
      category: "equipment",
      inStock: true,
    });
    
    this.createProduct({
      name: "Resistance Bands Set",
      description: "Set of 5 resistance bands of different strengths for versatile workouts.",
      price: 2999, // $29.99
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
      category: "equipment",
      inStock: true,
    });
    
    this.createProduct({
      name: "Running Shoes",
      description: "Lightweight and supportive running shoes for all terrains.",
      price: 11999, // $119.99
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
      category: "apparel",
      inStock: true,
    });
    
    this.createProduct({
      name: "Protein Powder",
      description: "Whey protein powder for muscle recovery and growth.",
      price: 4999, // $49.99
      image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba",
      category: "supplements",
      inStock: true,
    });
  }
}

export const storage = new MemStorage();
