import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
   cat_id: {
    type:String,
    required: true
  },
  subcat_id:{
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
export default mongoose.model("Item", itemSchema);
