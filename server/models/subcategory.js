import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cat_id: {
      type:String,
      required: true
    },
  code: {
    type: String,
    required: true,
    unique: true
  },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("subCategory", subcategorySchema);
