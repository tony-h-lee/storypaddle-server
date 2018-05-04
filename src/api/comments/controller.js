import { success, notFound, authorOrAdmin } from '../../services/response/'
import mongoose from 'mongoose'
import { Comments } from '.'
import Scenes from '../scenes/model'

export const create = ({ user, bodymen: { body } }, res, next) => {
  // Remove parenthesis from adjective if any
  let newAdjective = body.adjective ? body.adjective.replace(/\(|\)/g,'') : null;
  let newBody = Object.assign(body, {...body, adjective: newAdjective, scene: mongoose.Types.ObjectId(body.scene) })

  console.log(newBody)

  console.log({...body})


  // Check if user has a role in this narrative to allow a post
  /*
  Scenes.findById(body.scene)
    .populate('narrative')
    .then((scene) => console.log(scene))
    */
  return Comments.create({ newBody, author: user.id })
    .then((comments) => comments.view())
    .then(success(res, 201))
    .catch(next)
}


export const index = ({ query }, res, next) => {
  // Set a limit on how many comments to retrieve
  const COMMENTS_PAGE_LIMIT = query.limit && +query.limit <= 20 ? +query.limit : 10;

  // Get all comments belonging to a scene
  const sceneQuery = query && query.scene ? { scene: query.scene } : {}

  return Comments.paginate({
    limit: COMMENTS_PAGE_LIMIT,
    query: sceneQuery,
    paginatedField: 'createdAt',
    next: query && query.next ? query.next : '',
    previous: query && query.previous ? query.previous : '',
    sortAscending: true,
  })
    .then((comments) => success(res)({ ...comments,
      results: comments.results.map((comments) => new Comments(comments).view())}))
    .catch(next)
}

export const show = ({ params }, res, next) =>
  Comments.findById(params.id)
    .then(notFound(res))
    .then((comments) => comments ? comments.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Comments.findById(params.id)
    .populate('author')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'author'))
    .then((comments) => comments ? Object.assign(comments, body).save() : null)
    .then((comments) => comments ? comments.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Comments.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'author'))
    .then((comments) => comments ? comments.remove() : null)
    .then(success(res, 204))
    .catch(next)
