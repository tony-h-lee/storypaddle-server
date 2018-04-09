import { success, notFound, authorOrAdmin } from '../../services/response/'
import mongoose from 'mongoose'
import { Narratives } from '.'

const setRoleUsers = (roles, userID) => (
  roles.map((role, index) => {
    if (index === 0) role.user = new mongoose.Types.ObjectId(userID)
    else role.user = null
    return role
    }
  )
)

export const create = ({ user, bodymen: { body } }, res, next) => {
  // Set the first role as the creating user and the rest of the roles
  // with empty users
  let nameArray = body.roles.map((role) => role.name)
  if((new Set(nameArray)).size !== nameArray.length)
    return res.status(400).end()
  body.roles = setRoleUsers(body.roles, user.id)
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

export const updateRole = ({ user, body, params }, res, next) => {
  return Narratives.findById(params.id)
    .then(notFound(res))
    .then((narratives) => {
      // Check if user already has a role in narrative
      if (narratives.roles.some((role) => {
          if(role.user) return role.user.equals(user.id)
          return false
        })) {
        res.status(400).end()
        return false
      }
      return narratives ? Object.assign(narratives, {
          ...narratives, roles: Object.assign(narratives.roles, narratives.roles.map((role) => {
            if (role.id === body.roleId) role.user = user.id;
            return role;
          }))
      }).save() : null
    })
    .then((narratives) => narratives ? narratives.view(true) : null)
    .then(success(res))
    .catch(next)
}


export const destroy = ({ user, params }, res, next) =>
  Narratives.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'author'))
    .then((narratives) => narratives ? narratives.remove() : null)
    .then(success(res, 204))
    .catch(next)
