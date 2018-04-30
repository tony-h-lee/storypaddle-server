import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Scenes } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, scenes

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  scenes = await Scenes.create({ author: user })
})

test('POST /scenes 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, narrative: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.narrative).toEqual('test')
  expect(typeof body.author).toEqual('object')
})

test('POST /scenes 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /scenes 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /scenes/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${scenes.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(scenes.id)
  expect(typeof body.author).toEqual('object')
})

test('GET /scenes/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${scenes.id}`)
  expect(status).toBe(401)
})

test('GET /scenes/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /scenes/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${scenes.id}`)
    .send({ access_token: userSession, narrative: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(scenes.id)
  expect(body.narrative).toEqual('test')
  expect(typeof body.author).toEqual('object')
})

test('PUT /scenes/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${scenes.id}`)
    .send({ access_token: anotherSession, narrative: 'test' })
  expect(status).toBe(401)
})

test('PUT /scenes/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${scenes.id}`)
  expect(status).toBe(401)
})

test('PUT /scenes/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, narrative: 'test' })
  expect(status).toBe(404)
})

test('DELETE /scenes/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${scenes.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /scenes/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${scenes.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /scenes/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${scenes.id}`)
  expect(status).toBe(401)
})

test('DELETE /scenes/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
