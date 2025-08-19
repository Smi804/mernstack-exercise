import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});



export default mongoose.model("Category", categorySchema);
