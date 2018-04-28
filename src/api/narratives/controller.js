import { success, notFound, authorOrAdmin, validCast } from '../../services/response/'
import mongoose from 'mongoose'
import { Narratives } from '.'

const NARRATIVE_PAGE_LIMIT = 10;

const setRoleUsers = (roles, user) => (
  roles.map((role, index) => {
    if (index === 0) {
      role.user = new mongoose.Types.ObjectId(user.id)
    }
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
  body.roles = setRoleUsers(body.roles, user)
  return Narratives.create({...body, author: user.id})
    .then((narratives) => {
      user.ownedNarratives.push(narratives._id)
      user.save()
      return narratives.view()
    })
    .then(success(res, 201))
    .catch((err) => validCast(res, err, next))
}

export const index = ({ query }, res, next) => {
  const authorQuery = query && query.author ? { author: query.author } : {};

  // Add separate queries here to destruct into one final query
  const fullQuery = { ...authorQuery }
  return Narratives.paginate({
    limit: NARRATIVE_PAGE_LIMIT,
    query: fullQuery,
    paginatedField: query && query.pagination ? query.pagination : 'createdAt',
    next: query && query.next ? query.next : '',
    previous: query && query.previous ? query.previous : '',
  })
    .then((narratives) => success(res)({ ...narratives,
      results: narratives.results.map((narrative) => new Narratives(narrative).view())}))
    .catch(next)
}


export const show = ({ params }, res, next) =>
  Narratives.findById(params.id)
    .then(notFound(res))
    .then((narratives) => narratives ? narratives.view() : null)
    .then(success(res))
    .catch((err) => validCast(res, err, next))

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Narratives.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'author'))
    .then((narratives) => narratives ? Object.assign(narratives, {...narratives}, body).save() : null)
    .then((narratives) => narratives ? narratives.view() : null)
    .then(success(res))
    .catch((err) => validCast(res, err, next))

export const updateRole = ({ user, body, params }, res, next) => {
  if(body.add) {
    return Narratives.findById(params.id)
      .then(notFound(res))
      .then((narratives) => {
        // Check if user already has a role in narrative
        if (narratives.roles.some((role) => {
            if (role.user) return role.user.equals(user.id)
            return false
          })) {
          res.status(400).end()
          return false
        } else {
          user.joinedNarratives.push(narratives.id)
          user.save()

          return narratives ? Object.assign(narratives, {
              ...narratives, roles: Object.assign(narratives.roles, narratives.roles.map((role) => {
                if (role.id === body.roleId) role.user = user.id;
                return role;
              }))
            }).save() : null
        }
      })
      .then(success(res, 204))
      .catch((err) => validCast(res, err, next))
  } else {
    return Narratives.findById(params.id)
      .then(notFound(res))
      .then((narratives) => {
        // Check if user already has a role in narrative
        if (narratives.roles.some((role) => {
            if (role.user) return role.user.equals(user.id)
            return false
          })) {
          user.joinedNarratives.remove(narratives.id)
          user.save()

          return narratives ? Object.assign(narratives, {
              ...narratives, roles: Object.assign(narratives.roles, narratives.roles.map((role) => {
                if (role.user && role.user.equals(user.id)) return role.user = null;
                return role;
              }))
            }).save() : null
        } else {
          res.status(404).end()
          return false
        }
      })
      .then(success(res, 204))
      .catch((err) => validCast(res, err, next))
  }
}

export const destroy = ({ user, params }, res, next) =>
  Narratives.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'author'))
    .then((narratives) => narratives.remove())
    .then(success(res, 204))
    .catch((err) => validCast(res, err, next))
