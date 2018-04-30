import { Scenes } from '.'
import { User } from '../user'

let user, scenes

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  scenes = await Scenes.create({ author: user, narrative: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = scenes.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(scenes.id)
    expect(typeof view.author).toBe('object')
    expect(view.author.id).toBe(user.id)
    expect(view.narrative).toBe(scenes.narrative)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = scenes.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(scenes.id)
    expect(typeof view.author).toBe('object')
    expect(view.author.id).toBe(user.id)
    expect(view.narrative).toBe(scenes.narrative)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
