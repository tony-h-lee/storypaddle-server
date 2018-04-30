import mongoose, { Schema } from 'mongoose'
const paginate = require('mongoose-cursor-paginate');

export const Roles = new Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
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
}, {
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
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
      createdAt: this.createdAt,
    }

    return full ? {
      ...view,
        updatedAt: this.updatedAt,
    } : view
  }
}

narrativesSchema.plugin(paginate);

narrativesSchema.pre('remove', function(next) {
  mongoose.model('User').update(
    {},
    { $pull: { joinedNarratives: this.id}},
    { multi: true },
    next);
});

const model = mongoose.model('Narratives', narrativesSchema)

export const schema = model.schema
export default model
