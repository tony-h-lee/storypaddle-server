import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy, updateRole } from './controller'
import { schema } from './model'
export Narratives, { schema } from './model'

const router = new Router()
const { title, synopsis, genre, explicit } = schema.tree

/**
 * @api {post} /narratives Create narratives
 * @apiName CreateNarratives
 * @apiGroup Narratives
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Narratives's title.
 * @apiParam synopsis Narratives's synopsis.
 * @apiParam genre Narratives's genre.
 * @apiParam explicit Narratives's explicit.
 * @apiParam roles Narratives's roles.
 * @apiSuccess {Object} narratives Narratives's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Narratives not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, synopsis, genre, explicit, roles: [Object] }),
  create)

/**
 * @api {get} /narratives Retrieve narratives
 * @apiName RetrieveNarratives
 * @apiGroup Narratives
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of narratives.
 * @apiSuccess {Object[]} rows List of narratives.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /narratives/:id Retrieve narratives
 * @apiName RetrieveNarratives
 * @apiGroup Narratives
 * @apiSuccess {Object} narratives Narratives's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Narratives not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /narratives/:id Update narratives
 * @apiName UpdateNarratives
 * @apiGroup Narratives
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Narratives's title.
 * @apiParam synopsis Narratives's synopsis.
 * @apiParam genre Narratives's genre.
 * @apiParam explicit Narratives's explicit.
 * @apiParam roles Narratives's roles.
 * @apiSuccess {Object} narratives Narratives's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Narratives not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, synopsis, genre, explicit, roles: [Object] }),
  update)


/**
 * @api {put} /narratives/roles/:id Update narrative roles
 * @apiName UpdateNarratives
 * @apiGroup Narratives
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam role The role name.
 * @apiSuccess {Object} user id and role name.
 * @apiError {Object} 400 User already has another role in narrative
 * @apiError 404 Narratives not found.
 * @apiError 401 user access only.
 */
router.put('/roles/:id',
  token({ required: true }),
  updateRole)

/**
 * @api {delete} /narratives/:id Delete narratives
 * @apiName DeleteNarratives
 * @apiGroup Narratives
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Narratives not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
