import mongoose, { Schema } from 'mongoose'

const narrativesSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  explicit: {
    type: Boolean,
    default: false,
  },
  roles: [{}],
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

narrativesSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      author: this.author.view(),
      title: this.title,
      description: this.description,
      genre: this.genre,
      explicit: this.explicit,
      roles: this.roles,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Narratives', narrativesSchema)

export const schema = model.schema
export default model
