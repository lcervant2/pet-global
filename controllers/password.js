const mongoose = require('mongoose');
const models = require('../models');
const errors = require('../errors');
const convertCase = require('../helpers/convertCase');
const sgMail = require('@sendgrid/mail');
const generateToken = require('../helpers/generateToken');
const HttpStatus = require('http-status-codes');

const resetPassword = async (req, res, next) => {
  try {
    // get the user
    const user = await models.User.findOne({ email: req.body.email });

    if (!user)
      return next(new errors.NotFoundError());

    // generate a password reset token for this user (default expires in one hour)
    const passwordResetToken = await models.PasswordResetToken.create({
      token: generateToken(48),
      expiresAt: Date.now() + 1000 * 60 * 60,
      user: user._id
    });

    // craft email
    const email = {
      to: user.email,
      from: 'do-not-reply@thepetglobe.com',
      subject: 'Reset Your Password',
      text:
        `
      ${user.firstName},
      
      Please follow this link to reset password:
      ${req.protocol}://${req.get('host')}/password/reset?token=${passwordResetToken.token}&user=${user._id}
      
      
      Sincerely,
      The PetGlobe Team
      `
    };

    // send the email
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(email);

    res.status(200).end();
  } catch (error) {
    next(error);
  }
};

const createPassword = async (req, res, next) => {
  try {
    const body = convertCase.camelCase(req.body);

    if (!mongoose.Types.ObjectId.isValid(body.user))
      return next(new errors.AuthorizationError());

    // find the reset token
    const passwordResetToken = await models.PasswordResetToken.findOne({
      token: body.token,
      user: new mongoose.mongo.ObjectId(body.user)
    }).populate('user');

    // if no token is found or token is expired return 401
    if (!passwordResetToken || Date.now() > passwordResetToken.expiresAt)
      return next(new errors.AuthorizationError());

    // make sure the new password is present
    if (!body.newPassword)
      return res.status(HttpStatus.BAD_REQUEST).json(convertCase.snakeCase({
        error: {
          status: HttpStatus.BAD_REQUEST,
          code: 'VALIDATION_ERROR',
          validations: {
            newPassword: {
              error: 'REQUIRED'
            }
          }
        }
      }));

    // get the user
    const user = passwordResetToken.user;

    // update the password
    user.password = body.newPassword;
    // save
    await user.save();

    // delete the password reset token
    await passwordResetToken.remove();

    res.status(HttpStatus.CREATED).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  resetPassword: resetPassword,
  createPassword: createPassword
};