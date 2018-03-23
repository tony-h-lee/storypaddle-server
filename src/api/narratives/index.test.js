import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Narratives } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, narratives

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  narratives = await Narratives.create({ author: user })
})

test('POST /narratives 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, title: 'test', description: 'test', genre: 'test', explicit: 'test', roles: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.genre).toEqual('test')
  expect(body.explicit).toEqual('test')
  expect(body.roles).toEqual('test')
  expect(typeof body.author).toEqual('object')
})

test('POST /narratives 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /narratives 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /narratives/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${narratives.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(narratives.id)
})

test('GET /narratives/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /narratives/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${narratives.id}`)
    .send({ access_token: userSession, title: 'test', description: 'test', genre: 'test', explicit: 'test', roles: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(narratives.id)
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.genre).toEqual('test')
  expect(body.explicit).toEqual('test')
  expect(body.roles).toEqual('test')
  expect(typeof body.author).toEqual('object')
})

test('PUT /narratives/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${narratives.id}`)
    .send({ access_token: anotherSession, title: 'test', description: 'test', genre: 'test', explicit: 'test', roles: 'test' })
  expect(status).toBe(401)
})

test('PUT /narratives/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${narratives.id}`)
  expect(status).toBe(401)
})

test('PUT /narratives/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test', description: 'test', genre: 'test', explicit: 'test', roles: 'test' })
  expect(status).toBe(404)
})

test('DELETE /narratives/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${narratives.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /narratives/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${narratives.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /narratives/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${narratives.id}`)
  expect(status).toBe(401)
})

test('DELETE /narratives/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
