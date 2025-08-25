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
  pcat_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category",
    required: true
  },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("subCategory", subcategorySchema);

