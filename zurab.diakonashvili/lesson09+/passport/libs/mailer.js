/** create reusable transporter object using the default SMTP transport */

'use strict';

const nodemailer = require('nodemailer');
const config = require('config');

/*  https://www.sitepoint.com/sending-email-using-node-js/
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
  host: 'krr-ln01',
  port: 25,
  auth: {
    user: 'username',
    pass: 'password'
  }
}));
*/

let {protocol, login, password, host, port} = config.mailOptions;
if (!!password) password = ':' + password;
const connectString = `${protocol}://${login}${password}@${host}:${port}`;

const transporter = nodemailer.createTransport(connectString);

module.exports = function (mailOptions) {
  return new Promise(function(resolve, reject) {
    let {
      from    = config.mailOptions.from,
      to      = config.mailOptions.to,
      subject = config.mailOptions.subject,
      text    = config.mailOptions.text,
      html    = config.mailOptions.html
    } = mailOptions;

    mailOptions = {from, to, subject, text};

    if (!!html) mailOptions["html"] = html;

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      };
    });
  });
};
