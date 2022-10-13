import nodemailer from 'nodemailer';
 
export default function (req, res) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'abcinvoice2022@gmail.com',
          pass: 'qutt buhb waln pqje'
        }
    });
    const mailOptions = {
        from: 'abcinvoice2022@gmail.com',
        to: req.body.emailTo,
        subject: `Your Project INC Registration Link`,
        text: `
        Hi,

        Please proceed to https://sp-inc-student-application-ccna.vercel.app/form/${req.body.nano_id_url} to complete your registration details.
        Thank you for signing up! 
         `,
    
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
    res.status(200).send("Email successfully sent");
}

/*
const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sp.project.inc@gmail.com',
          pass: 'vzvp togm tvxt czer'
        }
    });
    const mailOptions = {
        from: 'sp.project.inc@gmail.com',
        to: req.body.emailTo,
        subject: `Your Project INC Registration Link`,
        text: `
        Hi,

        Please proceed to https://sp-inc-student-application-ccna.vercel.app/form/${req.body.nano_id_url} to complete your registration details.
        Thank you for signing up! 
         `,
    
    };
*/