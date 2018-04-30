import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Comments } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, comments

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  comments = await Comments.create({ author: user })
})

test('POST /comments 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, type: 'test', text: 'test', adjective: 'test', scene: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.type).toEqual('test')
  expect(body.text).toEqual('test')
  expect(body.adjective).toEqual('test')
  expect(body.scene).toEqual('test')
  expect(typeof body.author).toEqual('object')
})

test('POST /comments 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /comments 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].author).toEqual('object')
})

test('GET /comments 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /comments/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${comments.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(comments.id)
  expect(typeof body.author).toEqual('object')
})

test('GET /comments/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${comments.id}`)
  expect(status).toBe(401)
})

test('GET /comments/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /comments/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${comments.id}`)
    .send({ access_token: userSession, type: 'test', text: 'test', adjective: 'test', scene: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(comments.id)
  expect(body.type).toEqual('test')
  expect(body.text).toEqual('test')
  expect(body.adjective).toEqual('test')
  expect(body.scene).toEqual('test')
  expect(typeof body.author).toEqual('object')
})

test('PUT /comments/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${comments.id}`)
    .send({ access_token: anotherSession, type: 'test', text: 'test', adjective: 'test', scene: 'test' })
  expect(status).toBe(401)
})

test('PUT /comments/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${comments.id}`)
  expect(status).toBe(401)
})

test('PUT /comments/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, type: 'test', text: 'test', adjective: 'test', scene: 'test' })
  expect(status).toBe(404)
})

test('DELETE /comments/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${comments.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /comments/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${comments.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /comments/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${comments.id}`)
  expect(status).toBe(401)
})

test('DELETE /comments/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
