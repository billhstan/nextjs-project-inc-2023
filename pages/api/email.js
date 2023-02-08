import nodemailer from 'nodemailer';
 
export default async (req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'billhstan@gmail.com',
          pass: 'syep cpps jmht vbvf'
      },
        secure: true
    });
  
  
  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log("Server is ready to take our messages");
            resolve(success);
        }
    });
});
  
  
    const mailOptions = {
        from: 'billhstan@gmail.com',
        to: req.body.emailTo,
        subject: `Your Project INC Registration Link`,
        text: `
        Hi,

        Please proceed to https://nextjs-project-inc-2023.vercel.app/form/${req.body.nano_id_url} to complete your registration details. Always use this link to update your application details.
        Thank you for signing up! 
         `,
    
    };
      
    await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            reject(err);
        } else {
            console.log(info);
            resolve(info);
        }
    });
});

res.status(200).json({ status: "OK" });
}

 