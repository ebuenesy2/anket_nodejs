'use strict';
const dayjs = require('dayjs'); //! Time
const fs = require("fs"); //! File
const sign = require('jwt-encode'); //! Token
const jwt_decode = require('jwt-decode'); //! Token
const db = require('../public/DB/user.json'); //! Json
var md5 = require('md5'); //! Md5


module.exports = {
	name: "user",

	actions: {
		async info(ctx) {
		
			//! Return Api
			ctx.params.title = "user.service -> Info"
			ctx.params.table = "user.json"
			ctx.params.time = dayjs().toDate()
			ctx.params.note = ""
			ctx.params.APi_URL=process.env.APi_URL

			return ctx.params

		},
		async post(ctx) {

			//! Return Api
			ctx.params.createdAt = dayjs().toDate();
			delete ctx.params.createdAt;

			return ctx.params
		},
		async html(ctx) {
		
            ctx.meta.$responseType = "text/html";
            return Buffer.from(`
                    <html>
                    <body>
                        <h1>Hello API bex360!</h1>
                        <img src="/api/file.image" />
                    </body>
                    </html>
            `);
			
		},
		async all(ctx) {

			const dbFind_online = db.filter(u => u.onlineStatus == true);

			try {
				
				
				//! Return Api   
				ctx.params.title = "user.service -> All Data"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size = db.length
				ctx.params.DB = db?.sort((a, b) => (a.id > b.id ? -1 : 1))
				ctx.params.onlineCount = dbFind_online.length
				ctx.params.DB_online = dbFind_online?.sort((a, b) => (a.id > b.id ? -1 : 1))
				
				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [All] All Data Read [ /api/user/all ] ' + '\u001b[0m');

			} catch (error) {

				//! Return Api   
				ctx.params.title = "user.service -> All Data"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.size = 0
				ctx.params.DB = []
				ctx.params.onlineCount = 0
				ctx.params.DB_online = []

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [All] All Data Could Not Read  [ /api/user/all ] ' + '\u001b[0m');
				console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
			
			}



			//! Return
			return ctx.params
		},
		async all_params(ctx) {
            
			try {
				
				//! Incoming Data
				const page = ctx.params.page || 1;
				const rowcount = ctx.params.rowcount || 10;
				const order = ctx.params.order || "desc";
				
				//! Calculation
				const bottomLimit = (page - 1) * rowcount; //! Lower Boundary
				const topLimit = page * rowcount; //! Upper  Boundary
				
			    //! Data
				const dbLimit = db.slice(bottomLimit, topLimit);
				
			
				//! Return Api   
				ctx.params.title = "user.service -> All Data"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size=dbLimit.length
			    ctx.params.DB = order === "asc" ? dbLimit?.sort((a, b) => (a.id < b.id ? -1 : 1)) : dbLimit?.sort((a, b) => (a.id > b.id ? -1 : 1))

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[user] [All] All Data Read [ /api/user/all/params ] ' + '\u001b[0m');

			} catch (error) {

				//! Return Api   
				ctx.params.title = "user.service -> All Data"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.size= 0
				ctx.params.DB = error

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[user] [All] All Data Could Not Read  [ /api/user/all/params ] ' + '\u001b[0m');
				console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
			
			}
			
			//! Delete
			delete ctx.params.page
			delete ctx.params.rowcount
			delete ctx.params.order

			//! Return
			return ctx.params
			
		},
		async find(ctx) {

			//! Search
			const dbFind = db.find(u => u.id == ctx.params.id);

			//! If Data Is Available
			if (dbFind) {

				//! Birth Day Calculation
				dbFind["age"] = dayjs().year() - dayjs(dbFind.dateofBirth).year()  // Ya????n?? Hesapl??yoruz
		

				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Kullan??c?? Data Search [ /api/user/:id ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = "No Data Found"

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] Kullan??c?? No Data Found [ /api/user/:id ] ' + '\u001b[0m');		
			}

			//! Return
			delete ctx.params.id

			return ctx.params
		},
		async find_post(ctx) {

			//! Search
			const dbFind = db.find(u => u.id == ctx.params.id && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available
			if (dbFind) {

				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Kullan??c?? Data Search [ /api/user/find_post ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = "No Data Found"

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] Kullan??c?? No Data Found [ /api/user/find_post ] ' + '\u001b[0m');		
			}

			//! Return
			delete ctx.params.id
			delete ctx.params.serverToken

			return ctx.params
		},
		async find_token(ctx) {

			//! Search
			const dbFind = db.find(u => u.token == ctx.params.token && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available
			if (dbFind) {
				
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Kullan??c?? Data Search [ /api/user/find_token ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = []

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] Kullan??c?? No Data Found [ /api/user/find_token ] ' + '\u001b[0m');		
			}

			//! Return
			delete ctx.params.token
			delete ctx.params.serverToken

			return ctx.params
		},
		async find_country(ctx) {

			//! Search
			const dbFind = ctx.params.city == null ? db.filter(u => u.country == ctx.params.country && u.serverToken == ctx.params.serverToken ) : db.filter(u => u.country == ctx.params.country && u.city == ctx.params.city && u.serverToken == ctx.params.serverToken );
			const dbFind_online = ctx.params.city == null ? db.filter(u => u.onlineStatus == true && u.country == ctx.params.country && u.serverToken == ctx.params.serverToken ) : db.filter(u => u.onlineStatus == true && u.country == ctx.params.country && u.city == ctx.params.city && u.serverToken == ctx.params.serverToken );
		
			//! If Data Is Available
			if (dbFind) {

				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size= dbFind.length
				ctx.params.DB = dbFind?.sort((a, b) => (a.id > b.id ? -1 : 1))
				ctx.params.onlineCount=dbFind_online.length
				ctx.params.DB_online=dbFind_online?.sort((a, b) => (a.id > b.id ? -1 : 1))

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Kullan??c?? Data Search [ /api/user/find_country ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.size= 0
				ctx.params.DB = []
				ctx.params.onlineCount=0
				ctx.params.DB_online = []

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] Kullan??c?? No Data Found [ /api/user/find_country ] ' + '\u001b[0m');		
			}

			//! Return
			delete ctx.params.country
			delete ctx.params.city
			delete ctx.params.serverToken

			return ctx.params
		},
		async find_gender(ctx) {

			//! Search
			const dbFind = db.filter(u => u.gender == ctx.params.gender && u.serverToken == ctx.params.serverToken );	
			const dbFind_online = db.filter(u => u.gender == ctx.params.gender && u.onlineStatus == true && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available
			if (dbFind) {

				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size=dbFind.length
				ctx.params.DB = dbFind?.sort((a, b) => (a.id > b.id ? -1 : 1))
				ctx.params.onlineCount=dbFind_online.length
				ctx.params.DB_online=dbFind_online?.sort((a, b) => (a.id > b.id ? -1 : 1))

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Kullan??c?? Data Search [ /api/user/find_gender ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.size= 0
				ctx.params.DB = []
				ctx.params.onlineCount=0
				ctx.params.DB_online = []

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] Kullan??c?? No Data Found [ /api/user/find_gender ] ' + '\u001b[0m');		
			}

			//! Return
			delete ctx.params.gender
			delete ctx.params.serverToken

			return ctx.params
		},
		async find_dateofBirth(ctx) {

			//! Day
			let searchTime = ctx.params.searchTime;

			//! Search
			const dbFind = ctx.params.day == true ? db.filter(u => u.monthOfBirth == dayjs(searchTime).add(1, 'month').month() && u.dayOfBirth == dayjs(searchTime).date() && u.serverToken == ctx.params.serverToken ) : db.filter(u => u.monthOfBirth == dayjs(searchTime).add(1, 'month').month() && u.serverToken == ctx.params.serverToken );
			const dbFind_online = ctx.params.day == true ? db.filter(u => u.monthOfBirth == dayjs(searchTime).add(1, 'month').month() && u.dayOfBirth == dayjs(searchTime).date()  && u.onlineStatus == true && u.serverToken == ctx.params.serverToken ) : db.filter(u => u.monthOfBirth == dayjs(searchTime).add(1, 'month').month()  && u.onlineStatus == true && u.serverToken == ctx.params.serverToken );
			
			
			//! If Data Is Available
			if (dbFind) {

				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size=dbFind.length
				ctx.params.DB = dbFind?.sort((a, b) => (a.id > b.id ? -1 : 1))
				ctx.params.onlineCount=dbFind_online.length
				ctx.params.DB_online=dbFind_online?.sort((a, b) => (a.id > b.id ? -1 : 1))

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Kullan??c?? Data Search [ /api/user/find_dateofBirth ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.size= 0
				ctx.params.DB = []
				ctx.params.onlineCount=0
				ctx.params.DB_online = []

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] Kullan??c?? No Data Found [ /api/user/find_dateofBirth ] ' + '\u001b[0m');		
			}

			//! Return
			delete ctx.params.serverToken
			delete ctx.params.searchTime
			delete ctx.params.month
			delete ctx.params.day

			return ctx.params
		},
		async find_email(ctx) {

			//! Search
			const dbFind = db.find(u => u.email == ctx.params.email && u.serverToken == ctx.params.serverToken );
			
			//! If Data Is Available
			if (dbFind) {

				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Kullan??c?? Data Search [ /api/user/find_email ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = "No Data Found"

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] Kullan??c?? No Data Found [ /api/user/find_email ] ' + '\u001b[0m');		
			}

			//! Return
			delete ctx.params.email
			delete ctx.params.serverToken

			return ctx.params
		},
		async find_serverToken(ctx) {

			//! Search
			const dbFilter = db.filter(u => u.serverToken == ctx.params.serverToken);

			//! If Data Is Available
			if (dbFilter.length > 0) {   	   
				
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Data Search [ /api/user/find_serverToken ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = "user  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] No Data Found [ /api/user/find_serverToken ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.serverToken

			return ctx.params
		},
		async find_serverId(ctx) {

			//! Search
			const dbFilter = db.filter(u => u.serverId == ctx.params.serverId);

			//! If Data Is Available
			if (dbFilter.length > 0) {   	               
                
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Data Search [ /api/user/find_serverToken ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = "user  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] No Data Found [ /api/user/find_serverToken ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.serverId

			return ctx.params
		},
		async find_adminCheck(ctx) {

			//! Search
			const dbFilter = db.filter(u => u.adminCheck == ctx.params.adminCheck && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available
			if (dbFilter.length > 0) {   	               
                
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Data Search [ /api/user/find_serverToken ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = "user  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] No Data Found [ /api/user/find_serverToken ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.adminCheck
			delete ctx.params.serverToken

			return ctx.params
		},
		async find_userRole(ctx) {

			//! Search
			const dbFilter = db.filter(u => u.userRoleId == ctx.params.userRoleId && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available
			if (dbFilter.length > 0) {   	               
                
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Data Search [ /api/user/find_userRole ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = "user  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] No Data Found [ /api/user/find_userRole ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.userRoleId
			delete ctx.params.serverToken

			return ctx.params
		},
		async find_userType(ctx) {

			//! Search
			const dbFilter = db.filter(u => u.userTypeId == ctx.params.userTypeId && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available
			if (dbFilter.length > 0) {   	               
                
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Find] Data Search [ /api/user/find_userRole ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "user.service -> Data Search"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.DB = "user  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Find] No Data Found [ /api/user/find_userRole ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.userTypeId
			delete ctx.params.serverToken

			return ctx.params
		},
		async add(ctx) {

			try {

				    //! Sabit
				    let error_check=0;    
				    let status=0;    
				    let message="";  
				    let userToken="";  

					//! Find
					const user_email = db.find(u => u.email == ctx.params.email);
					const user_username = db.find(u => u.username == ctx.params.username);
					const user_phone = db.find(u => u.phone == ctx.params.phone);
					const user_gsm = db.find(u => u.gsm == ctx.params.gsm);

					//! email check
					if(user_email) {
						error_check=1
						status = 0
						message = "Bu Email Kay??tl??d??r."			
					}

					//! email check
					if(ctx.params.email==""||ctx.params.email==null) {
						error_check=1
						status = 0
						message = "Email Bo?? Ge??iremez."						
					}

					
                    
					
					if(error_check==0) {

							//! Token
							let TokenId=new Date().getTime();
							let DateNow=dayjs().format();

							let TokenInfo={				
								id: TokenId,
								email:ctx.params.email,	
								name: ctx.params.name,
								surname: ctx.params.surname
							}
							
							var secret = process.env.TokenSecret;
							var data = TokenInfo;
							var jwt = sign(data, secret);		
							//! End Token
						
						    //! Token 
						    userToken = jwt 
							
						
						   //! Encrypts the password with md5
						   const password = md5(ctx.params.password); //! MD5
						
				
						
							//! Data to add
							const willSaveData = {
								id: TokenId,							
							    serverId: ctx.params.serverId,
								serverToken: ctx.params.serverToken,
								userRoleTitle: null,
								userRoleToken: ctx.params.userRoleToken ? ctx.params.userRoleToken : "token3",
								userTypeTitle: null,
								userTypeToken: ctx.params.userTypeToken ? ctx.params.userTypeToken : "token1",
								name: ctx.params.name || null,
								surname: ctx.params.surname || null,
								userImageUrl: process.env.Default_UserImageUrl || null,
								userImageUploadUrl: null,
								coverImageUrl: null,
								coverImageUploadUrl: null,
								username: ctx.params.username ? ctx.params.username : null,
								email: ctx.params.email,
								password: password || null,	
								phone: ctx.params.phone || null,
								gsm: ctx.params.gsm ? ctx.params.gsm : null,
								adminCheck: 0,
								confirmation_code : "",
								token:jwt,
								onlineStatus:0,												
								onlineLastLogin_At:null,												
								onlineLastLoginout_At:null,												
								onlinePage:null,												
								onlineDurationMs:0,
								totalDurationTime:"0gun/0ay/0y??l 0sa:0dk:0sn:0ms",										
								onlineMod:null,												
								created_at: DateNow,
								created_byToken:ctx.params.created_byToken,
								isUpdated: false,
								updated_at: null,
								updated_byToken:null,
								isActive:false,
								isDeleted:false,
								deleted_at:null,
								deleted_byToken:null
						}		
						
							//Save Data
							db.push(willSaveData)

							//Writing Data into Json -> db
							fs.writeFile('./public/DB/user.json', JSON.stringify(db), err => {

								// If there is an error
								if (err) {
									console.log('\u001b[' + 31 + 'm' + '[User] [Json] [Add] Failed to Save Json Data [ user.json ] ' + '\u001b[0m');	
									console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
								}							

								//! Console Writing
								console.log('\u001b[' + 32 + 'm' + '[User] [Json] [Add] Json Data Saved [ user.json ] ' + '\u001b[0m');								
								
							});			

							//! Return Api   
							status = 1	
						    message = "Data Added"
						 
						    if (process.env.MailSend_UserRegisterConfirmationStatus == 1) {
							
								var messageHtml = '';
							
								messageHtml += '<div style="display: flex;">';
						
								messageHtml += '<div style="font-family: Tahoma;position: relative; border: 1px solid #e6eaee; border-radius: 5px; background-color: #eff3f6; width: 100%; margin-left: auto; margin-right: auto; padding: 25px; font-size: small;">';
								messageHtml += '<div style="width: 100%;" >';
								messageHtml += '<img src="'+ process.env.Default_Site_Logo+'" alt="" srcset="">';
								messageHtml += '</div>';
								messageHtml += '<h2>Merhaba '+ctx.params.name+" "+ctx.params.surname+'</h2> ';
								messageHtml += '<p>Anket Projesi Sistemine kay??t oldu??unuz i??in ??ok te??ekk??r ederiz.</p>';
								messageHtml += '</div>';

								messageHtml += '</div>';
								
							
								//! -----------  Mail Send Html ----------------------------- 	
								let mail_send = await ctx.call('mail.sendHtml', {
									toEmail: ctx.params.email,
									subject: "Tebrikler Ba??ar??l?? Kay??t Oldunuz.",
									html: messageHtml
								})
								//! -----------  Mail Send Html ----------------------------- 
								
								
							}
								
					}

					//! Return Api   
					ctx.params.title = "user.service -> Adding Data"
					ctx.params.table = "user.json"
					ctx.params.status = status
					ctx.params.token = userToken
					ctx.params.message = message	

					//! Console Writing
					if(status==1) { console.log('\u001b[' + 32 + 'm' + '[User] [Add] Kullan??c?? Data Added [ /api/user/add ]' + '\u001b[0m'); }
					if (status == 0) {
						console.log('\u001b[' + 31 + 'm' + '[User] [Add] Kullan??c?? Failed to Add Data [ /api/user/add ]' + '\u001b[0m');
						console.log('\u001b[' + 31 + 'm' + '[User] [Add] Error: '+message + '\u001b[0m');
					}
										
													    
			} catch (error) {

				//! Return Api   
				ctx.params.title = "user.service -> Adding Data"
				ctx.params.table = "user.json"			
				ctx.params.status = 0
				ctx.params.token = ""
				ctx.params.message = "Failed to Add Data"			

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Add] Kullan??c?? Failed to Add Data [ /api/user/add ] ' + '\u001b[0m');
				console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');

			}


			//! Return Delete				
			delete ctx.params.serverId
			delete ctx.params.serverToken
			
			delete ctx.params.userRoleId
			delete ctx.params.userRoleToken
			delete ctx.params.userTypeId
			delete ctx.params.userTypeToken

			delete ctx.params.companyToken
			delete ctx.params.categoryToken
			delete ctx.params.bankAccountToken
			
			delete ctx.params.name
			delete ctx.params.surname
			delete ctx.params.email
			delete ctx.params.username

			delete ctx.params.phone
			delete ctx.params.gsm
			delete ctx.params.address
			delete ctx.params.profession

			delete ctx.params.dateofBirth
			delete ctx.params.country
			delete ctx.params.city
			delete ctx.params.gender

			delete ctx.params.password
			delete ctx.params.created_byToken

			return ctx.params
		},
		async update(ctx) {

			//! Search
			const dbFind = db.find(u => u.token == ctx.params.token  && u.serverToken == ctx.params.serverToken );

		    	// Kullan??c?? Varsa
			if (dbFind) {
				
				//! Image Y??kleme Onay - Profil
				if(ctx.params.profil_ImageUrl_File_Check=="0") { 	console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Profile] Profil Image Upload Onaylanmad??' + '\u001b[0m'); }
				if(ctx.params.profil_ImageUrl_File_Check=="1") {    console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Profile] Profil Image Upload Onayland??' + '\u001b[0m');

					//! -----------  File UPLOAD ----------------------------- 	
					let file_upload_profile = await ctx.call('file.upload', {
						file: ctx.params.profil_ImageUrl_File,
						role: ctx.params.role,
						usedPage: "user",
						created_byToken: ctx.params.updated_byToken
					})
					//! ----------- End File UPLOAD -----------------------------
									
					if (file_upload_profile.status == 0) { console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Profile] Profil File Y??klenemedi' + '\u001b[0m'); }
					if (file_upload_profile.status == 1) {

						//! -----------  File Delete ----------------------------- 	
						let file_delete_user = await ctx.call('file.fileDeleteUrl', {
							created_byToken: ctx.params.updated_byToken,
							fileUrl: dbFind.userImageUploadUrl               
						})                
						//! ----------- End File Delete -----------------------------

						if (file_delete_user.status==1)  { console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Profile] File Silindi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }
						if (file_delete_user.status==0)  { console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Profile] File Silinemedi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }
					
						//! Update
						dbFind["userImageUploadUrl"] = file_upload_profile.DB["uploadDir"];
						dbFind["userImageUrl"] = file_upload_profile.DB["fileUrl"];
					}
				}

				//! Image Upload Onay - Cover
				if(ctx.params.cover_ImageUrl_File_Check=="0") { 	console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Cover] Cover Image Upload Onaylanmad??' + '\u001b[0m'); }
				if (ctx.params.cover_ImageUrl_File_Check == "1") {
				
					console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Cover] Cover Image Upload Onayland??' + '\u001b[0m');

					//! -----------  File UPLOAD ----------------------------- 	
					let file_upload_cover = await ctx.call('file.upload', {
						file: ctx.params.cover_ImageUrl_File,
						role: ctx.params.role,
						created_byToken: ctx.params.updated_byToken,
						usedPage: "user"
					})
					//! ----------- End File UPLOAD -----------------------------
									
					if (file_upload_cover.status == 0) { console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Cover] Cover File Y??klenemedi' + '\u001b[0m'); }
					if (file_upload_cover.status == 1) {						

						//! -----------  File Delete ----------------------------- 	
						let file_delete_cover = await ctx.call('file.fileDeleteUrl', {
							created_byToken: ctx.params.updated_byToken,
							fileUrl: dbFind.coverImageUploadUrl               
						})                
						//! ----------- End File Delete -----------------------------

						if (file_delete_cover.status==1)  { console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Cover] File Silindi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }
						if (file_delete_cover.status==0)  { console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Cover] File Silinemedi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }

						//! Update
						dbFind["coverImageUploadUrl"] = file_upload_cover.DB["uploadDir"];
						dbFind["coverImageUrl"] = file_upload_cover.DB["fileUrl"];
					}	
				}

				//! Delete
				delete ctx.params.profil_ImageUrl_File
				delete ctx.params.profil_ImageUrl_File_Check
				delete ctx.params.cover_ImageUrl_File
				delete ctx.params.cover_ImageUrl_File_Check

				// Reference Data Updating
				Object.keys(ctx.params).forEach(key => {					
					if(key!="profil_ImageUrl_File" || key!="cover_ImageUrl_File"  ) { dbFind[key] = ctx.params[key] }  //! Only Text 				
				})
				dbFind["isUpdated"] = true
				dbFind["updated_at"] = dayjs().format()
			
				// End  Reference Data Updating				

				//Writing Data into Json -> db
				fs.writeFile('./public/DB/user.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[User] [Json] [Update] Failed to Save Json Data [ user.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err + '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[User] [Json] [Update] Json Data Saved [ user.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db


				//! Return Api   
				ctx.params.title = "user.service -> Veri Guncelleme"
				ctx.params.table = "user.json"			
				ctx.params.status = 1
				ctx.params.message = "Veri Kay??t Updatendi"	

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Update] Kullan??c?? Kay??t Updatendi [ /api/user/update ] ' + '\u001b[0m');			         

			}

			//! If there is no user
			else {

				//! Return Api   
				ctx.params.title = "user.service -> Veri Guncelleme"
				ctx.params.table = "user.json"			
				ctx.params.status = 0
				ctx.params.message = "Veri Guncellenemedi"			

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Update] Kullan??c?? Kay??t Guncellenemedi [ /api/user/update ] ' + '\u001b[0m');

			}

			//! Return Delete			
			delete ctx.params.token
			delete ctx.params.serverToken
			delete ctx.params.role
			
			delete ctx.params.companyToken
			delete ctx.params.categoryToken
			delete ctx.params.bankAccountToken

			delete ctx.params.profil_ImageUrl_File
            delete ctx.params.profil_ImageUrl_File_Check
			delete ctx.params.cover_ImageUrl_File
            delete ctx.params.cover_ImageUrl_File_Check
			delete ctx.params.updated_byToken
							
			delete ctx.params.name
			delete ctx.params.surname
			delete ctx.params.email
			delete ctx.params.username
			delete ctx.params.tel
			delete ctx.params.password

			delete ctx.params.age
			delete ctx.params.country
			delete ctx.params.city
			delete ctx.params.gender
			delete ctx.params.dateofBirth

			delete ctx.params.userImageUrl

			return ctx.params

		},
		async updateUrl(ctx){
		
			//! Search
			const dbFind = db.find(u => u.token == ctx.params.token  && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available 
			if (dbFind) {	         		
				
				//! Image Upload Onay - Profil
				if(ctx.params.profil_ImageUrl_File_Check=="0") { 	console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Profile] Profil Image Upload Onaylanmad??' + '\u001b[0m'); }
				if(ctx.params.profil_ImageUrl_File_Check=="1") { 	
				
					console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Profile] Profil Image Upload Onayland??' + '\u001b[0m');

					//! -----------  File UPLOAD ----------------------------- 	
					let file_upload_profile = await ctx.call('file.uploadUrl', {
						fileUrl: ctx.params.profil_ImageUrl_File,
						role: ctx.params.role,
						usedPage: "user",
						created_byToken: ctx.params.updated_byToken
					})
					//! ----------- End File UPLOAD ----------------------------- 	
									
					if (file_upload_profile.status==0) { console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Profile] File Y??klenemedi' + '\u001b[0m'); }
					if (file_upload_profile.status==1) {

						console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Profile] File Y??klendi' + '\u001b[0m'); }

						//! -----------  File Delete ----------------------------- 	
						let file_delete = await ctx.call('file.fileDeleteUrl', {
							created_byToken: ctx.params.updated_byToken,
							fileUrl: dbFind.userImageUploadUrl               
						})                
						//! ----------- End File Delete -----------------------------
					
						if (file_delete.status==1)  { console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Profile] File Silindi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }
						if (file_delete.status==0)  { console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Profile] File Silinemedi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }

						//! Update
						dbFind["userImageUploadUrl"] = file_upload_profile.DB["uploadDir"];
						dbFind["userImageUrl"] = file_upload_profile.DB["fileUrl"];
					}
				

				//! Image Upload Onay - Cover
				if(ctx.params.cover_ImageUrl_File_Check=="0") { 	console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Cover] Cover Image Upload Onaylanmad??' + '\u001b[0m'); }
				if(ctx.params.cover_ImageUrl_File_Check=="1") { 	
				
					console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Cover] Cover Image Upload Onayland??' + '\u001b[0m');

					//! -----------  File UPLOAD ----------------------------- 	
					let file_upload_cover = await ctx.call('file.uploadUrl', {
						fileUrl: ctx.params.cover_ImageUrl_File,
						role: ctx.params.role,
						token: ctx.params.token,                  
						usedPage: "user",
						created_byToken: ctx.params.updated_byToken
					})
					//! ----------- End File UPLOAD ----------------------------- 	

				
									
					if (file_upload_cover.status==0) { console.log('\u001b[' + 31 + 'm' + '[User] [Update] File Y??klenemedi' + '\u001b[0m'); }
					if (file_upload_cover.status==1) {

						//! -----------  File Delete ----------------------------- 	
						let file_delete = await ctx.call('file.fileDeleteUrl', {
							created_byToken: ctx.params.updated_byToken,
							fileUrl: dbFind.coverImageUploadUrl               
						})                
						//! ----------- End File Delete -----------------------------

						if (file_delete.status==1)  { console.log('\u001b[' + 32 + 'm' + '[User] [Update] [Cover] File Silindi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }
						if (file_delete.status==0)  { console.log('\u001b[' + 31 + 'm' + '[User] [Update] [Cover] File Silinemedi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }

						//! Update
						dbFind["coverImageUploadUrl"] = file_upload_cover.DB["uploadDir"];
						dbFind["coverImageUrl"] = file_upload_cover.DB["fileUrl"];
					}	
				}

				
				//! Delete
				delete ctx.params.profil_ImageUrl_File
				delete ctx.params.profil_ImageUrl_File_Check
				delete ctx.params.cover_ImageUrl_File
				delete ctx.params.cover_ImageUrl_File_Check

				// Reference Data Updating
				Object.keys(ctx.params).forEach(key => {					
					if(key!="profil_ImageUrl_File" || key!="cover_ImageUrl_File"  ) { dbFind[key] = ctx.params[key] }  //! Only Text 				
				})
				dbFind["isUpdated"] = true
				dbFind["updated_at"] = dayjs().format()
				// End  Reference Data Updating
				

				//Writing Data into Json -> db
				fs.writeFile('./public/DB/user.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[User] [Json] [Update] Failed to Save Json Data [ user.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[User] [Json] [Update] Json Data Saved [ user.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db				

				

				//! Return Api   
				ctx.params.title = "user.service -> Veri Guncelleme"
				ctx.params.table = "user.json"			
				ctx.params.status = 1
				ctx.params.message = "Veri Kay??t Updatendi"	

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Update] Kullan??c?? Kay??t Updatendi [ /api/user/updateUrl ] ' + '\u001b[0m');		

			}

			//! No Data 
			else {

				//! Return Api   
				ctx.params.title = "user.service -> Veri Guncelleme"
				ctx.params.table = "user.json"			
				ctx.params.status = 0
				ctx.params.message = "Veri Guncellenemedi"			

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Update] Kullan??c?? Kay??t Guncellenemedi [ /api/user/updateUrl ] ' + '\u001b[0m');

			}

			
			//! Return Delete			
			delete ctx.params.token
			delete ctx.params.serverToken
			delete ctx.params.role
			
			delete ctx.params.categoryTitle
			delete ctx.params.categoryToken

			delete ctx.params.profil_ImageUrl_File
            delete ctx.params.profil_ImageUrl_File_Check
			delete ctx.params.cover_ImageUrl_File
            delete ctx.params.cover_ImageUrl_File_Check
			delete ctx.params.updated_byToken
							
			delete ctx.params.name
			delete ctx.params.surname
			delete ctx.params.email
			delete ctx.params.username
			delete ctx.params.profession
			delete ctx.params.phone
			delete ctx.params.onlineStatus
			delete ctx.params.onlineLastLogin_At
			delete ctx.params.onlineLastLoginout_At

			delete ctx.params.age
			delete ctx.params.country
			delete ctx.params.city
			delete ctx.params.gender			
			delete ctx.params.dateofBirth	
			
			delete ctx.params.userImageUrl
			delete ctx.params.adminCheck
			delete ctx.params.companyToken

			return ctx.params		
		},	
		async updatePassword(ctx){
		
			//! Search
			const dbFind = db.find(u => u.token == ctx.params.token  && u.serverToken == ctx.params.serverToken && u.password == ctx.params.old_password );

			//! If Data Is Available 
			if (dbFind) {	   
				
				              
				// Reference Data Updating
				Object.keys(ctx.params).forEach(key => {					
					if(key!="userToken" && key!="old_password" && key!="new_password" ) { dbFind[key] = ctx.params[key] }  //! Only Text 				
				})
				
				dbFind["password"] = ctx.params.new_password
				dbFind["isUpdated"] = true
				dbFind["updated_at"] = dayjs().format()
				// End  Reference Data Updating
	
				//Writing Data into Json -> db
				fs.writeFile('./public/DB/user.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[User] [Json] [Update] Failed to Save Json Data [ user.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[User] [Json] [Update] Json Data Saved [ user.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	
	
				
				//! Return Api
				ctx.params.title = "user.service -> Veri Guncelleme"
				ctx.params.table = "user.json"			
				ctx.params.status = 1
				ctx.params.message = "Veri Guncellendi"

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Update] Kullan??c?? Password Updatendi [ /api/user/updatePassword ] ' + '\u001b[0m');
			}
			
			//! No Data
			else {

				//! Return Api   
				ctx.params.title = "user.service -> Veri Guncelleme"
				ctx.params.table = "user.json"			
				ctx.params.status = 0
				ctx.params.message = "Veri Guncellenemedi"			

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Update] Kullan??c?? Password Guncellenemedi [ /api/user/updatePassword ] ' + '\u001b[0m');

			}

			//! Return Delete			
			delete ctx.params.token
			delete ctx.params.serverToken
			delete ctx.params.updated_byToken
			delete ctx.params.old_password
			delete ctx.params.new_password

            

		    return ctx.params

				
		},
		async updateBankAccount(ctx){
		
			//! Search
			const dbFind = db.find(u => u.token == ctx.params.token  && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available 
			if (dbFind) {	   
				
				              
				// Reference Data Updating
				Object.keys(ctx.params).forEach(key => {					
					if(key!="userToken" && key!="old_password" && key!="new_password" ) { dbFind[key] = ctx.params[key] }  //! Only Text 				
				})
				
				dbFind["bankAccountToken"] = ctx.params.bankAccountToken.split(',')
				dbFind["isUpdated"] = true
				dbFind["updated_at"] = dayjs().format()
				// End  Reference Data Updating
	
				//Writing Data into Json -> db
				fs.writeFile('./public/DB/user.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[User] [Json] [Update] Failed to Save Json Data [ user.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[User] [Json] [Update] Json Data Saved [ user.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	
	
				
				//! Return Api
				ctx.params.title = "user.service -> Veri Guncelleme"
				ctx.params.table = "user.json"			
				ctx.params.status = 1
				ctx.params.message = "Veri Guncellendi"
				ctx.params.dbFind = dbFind

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Update] Kullan??c?? Password Updatendi [ /api/user/updatePassword ] ' + '\u001b[0m');
			}
			
			//! No Data
			else {

				//! Return Api   
				ctx.params.title = "user.service -> Veri Guncelleme"
				ctx.params.table = "user.json"			
				ctx.params.status = 0
				ctx.params.message = "Veri Guncellenemedi"			

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Update] Kullan??c?? Password Guncellenemedi [ /api/user/updatePassword ] ' + '\u001b[0m');

			}

			//! Return Delete			
			delete ctx.params.token
			delete ctx.params.serverToken
			delete ctx.params.updated_byToken
		

            

		    return ctx.params

				
		},
		async delete(ctx) {

			//! Search
			const dbFind = db.find(u => u.id == ctx.params.id);
			var index = db.findIndex(a => a.id == ctx.params.id && a.serverToken == ctx.params.serverToken );
			if (index > -1) {
                
				//! ----------- Json Delete ----------------------------- 	
				db.splice(index, 1);

			
				//Writing Data into Json -> db
				fs.writeFile('./public/DB/user.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[User] [Json] [Delete] Failed to Save Json Data [ user.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[User] [Json] [Delete] Json Data Saved [ user.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db
				//! ----------- Json Delete  END ----------------------------- 	
				
				
				//! -----------  File Delete ----------------------------- 	
				let file_delete_user = await ctx.call('file.fileDeleteUrl', {
					token: ctx.params.token,
					fileUrl: dbFind.userImageUploadUrl               
				})                
				//! ----------- End File Delete -----------------------------
				
				if (file_delete_user.status==1)  { console.log('\u001b[' + 32 + 'm' + '[User] [Delete] [Profile] File Silindi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }
				if (file_delete_user.status==0)  { console.log('\u001b[' + 31 + 'm' + '[User] [Delete] [Profile] File Silinemedi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }

				//! -----------  File Delete ----------------------------- 	
				let file_delete_cover = await ctx.call('file.fileDeleteUrl', {
					token: ctx.params.token,
					fileUrl: dbFind.coverImageUploadUrl               
				})                
				//! ----------- End File Delete -----------------------------
								
				if (file_delete_cover.status==1)  { console.log('\u001b[' + 32 + 'm' + '[User] [Delete] [Cover] File Silindi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }
				if (file_delete_cover.status==0)  { console.log('\u001b[' + 31 + 'm' + '[User] [Delete] [Cover] File Silinemedi [ /api/file/fileDeleteUrl ]' + '\u001b[0m');  }
			

				//! Return Api
				ctx.params.title = "user.service -> Data Deletion"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.message = "Data Deleted"

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Delete] Kullan??c?? Silindi [ /api/user/delete ]' + '\u001b[0m');	
	        	
			} else {
				
				//! Return Api
				ctx.params.title = "user.service -> Data Deletion"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.message = "Failed to Delete Data"

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Delete] Kullan??c?? Silinemedi [ /api/user/delete ]' + '\u001b[0m');	
			}

			//! Return Delete			
			delete ctx.params.id
			delete ctx.params.serverToken
			delete ctx.params.deleted_byToken

			return ctx.params	
		},
		async delete_update(ctx) {

			//! Search
			const dbFind = db.find(u => u.id == ctx.params.id && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available 
			if (dbFind) {
              
				//! Update
				dbFind["isDeleted"] = true
				dbFind["isActive"] = false
				dbFind["deleted_at"] = dayjs().format()
				dbFind["deleted_byToken"] = ctx.params.deleted_byToken
	
				//Writing Data into Json -> db
				fs.writeFile('./public/DB/user.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[User] [Json] [Delete_Updated] Failed to Save Json Data [ user.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[User] [Json] [Delete_Updated] Json Data Saved [ user.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	

              
                //! Return Api	
				ctx.params.title = "user.service -> Data Pass Deletion"
				ctx.params.table = "user.json"        
				ctx.params.status = 1			
				ctx.params.message="Data Updated"

				//! Console Writing	
				console.log('\u001b[' + 32 + 'm' + '[User] [Delete_Updated] Data Update [ /api/user/update ]' + '\u001b[0m');

			}

			//! No Data 
			else {
				
				
               //! Return Api	
			   ctx.params.title = "user.service -> Data Pass Deletion"
			   ctx.params.table = "user.json"        
			   ctx.params.status = 0			
			   ctx.params.message="Data could not be updated"

			   //! Console Writing	
			   console.log('\u001b[' + 31 + 'm' + '[User] [Delete_Updated] Data could not be updated [ /api/user/update ] ' + '\u001b[0m');

			}
			
			//! Return
			delete ctx.params.id
			delete ctx.params.serverToken
			delete ctx.params.deleted_byToken 
			
			return ctx.params

		},
		async loginOnline(ctx) {
			
			//! Password - Md5
			const passwordx = ctx.params.password
			const md5_create = md5(passwordx);

			//! Search
			const dbFind_email = db.filter(u => u.email == ctx.params.email);
			const dbFind = db.filter(u => u.email == ctx.params.email && u.password == md5_create && u.serverToken == ctx.params.serverToken );

			// Giri?? Ba??ar??l?? ise
			if (dbFind.length > 0) {

				//! -----------  User UPDATE ----------------------------- 	
				let user_updateUrl = await ctx.call('user.updateUrl', {
					token: dbFind[0]["token"],
					updated_byToken: dbFind[0]["token"],
					role: dbFind[0]["role"],
					onlineStatus: true,
					onlineLastLogin_At: dayjs().format(),
					onlineLastLoginout_At:null,
					lastDurationMs:0
				})
				//! ----------- End User UPDATE -----------------------------

				//! Kullan??c?? Update Yap??ld??
				if (user_updateUrl.status == "0") { console.log('\u001b[' + 31 + 'm' + '[User] [Login] Kullan??c?? Update Yap??lamad??' + '\u001b[0m'); }
				if (user_updateUrl.status == "1") {
					console.log('\u001b[' + 32 + 'm' + '[User] [Login] Kullan??c?? Update Yap??ld??' + '\u001b[0m');

					

				}

				//! Return Api
				ctx.params.title = "user.service -> Kullan??c?? Login"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.message = "Ba??ar??l?? Giri??  Oldu"
				ctx.params.userId= dbFind[0].id
				ctx.params.userToken= dbFind[0].token
				ctx.params.userInfo = dbFind[0]

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Login] Kullan??c?? Login Ba??ar??l?? [ /api/user/loginOnline ]' + '\u001b[0m');
			}

			//! If there is no user
			else {

				if (dbFind_email.length <= 0) { console.log('\u001b[' + 31 + 'm' + '[User] [Login] Email Yok' + '\u001b[0m'); }
				if (dbFind_email.length > 0) {
					console.log('\u001b[' + 32 + 'm' + '[User] [Login] Email Var' + '\u001b[0m');		
				}

				
				//! Bo?? veri g??nderiyoruz
				var userInfoData = {
					adminCheck: null,
					isActive: null
				}

				//! Return Api
				ctx.params.title = "user.service -> Kullan??c?? Login"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.message = dbFind_email.length > 0 ? "Sifreniz Yanl????" : "Kullan??c?? Bulunamad??"
				ctx.params.userId= 0
				ctx.params.userToken= null
				ctx.params.userInfo = userInfoData

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Login] Kullan??c?? Login Ba??ar??s??z [ /api/user/loginOnline ] ' + '\u001b[0m');

			}

	
			//! Delete
			delete ctx.params.serverToken
			delete ctx.params.email
			delete ctx.params.password

			return ctx.params
		},
		async loginOnlineUsername(ctx) {
			
			//! Password - Md5
			const passwordx = ctx.params.password
			const md5_create = md5(passwordx);

			//! Search
			const dbFind_username = db.filter(u => u.username == ctx.params.username);
			const dbFind = db.filter(u => u.username == ctx.params.username && u.password == md5_create && u.serverToken == ctx.params.serverToken );

			// Giri?? Ba??ar??l?? ise
			if (dbFind.length > 0) {

				//! -----------  User UPDATE ----------------------------- 	
				let user_updateUrl = await ctx.call('user.updateUrl', {
					token: dbFind[0]["token"],
					updated_byToken: dbFind[0]["token"],
					role: dbFind[0]["role"],
					onlineStatus: true,
					onlineLastLogin_At: dayjs().format(),
					onlineLastLoginout_At:null,
					lastDurationMs:0
				})
				//! ----------- End User UPDATE -----------------------------

				//! Kullan??c?? Update Yap??ld??
				if (user_updateUrl.status == "0") { console.log('\u001b[' + 31 + 'm' + '[User] [Login] Kullan??c?? Update Yap??lamad??' + '\u001b[0m'); }
				if (user_updateUrl.status == "1") {
					console.log('\u001b[' + 32 + 'm' + '[User] [Login] Kullan??c?? Update Yap??ld??' + '\u001b[0m');
				}

				//! Return Api
				ctx.params.title = "user.service -> Kullan??c?? Login"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.message = "Ba??ar??l?? Giri??  Oldu"
				ctx.params.userId= dbFind[0].id
				ctx.params.userToken= dbFind[0].token
				ctx.params.userInfo = dbFind[0]

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Login] Kullan??c?? Login Ba??ar??l?? [ /api/user/loginOnlineUsername ]' + '\u001b[0m');
			}

			//! If there is no user
			else {

				if (dbFind_username.length <= 0) { console.log('\u001b[' + 31 + 'm' + '[User] [Login] UserName Yok' + '\u001b[0m'); }
				if (dbFind_username.length > 0) {
					console.log('\u001b[' + 32 + 'm' + '[User] [Login] UserName Var' + '\u001b[0m');
				}


				//! Return Api
				ctx.params.title = "user.service -> Kullan??c?? Login"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.message = "Giri?? Ba??ar??s??z Oldu"
				ctx.params.userId= null
				ctx.params.userToken= null
				ctx.params.userInfo = null

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Login] Kullan??c?? Login Ba??ar??s??z [ /api/user/loginOnlineUsername ] ' + '\u001b[0m');

			}
		    

			//! Delete
			delete ctx.params.serverToken
			delete ctx.params.username
			delete ctx.params.password

			return ctx.params
		},
		async loginOut(ctx){

			//! Search
			//const user = db.filter(u => u.email == ctx.params.email && u.password == ctx.params.password);		
			const dbFind = db.filter(u => u.token == ctx.params.token);		
		
			//! Kullan??c?? Varsa
			if (dbFind) {  			

				let onlineLastLogin_At = dbFind[0].onlineLastLogin_At //! Login Oldu??u Time
				let _totalDurationMs = dbFind[0].totalDurationMs //! Toplam Time
                let _durationMs = new Date() - new Date(onlineLastLogin_At) //! Time Difference
				_totalDurationMs =Number(_totalDurationMs) + Number(_durationMs);  //! Toplam Time END

					

		
				//! -----------  User UPDATE ----------------------------- 	
				let user_updateUrl = await ctx.call('user.updateUrl', {
					token:dbFind[0].token,
					updated_byToken:dbFind[0].token,
					role: dbFind[0].role,					               
					onlineStatus: false,                  
					onlineLastLoginout_At: dayjs().format(),
					lastDurationMs:_durationMs,
					totalDurationMs : _totalDurationMs,
					totalDurationTime: "totalDurationTime"
				})		
				//! ----------- End User UPDATE ----------------------------
				

		   		//! Kullan??c?? Update Yap??ld??
				if(user_updateUrl.status=="0") { 	console.log('\u001b[' + 31 + 'm' + '[User] [Loginout] Kullan??c?? Update Yap??lmad??' + '\u001b[0m'); }
				if(user_updateUrl.status=="1") { 	
				
					console.log('\u001b[' + 32 + 'm' + '[User] [Loginout] Kullan??c?? Update Yap??ld??' + '\u001b[0m');
				
				}       		

				//! Return Api
				ctx.params.title = "user.service -> Kullan??c?? Loginout"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.message = "Ba??ar??l?? ????k????  Yap??ld??"
				ctx.params.userInfo=dbFind

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[User] [Loginout] Kullan??c?? Loginout Ba??ar??l?? [ /api/user/loginOut ]' + '\u001b[0m');	
			}		
			
			//! If there is no user
			else {

				//! Return Api
				ctx.params.title = "user.service -> Kullan??c?? Loginout"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.message = "Hatal?? ????k???? Oldu"
				ctx.params.userInfo=null

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[User] [Loginout] Kullan??c?? Loginout Ba??ar??s??z [ /api/user/Loginout ]' + '\u001b[0m');		
			}	
					
			//! Delete
			delete ctx.params.serverToken
			delete ctx.params.token

			return ctx.params
		},
		async view (ctx) {
			
			//! Search
			const dbFind = db.find(u => u.id == ctx.params.id);	

			//! If Data Is Available 
			if (dbFind) {     

							
				
				//! Return Api	
				ctx.params.title = "user.service -> Veri G??r??nt??leme"
				ctx.params.table = "user.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind
				ctx.params.message = "Veri G??r??nt??lendi"
			

				//! Console Writing	
				console.log('\u001b[' + 32 + 'm' + '[User] [View] Veri G??r??nt??lendi [ /api/user/view/:id ]' + '\u001b[0m');

			}

			//! No Data
			else {

				//! Return Api	
				ctx.params.title = "user.service -> Veri G??r??nt??leme"
				ctx.params.table = "user.json"
				ctx.params.status = 0		
				ctx.params.DB = "Veri  Not Found"	
				ctx.params.message="Veri G??r??nt??lenemedi"

				//! Console Writing	
				console.log('\u001b[' + 31 + 'm' + '[User] [View] Veri G??r??nt??lenemedi [ /api/faq/view/:id ] ' + '\u001b[0m');

			}					
						
			//! Return
			delete ctx.params.id
			delete ctx.params.readed_byToken 

			return ctx.params
		},
		async forgotPassword(ctx) {
			let dbFind = db.find(u => u.email == ctx.params.email);
			
	        try {
				
				if (dbFind) {

					
					
					var messageHtml = '';
					messageHtml += '<div style="display: flex;">';
            
					messageHtml += '<div style="font-family: Tahoma;position: relative; border: 1px solid #e6eaee; border-radius: 5px; background-color: #eff3f6; width: 100%; margin-left: auto; margin-right: auto; padding: 25px; font-size: small;">';
					messageHtml += '<div style="width: 100%;" >';
					messageHtml += '</div>';
					messageHtml += '<h2>Merhaba '+dbFind.name+" "+dbFind.surname+'</h2> ';
					messageHtml += '<p>Sifrenizi Yenileme talebi ald??k.</p>';
					messageHtml += '</div>';

					messageHtml += '</div>';
				
					//! -----------  Mail Send Html ----------------------------- 	
					let mail_send = await ctx.call('mail.sendHtml', {
						toEmail: dbFind.email,
						subject: "Sifre Unuttum Talebi",
						html: messageHtml
					})
					//! -----------  Mail Send Html ----------------------------- 
				
					//! Return Api
					ctx.params.title = "user.service -> forgotPassword"
					ctx.params.table = "user.json"
					ctx.params.status = 1
					ctx.params.message = "sifre unuttum"
					ctx.params.userEmail = ctx.params.email
						
				}
				else
				{
				   //! Return Api
					ctx.params.title = "user.service -> forgotPassword"
					ctx.params.table = "user.json"
					ctx.params.status = 0
					ctx.params.message = "Kullan??c?? Bulunamad??"
					ctx.params.userEmail = ctx.params.email
					
				}

			} catch (error) {
				
				//! Return Api
				ctx.params.title = "user.service -> forgotPassword"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.message = error
				ctx.params.userEmail = ctx.params.email
			}

			delete ctx.params.email
             
			return ctx.params

		},
		async mail_send_confirmation_code(ctx) {

			let dbFind = db.find(u => u.token == ctx.params.token);
			
	        try {
				
				if (dbFind) {

					let site_url = process.env.SiteUrl + "/user_admin_check_success?confirmation_code=";
					
					var messageHtml = '';
				
					messageHtml += '<div style="display: flex;">';
            
					messageHtml += '<div style="font-family: Tahoma;position: relative; border: 1px solid #e6eaee; border-radius: 5px; background-color: #eff3f6; width: 100%; margin-left: auto; margin-right: auto; padding: 25px; font-size: small;">';
					messageHtml += '<div style="width: 100%;" >';
					messageHtml += '<img src="'+ process.env.Default_Site_Logo+'" alt="" srcset="">';
					messageHtml += '</div>';
					messageHtml += '<h2>Merhaba '+dbFind.name+" "+dbFind.surname+'</h2> ';
					messageHtml += '<p>Anket ProjesiSistemine kay??t oldu??unuz i??in ??ok te??ekk??r ederiz.</p>';
					messageHtml += '<p>Hesab??n??z?? onaylamak i??in</p>';
					messageHtml += '<a href="' + site_url + dbFind.token + '">L??tfen T??klay??n??z</a>';
					messageHtml += '</div>';

					messageHtml += '</div>';
					
				
					//! -----------  Mail Send Html ----------------------------- 	
					let mail_send = await ctx.call('mail.sendHtml', {
						toEmail: dbFind.email,
						subject: "Tebrikler Ba??ar??l?? Kay??t Oldunuz.",
						html: messageHtml
					})
					//! -----------  Mail Send Html ----------------------------- 
				
					//! Return Api
					ctx.params.title = "user.service -> forgotPassword"
					ctx.params.table = "user.json"
					ctx.params.status = 1
					ctx.params.message = "Onay Mail G??nderildi"
				}
				else
				{
				   //! Return Api
					ctx.params.title = "user.service -> mail_send_confirmation_code"
					ctx.params.table = "user.json"
					ctx.params.status = 0
					ctx.params.message = "Kullan??c?? Bulunamad??"
					ctx.params.userEmail = ctx.params.email
					
				}

			} catch (error) {
				
				//! Return Api
				ctx.params.title = "user.service -> mail_send_confirmation_code"
				ctx.params.table = "user.json"
				ctx.params.status = 0
				ctx.params.message = "Onay Mail G??nderilmedi"
				ctx.params.error = error
			}

			delete ctx.params.token
             
			return ctx.params

		}
	}
}


