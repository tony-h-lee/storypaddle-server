import { success, notFound, authorOrAdmin, validCast } from '../../services/response/'
import mongoose from 'mongoose'
import { Narratives, Role } from '.'
import Scenes from '../scenes/model'

const setRoleUsers = (roles, user) => (
  roles.map((role, index) => {
    if (index === 0) {
      role.user = mongoose.Types.ObjectId(user.id)
    }
    return role
  })
)

export const create = ({ user, bodymen: { body } }, res, next) => {
  // Set the first role as the creating user and the rest of the roles
  // with empty users
  let nameArray = body.roles.map((role) => role.name)
  if((new Set(nameArray)).size !== nameArray.length)
    return res.status(401).end()
  body.roles = setRoleUsers(body.roles, user)
  return Narratives.create({...body, author: user.id})
    .then((narratives) => {
      Scenes.create({narrative: narratives.id, author: user.id})
        .then((scenes) => narratives.update({scene: scenes.id}))
        .catch(next)
      return narratives.view()
    })
    .then((narratives) => success(res, 201)(narratives))
    .catch((err) => validCast(res, err, next))
}

export const index = ({ query }, res, next) => {
  // Set a limit on how many narratives to retrieve
  const NARRATIVE_PAGE_LIMIT = query.limit && +query.limit <= 20 ? +query.limit : 10;

  if (query && query.search) {
    return Narratives.find({ $text: { $search: query.search }})
      .select({ "score": { "$meta": "textScore" } })
      .sort({ "score": { "$meta": "textScore" } })
      .limit(+query.limit)
      .then(success(res))
      .catch(next)
  } else {
    // Get narratives created by a specific author
    // - Requires author query : ?author=userId
    const authorQuery = query && query.author ? {author: query.author} : {}

    // Get narratives where a user is assigned a role and the narrative author is not the user
    // - Requires user query : ?&user=userId
    const roleQuery = query && query.user ? {
        $and: [{author: {$ne: query.user}},
          {roles: {$elemMatch: {user: query.user}}}]
      } : {}

    // Add separate queries here to destruct into one final query
    const fullQuery = {
      ...authorQuery,
      ...roleQuery,
    }

    const isValidFieldAndReturn = query &&
    (query.paginatedField === 'updatedAt' || query.paginatedField === 'createdAt') ? query.paginatedField : 'createdAt'

    return Narratives.paginate({
      limit: NARRATIVE_PAGE_LIMIT,
      query: fullQuery,
      paginatedField: isValidFieldAndReturn,
      next: query && query.next ? query.next : '',
      previous: query && query.previous ? query.previous : '',
    })
      .then((narratives) => success(res)({
        ...narratives,
        results: narratives.results.map((narrative) => new Narratives(narrative).view())
      }))
      .catch(next)
  }
}


// Need to implement timer or ip tracking to prevent view increment abuse
// Simple view increment for now
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
          res.status(401).end()
          return false
        }
        return narratives ? Object.assign(narratives, {
          ...narratives, roles: Object.assign(narratives.roles, narratives.roles.map((role) => {
            if (role.id === body.roleId)  {
              role.user = user.id;
            }
            return role;
          }))
        }).save() : null
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
          return narratives ? Object.assign(narratives, {
            ...narratives, roles: Object.assign(narratives.roles, narratives.roles.map((role) => {
              if (role.user && role.user.equals(user.id)) {
                role.user = null;
              }
              return role;
            }))
          }).save() : null
        }
        res.status(404).end()
        return false
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
