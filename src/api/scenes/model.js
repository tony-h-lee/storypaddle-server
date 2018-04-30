import mongoose, { Schema } from 'mongoose'

const scenesSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  narrative: {
    type: Schema.ObjectId,
    ref: 'Narratives',
    reequired: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

scenesSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      author: this.author.view(full),
      narrative: this.narrative,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Scenes', scenesSchema)

export const schema = model.schema
export default model
