import mongoose, { Schema } from 'mongoose'

const commentsSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    default: 'narration',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  adjective: {
    type: String
  },
  scene: {
    type: Schema.ObjectId,
    ref: 'Scenes',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

commentsSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      author: this.author.view(full),
      type: this.type,
      text: this.text,
      adjective: this.adjective,
      scene: this.scene,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Comments', commentsSchema)

export const schema = model.schema
export default model
