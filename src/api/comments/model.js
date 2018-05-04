import mongoose, { Schema } from 'mongoose'
import paginate from 'mongoose-cursor-paginate'

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
  character: {
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
      author: this.author,
      type: this.type,
      text: this.text,
      adjective: this.adjective,
      character: this.character,
      scene: this.scene,
      createdAt: this.createdAt,
    }

    return full ? {
      ...view,
        updatedAt: this.updatedAt
    } : view
  }
}

commentsSchema.plugin(paginate);

const model = mongoose.model('Comments', commentsSchema)

export const schema = model.schema
export default model
