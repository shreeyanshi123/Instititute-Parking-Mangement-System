import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // For handling cookies
import authRoutes from './routes/Auth/authRoutes.js'; // Import your auth routes
import adminRoutes from './routes/Admin/adminRoutes.js'; // Import your admin routes
import userRoutes from './routes/User/UserRoutes.js'; // Import your user routes
import profileRouter from './routes/common/profile-route.js';import visitorRoutes from "./routes/visitors/visitorRoutes.js"
import "./services/ExpiryCron.js"
import "./services/visitorsCron.js"



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true // Enable cookies and authentication headers if required
  }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Enables cookie handling

// Sample route to verify database connection
app.get('/', (req, res) => {
    res.send('MySQL connection successful!');
});

// Authentication Routes
app.use('/auth', authRoutes);
app.use('/admin',adminRoutes);
app.use('/user', userRoutes);
app.use('/profile',profileRouter);
app.use('/visitor',visitorRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
