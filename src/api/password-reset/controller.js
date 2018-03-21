import { success, notFound } from '../../services/response/'
import { sendMail } from '../../services/sendgrid'
import { PasswordReset } from '.'
import { sign } from '../../services/jwt'
import { User } from '../user'

export const create = ({ bodymen: { body: { email, link } } }, res, next) =>
  User.findOne({ email })
    .then(notFound(res))
    .then((user) => user ? PasswordReset.create({ user }) : null)
    .then((reset) => {
      if (!reset) return null
      const { user, token } = reset
      const serverLink = 'http://localhost:3000';
      link = `${link.replace(/\/$/, '')}/${token}`
      link = serverLink+link;
      const content = `
        You requested a new password for your Storypaddle account.<br><br>
        
        Please use the following link to set a new password. It will expire in 1 hour.<br><br>
        <a href="${link}">${link}</a><br><br>
        If you didn't make this request then you can safely ignore this email. <br><br>
        &mdash; Storypaddle Team
      `
      return sendMail({ toEmail: email, subject: 'Storypaddle - Password Reset', content })
    })
    .then((response) => response ? res.status(response.statusCode).json(response.body) : res.status(400).end())
    .catch(next)

export const show = ({ params: { token } }, res, next) =>
  PasswordReset.findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then((reset) => reset ? reset.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = ({ params: { token }, bodymen: { body: { password } } }, res, next) => {
  return PasswordReset.findOne({ token })
    .populate('user')
    .then(notFound(res))
    .then((reset) => {
      if (!reset) return null
      const { user } = reset
      return user.set({ password }).save()
        .then(() => PasswordReset.remove({ user }))
        .then(() => sign(user.id)
          .then((token) => ({ token, user: user.view() }))
          .then(success(res, 201))
          .catch(next))
    })
    .catch(next)
}
