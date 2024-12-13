import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import chatbot from './routes/chatbotRoute.js'
// import brandRoutes from "./routes/brandRoutes.js"; // Updated
import brandRoutes from "./routes/brandRoutes.js";
// import productRoutes from "./routes/productRoutes.js"; // Updated
import { productRoutes } from "./routes/productRoutes.js"; // Named import
import catalogRoutes from './routes/catalogRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import rentRouter from "./routes/rent.route.js"
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

 
dotenv.config();


const PORT = process.env.PORT || 3000;



//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1", chatbot);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);

app.use('/api/productss', catalogRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes); // Add this line to use the cart routes

app.use("/api/rent", rentRouter)


app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
})

app.use('/assets', express.static(path.join(__dirname, '../client/assets')));


// const addingData = async () => {
//     try {
//         const data = await Catalog.insertMany({
//             "ID": "ALK231009",
//             "Product Name": "Fabrics 3 Piece Suit",
//             "Product Description": "Printed Light Khaddar | Top Bottoms Dupatta",
//             "Price": 3490,
//             "Availability": "In Stock",
//             "Color": "NAVY",
//             "Img Path": "/assets/Images/ALK231009/image_0.jpg"
//           },
//           {
//             "ID": "ALK231009",
//             "Product Name": "Fabrics 3 Piece Suit",
//             "Product Description": "Printed Light Khaddar | Top Bottoms Dupatta",
//             "Price": 3490,
//             "Availability": "In Stock",
//             "Color": "NAVY",
//             "Img Path": "/assets/Images/ALK231009/image_0.jpg"
//           },
//           {
//             "ID": "ALK231009",
//             "Product Name": "Fabrics 3 Piece Suit",
//             "Product Description": "Printed Light Khaddar | Top Bottoms Dupatta",
//             "Price": 3490,
//             "Availability": "In Stock",
//             "Color": "NAVY",
//             "Img Path": "/assets/Images/ALK231009/image_0.jpg"
//           },
//           {
//             "ID": "ALK231009",
//             "Product Name": "Fabrics 3 Piece Suit",
//             "Product Description": "Printed Light Khaddar | Top Bottoms Dupatta",
//             "Price": 3490,
//             "Availability": "In Stock",
//             "Color": "NAVY",
//             "Img Path": "/assets/Images/ALK231009/image_0.jpg"
//           },
//           {
//             "ID": "ALK231009",
//             "Product Name": "Fabrics 3 Piece Suit",
//             "Product Description": "Printed Light Khaddar | Top Bottoms Dupatta",
//             "Price": 3490,
//             "Availability": "In Stock",
//             "Color": "NAVY",
//             "Img Path": "/assets/Images/ALK231009/image_0.jpg"
//           },
//           {
//             "ID": "ALK231009",
//             "Product Name": "Fabrics 3 Piece Suit",
//             "Product Description": "Printed Light Khaddar | Top Bottoms Dupatta",
//             "Price": 3490,
//             "Availability": "In Stock",
//             "Color": "NAVY",
//             "Img Path": "/assets/Images/ALK231009/image_0.jpg"
//           },
//           {
//             "ID": "ALK231009",
//             "Product Name": "Fabrics 3 Piece Suit",
//             "Product Description": "Printed Light Khaddar | Top Bottoms Dupatta",
//             "Price": 3490,
//             "Availability": "In Stock",
//             "Color": "NAVY",
//             "Img Path": "/assets/Images/ALK231009/image_0.jpg"
//           },
//           {
//             "ID": "ALK231009",
//             "Product Name": "Fabrics 3 Piece Suit",
//             "Product Description": "Printed Light Khaddar | Top Bottoms Dupatta",
//             "Price": 3490,
//             "Availability": "In Stock",
//             "Color": "NAVY",
//             "Img Path": "/assets/Images/ALK231009/image_0.jpg"
//           },

        
//         )
//     } catch (error) {
//         console.log(error)
//     }
// }

// addingData()


server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});