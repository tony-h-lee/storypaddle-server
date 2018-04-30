import { Comments } from '.'
import { User } from '../user'

let user, comments

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  comments = await Comments.create({ author: user, type: 'test', text: 'test', adjective: 'test', scene: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = comments.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comments.id)
    expect(typeof view.author).toBe('object')
    expect(view.author.id).toBe(user.id)
    expect(view.type).toBe(comments.type)
    expect(view.text).toBe(comments.text)
    expect(view.adjective).toBe(comments.adjective)
    expect(view.scene).toBe(comments.scene)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = comments.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(comments.id)
    expect(typeof view.author).toBe('object')
    expect(view.author.id).toBe(user.id)
    expect(view.type).toBe(comments.type)
    expect(view.text).toBe(comments.text)
    expect(view.adjective).toBe(comments.adjective)
    expect(view.scene).toBe(comments.scene)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
