import { sign } from '../../services/jwt'
import { success } from '../../services/response/'

export const login = ({ user }, res, next) =>
  sign(user.id, { expiresIn: "3d" })
    .then((token) => ({ token, user: user.view() }))
    .then(success(res, 201))
    .catch(next)
