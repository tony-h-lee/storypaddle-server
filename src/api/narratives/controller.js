import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Narratives } from '.'

const setRoleUsers = (roles, userID) => (
  roles.map((role, index) => {
    if (index === 0) role.user = userID
    else role.user = ""
    return role
    }
  )
)

export const create = ({ user, bodymen: { body } }, res, next) => {
  body.roles = setRoleUsers(body.roles, user.id);
  console.log(body.roles)
  return Narratives.create({...body, author: user.id})
    .then((narratives) => narratives.view(true))
    .then(success(res, 201))
    .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Narratives.count(query)
    .then(count => Narratives.find(query, select, cursor)
      .populate('author')
      .then((narratives) => ({
        count,
        rows: narratives.map((narratives) => narratives.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Narratives.findById(params.id)
    .populate('author')
    .then(notFound(res))
    .then((narratives) => narratives ? narratives.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Narratives.findById(params.id)
    .populate('author')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'author'))
    .then((narratives) => narratives ? Object.assign(narratives, body).save() : null)
    .then((narratives) => narratives ? narratives.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Narratives.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'author'))
    .then((narratives) => narratives ? narratives.remove() : null)
    .then(success(res, 204))
    .catch(next)
