import { success, notFound, authorOrAdmin } from '../../services/response/'
import Scenes from '../scenes/model'
import { Comments } from '.'

export const create = ({ user, bodymen: { body } }, res, next) => {
  // Remove parenthesis from adjective if any
  body.adjective = body.adjective ? body.adjective.replace(/\(|\)/g,'') : null;

  // Check if user is a participant in narrative to allow post
  Scenes.findById(body.scene)
    .populate('narrative')
    .then((scene) => {
      if (scene.narrative.roles.some((role) => {
          if (role.user) return role.user.equals(user.id)
          return false
        })) {
        // Found a matching role so post the comment
        return Comments.create({ ...body, author: user.id })
          .then((comments) => comments.view())
          .then(success(res, 201))
          .catch(next)
      }
      return res.status(401).end()
    })
    .catch(next)
}


export const index = ({ query }, res, next) => {
  // Set a limit on how many comments to retrieve
  const COMMENTS_PAGE_LIMIT = query.limit && +query.limit <= 20 ? +query.limit : 10;

  // Get all comments belonging to a scene
  const sceneQuery = query && query.scene ? { scene: query.scene } : {}

  const order = query && query.order ? JSON.parse(query.order) : false;

  // Sorting DESC if participant retrieving, ASC is public user retrieving
  console.log(order)
  return Comments.paginate({
    limit: COMMENTS_PAGE_LIMIT,
    query: sceneQuery,
    paginatedField: 'createdAt',
    next: query && query.next ? query.next : '',
    previous: query && query.previous ? query.previous : '',
    sortAscending: order,
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

export const destroy = ({ user, body, params }, res, next) => {
  // Check if user is a participant in narrative to allow post
  Scenes.findById(body.sceneId)
    .populate('narrative')
    .then((scene) => {
      if (scene.narrative.roles.some((role) => {
          if (role.user) return role.user.equals(user.id)
          return false
        })) {
        // Found a matching role so delete the comment
        return Comments.findById(params.id)
          .then(notFound(res))
          .then(authorOrAdmin(res, user, 'author'))
          .then((comments) => comments ? comments.remove() : null)
          .then(success(res, 204))
          .catch(next)
      }
      return res.status(401).end()
    })
    .catch(next)

}

