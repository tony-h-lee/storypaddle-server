import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Scenes } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Scenes.create({ ...body, author: user })
    .then((scenes) => scenes.view(true))
    .then(success(res, 201))
    .catch(next)

export const show = ({ params }, res, next) =>
  Scenes.findById(params.id)
    .populate('narrative', '-updatedAt -__v')
    .then(notFound(res))
    .then((scenes) => scenes ? scenes.view() : null)
    .then(success(res))
    .catch(next)


export const destroy = ({ user, params }, res, next) =>
  Scenes.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'author'))
    .then((scenes) => scenes ? scenes.remove() : null)
    .then(success(res, 204))
    .catch(next)
