import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./server/models/User.js";
import Course from "./server/models/Course.js";

dotenv.config({ path: "./server/.env" });

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
  
  // Try to find a user
  const user = await User.findOne();
  if (!user) {
    console.log("No user found.");
    process.exit(0);
  }
  
  const userId = user._id.toString();
  console.log("Test with User ID:", userId);

  // 1. Create a course using string userId
  const course = new Course({
    title: "Test Course Title",
    creator: userId,
    savedBy: [userId],
  });
  await course.save();
  console.log("Created course with ID:", course._id);
  
  // 2. Query the course using string userId
  const courses = await Course.find({
    $or: [{ creator: userId }, { savedBy: userId }]
  });
  console.log("Found courses length:", courses.length);
  const foundCourse = courses.find(c => c._id.toString() === course._id.toString());
  console.log("Was course found by query?", !!foundCourse);
  
  // Cleanup
  await Course.findByIdAndDelete(course._id);
  
  process.exit(0);
}

test().catch(err => { console.error(err); process.exit(1); });
