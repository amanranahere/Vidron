import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db_index.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!", err);
  });
