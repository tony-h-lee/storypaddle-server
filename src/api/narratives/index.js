import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Narratives, { schema } from './model'

const router = new Router()
const { title, description, genre, explicit, roles } = schema.tree

/**
 * @api {post} /narratives Create narratives
 * @apiName CreateNarratives
 * @apiGroup Narratives
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Narratives's title.
 * @apiParam description Narratives's description.
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
  body({ title, description, genre, explicit, roles }),
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
 * @apiParam description Narratives's description.
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
  body({ title, description, genre, explicit, roles }),
  update)

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
