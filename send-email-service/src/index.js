var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyensonha.hanz@gmail.com',
    pass: 'eudurgzfmirozuwn',
  },
})

var mailOptions = {
  from: '"sonha from Flexin ✨" <nguyensonha.hanz@gmail.com>',
  to: 'ecomverseplatform@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
}

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error)
  } else {
    console.log('Email sent: ' + info.response)
  }
})
