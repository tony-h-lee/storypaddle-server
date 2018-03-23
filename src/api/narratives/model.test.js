import { Narratives } from '.'
import { User } from '../user'

let user, narratives

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  narratives = await Narratives.create({ author: user, title: 'test', description: 'test', genre: 'test', explicit: 'test', roles: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = narratives.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(narratives.id)
    expect(typeof view.author).toBe('object')
    expect(view.author.id).toBe(user.id)
    expect(view.title).toBe(narratives.title)
    expect(view.description).toBe(narratives.description)
    expect(view.genre).toBe(narratives.genre)
    expect(view.explicit).toBe(narratives.explicit)
    expect(view.roles).toBe(narratives.roles)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = narratives.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(narratives.id)
    expect(typeof view.author).toBe('object')
    expect(view.author.id).toBe(user.id)
    expect(view.title).toBe(narratives.title)
    expect(view.description).toBe(narratives.description)
    expect(view.genre).toBe(narratives.genre)
    expect(view.explicit).toBe(narratives.explicit)
    expect(view.roles).toBe(narratives.roles)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
