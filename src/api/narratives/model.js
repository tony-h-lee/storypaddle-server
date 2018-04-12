import mongoose, { Schema } from 'mongoose'

export const Roles = new Schema({
  name: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
})

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
  roles: {
    type: [Roles],
    validate: [minRolesRequired, 'Narrative requires at least 2 roles']
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

function minRolesRequired(val) {
  return val.length >= 2;
}

narrativesSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      author: this.author.view(),
      title: this.title,
      synopsis: this.synopsis,
      description: this.description,
      genre: this.genre,
      explicit: this.explicit,
      roles: this.roles,
    }

    return full ? {
      ...view,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    } : view
  }
}

const model = mongoose.model('Narratives', narrativesSchema)

export const schema = model.schema
export default model
