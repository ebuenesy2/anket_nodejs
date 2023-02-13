'use strict';
const dayjs = require('dayjs'); //! Zaman
const fs = require("fs"); //! Dosya
const sign = require('jwt-encode'); //! Token
const jwt_decode = require('jwt-decode'); //! Token

//! Mail
const nodemailer = require('nodemailer'); //! Mail
var EpostaConnectStatus = false; //! E-Posta Status
var EpostaConnectMesaj = "EpostaConnectMesaj"; //! E-Posta Mesaj
let transporter;
//! Mail Son


module.exports = {
	name: "mail",
    created() {
        var email = process.env.MAIL_USERNAME;
        email = email.split("@");

        var emailHost = 'smtp.gmail.com';
        var emailPost = 587;

        if (email[1] === "gmail.com") {
            emailHost = 'smtp.gmail.com';
            emailPost = 587;
        }
        else if (email[1] === "yandex.com") {
            emailHost = 'smtp.yandex.com.tr';
            emailPost = 465;
        }
        else if (email[1] === "hotmail.com") {
            emailHost = 'smtp.office365.com';
            emailPost = 587;
        }

        
        /************* Mail *********** */
        transporter = nodemailer.createTransport({
            host: emailHost,
            port: emailPost,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        transporter.verify(function (error, success) {

            if (error) {
                
                EpostaConnectStatus = false;
                EpostaConnectMesaj = error;

                console.log('\u001b[' + 31 + 'm' + 'Eposta Bağlantı Hatası:' + error + '\u001b[0m');
            }
            else {
                        
                EpostaConnectStatus = true;
                EpostaConnectMesaj = "Eposta Bağlantı Başarılı Oldu";

                console.log('\u001b[' + 32 + 'm' + 'Eposta Bağlantı Başarılı Oldu:' + success + '\u001b[0m');

            }

        });
        /************* Mail Son *********** */

    },
	actions: {
		async info(ctx) {

			//! Return Api
			ctx.params.title = "mail.service -> Info"
			ctx.params.table = "mail.json"
			ctx.params.time = dayjs().toDate()
			ctx.params.note = "Mail Gönderme"
            ctx.params.APi_URL = process.env.APi_URL
            
            //Console Yazma
            console.log('\u001b[' + 32 + 'm' + '[Mail] [Info] Bilgiler [ /api/mail/info ] ' + '\u001b[0m');

			return ctx.params
		},
		async post(ctx) {

			//! Return Api
			ctx.params.createdAt = dayjs().toDate();
            delete ctx.params.createdAt;            
                        
            //Console Yazma
            console.log('\u001b[' + 32 + 'm' + '[Mail] [Post] Post Kullanımı [ /api/mail/post ] ' + '\u001b[0m');

            return ctx.params
            
		},
		async html(ctx) {
		
            ctx.meta.$responseType = "text/html";
            return Buffer.from(`
                    <html>
                    <body>
                        <h1>Hello API ebu enes!</h1>
                        <img src="/api/file.image" />
                    </body>
                    </html>
            `);
			
        },
        async status(ctx) {
		
           
			//! Return Api
			ctx.params.title = "mail.service -> status"
			ctx.params.table = "mail.json"
			ctx.params.email = process.env.Email
            ctx.params.pass = process.env.Password
            ctx.params.status = EpostaConnectStatus;
            ctx.params.msg = EpostaConnectMesaj;
                                    
            //Console Yazma
            console.log('\u001b[' + 32 + 'm' + '[Mail] [Post] Post Kullanımı [ /api/mail/post ] ' + '\u001b[0m');

			return ctx.params
			
        },
        async send(ctx) {
            
            //! Return
            let status = "success";		
            let message = "message";
            
            try {
                
              	    //! Return
					let status = "success";		
					let message = "message";			
                
					let mailOptions = {
                        from: process.env.MAIL_FROM_NAME+" " + process.env.MAIL_USERNAME,
                        to:  ctx.params.toEmail,
                        subject: ctx.params.subject,
                        text: ctx.params.text
                    };
					

					transporter.sendMail(mailOptions, async (error) => {
						if (error) {
							console.log("error:", error);
							status = "error";
                            message = error;

                            console.log('\u001b[' + 31 + 'm' + 'Eposta Gönderme Hatası:' + error + '\u001b[0m');
						} else {
							// mail gönderim sonrasında işlem varsa burda yap
							status = "success";
                            message = "mesaj gönderildi";
                            
                            console.log('\u001b[' + 32 + 'm' + 'Eposta Gönderme Başarılı:' + status + '\u001b[0m');
						}
					});

					ctx.params.status = status;
					ctx.params.message = message;

            } catch (error) {

				ctx.params.status = "error"
                ctx.params.error = error
                
                console.log('\u001b[' + 31 + 'm' + 'Eposta Gönderme Hatası:' + error + '\u001b[0m');
            }

            let mailData = {
                from: process.env.MAIL_USERNAME,
                to: ctx.params.toEmail,
                subject: ctx.params.subject,
                text : ctx.params.text
            }

            //! Return Api
            ctx.params.title = "mail.service -> send"
            ctx.params.table = "mail.json"
            ctx.params.mailInfo = mailData
            ctx.params.status = status
			ctx.params.message = message
              
            //! Delete
            delete ctx.params.toEmail
            delete ctx.params.subject
            delete ctx.params.text

            return ctx.params
        },
        async sendHtml(ctx) {
            
            //! Return
            let status = "success";		
            let message = "message";
            
            try {
                
              	    //! Return
					let status = "success";		
					let message = "message";			
                
					let mailOptions = {
                        from: process.env.MAIL_FROM_NAME+" " + process.env.MAIL_USERNAME,
                        to:  ctx.params.toEmail,
                        subject: ctx.params.subject,
                        html: ctx.params.html
                    };
					

					transporter.sendMail(mailOptions, async (error) => {
						if (error) {
							console.log("error:", error);
							status = "error";
                            message = error;

                            console.log('\u001b[' + 31 + 'm' + 'Eposta Gönderme Hatası:' + error + '\u001b[0m');
						} else {
							// mail gönderim sonrasında işlem varsa burda yap
							status = "success";
                            message = "mesaj gönderildi";
                            
                            console.log('\u001b[' + 32 + 'm' + 'Eposta Gönderme Başarılı:' + status + '\u001b[0m');
						}
					});

					ctx.params.status = status;
					ctx.params.message = message;

            } catch (error) {

				ctx.params.status = "error"
                ctx.params.error = error
                
                console.log('\u001b[' + 31 + 'm' + 'Eposta Gönderme Hatası:' + error + '\u001b[0m');
            }

            let mailData = {
                from: process.env.MAIL_USERNAME,
                to: ctx.params.toEmail,
                subject: ctx.params.subject,
                html : ctx.params.html
            }

            //! Return Api
            ctx.params.title = "mail.service -> send"
            ctx.params.table = "mail.json"
            ctx.params.mailInfo = mailData
            ctx.params.status = status
			ctx.params.message = message
              
            //! Delete
            delete ctx.params.toEmail
            delete ctx.params.subject
            delete ctx.params.html

            return ctx.params
        },
        async sendFile(ctx) {
            
            //! Return
            let status = "success";		
            let message = "message";
            
            try {
                
              	    //! Return
					let status = "success";		
					let message = "message";			
                
					let mailOptions = {
                        from: process.env.MAIL_FROM_NAME+" " + process.env.MAIL_USERNAME,
                        to:  ctx.params.toEmail,
                        subject: ctx.params.subject,
                        html: ctx.params.html,
                        attachments: [{
                            filename: 'fileName.png',
                            content: fs.createReadStream('C:\\Yıldırım\\Nodejs\\public\\upload\\user\\img\\1666940009736.png')
                        }]
                    };
					

					transporter.sendMail(mailOptions, async (error) => {
						if (error) {
							console.log("error:", error);
							status = "error";
                            message = error;

                            console.log('\u001b[' + 31 + 'm' + 'Eposta Gönderme Hatası:' + error + '\u001b[0m');
						} else {
							// mail gönderim sonrasında işlem varsa burda yap
							status = "success";
                            message = "mesaj gönderildi";
                            
                            console.log('\u001b[' + 32 + 'm' + 'Eposta Gönderme Başarılı:' + status + '\u001b[0m');
						}
					});

					ctx.params.status = status;
					ctx.params.message = message;

            } catch (error) {

				ctx.params.status = "error"
                ctx.params.error = error
                
                console.log('\u001b[' + 31 + 'm' + 'Eposta Gönderme Hatası:' + error + '\u001b[0m');
            }

            let mailData = {
                from: process.env.Email,
                to: ctx.params.toEmail,
                subject: ctx.params.subject,
                html : ctx.params.html
            }

            //! Return Api
            ctx.params.title = "mail.service -> send"
            ctx.params.table = "mail.json"
            ctx.params.mailInfo = mailData
            ctx.params.status = status
			ctx.params.message = message
              
            //! Delete
            delete ctx.params.toEmail
            delete ctx.params.subject
            delete ctx.params.html

            return ctx.params
        }
    },
    
}
