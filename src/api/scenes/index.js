import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, show, destroy } from './controller'
import { schema } from './model'
export Scenes, { schema } from './model'

const router = new Router()
const { narrative } = schema.tree

/**
 * @api {post} /scenes Create scenes
 * @apiName CreateScenes
 * @apiGroup Scenes
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam narrative Scenes's narrative.
 * @apiSuccess {Object} scenes Scenes's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Scenes not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ narrative }),
  create)

/**
 * @api {get} /scenes/:id Retrieve scene
 * @apiName RetrieveScenes
 * @apiGroup Scenes
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} scenes Scenes's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Scenes not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  show)

/**
 * @api {delete} /scenes/:id Delete scenes
 * @apiName DeleteScenes
 * @apiGroup Scenes
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Scenes not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
