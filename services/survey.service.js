'use strict';
const dayjs = require('dayjs'); //! Time
const fs = require("fs"); //! File
const sign = require('jwt-encode'); //! Token
const jwt_decode = require('jwt-decode'); //! Token
const db = require('../public/DB/survey.json'); //! Json


module.exports = {
	name: "survey",

	actions: {
		async info(ctx) {

			//! Return Api
			ctx.params.title = "survey.service -> Info"
			ctx.params.table = "survey.json"
			ctx.params.time = dayjs().toDate()
			ctx.params.note = "Giriş Yapmak İçin Önemli"
			ctx.params.APi_URL = process.env.APi_URL

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

			try {

				//! Return Api   
				ctx.params.title = "survey.service -> All Data"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.size=db.length
				ctx.params.DB = db?.sort((a, b) => (a.id > b.id ? -1 : 1))		

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [All] All Data Read [ /api/survey/all ] ' + '\u001b[0m');

			} catch (error) {

				//! Return Api   
				ctx.params.title = "survey.service -> All Data"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.size= 0
				ctx.params.DB = error

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [All] All Data Could Not Read  [ /api/survey/all ] ' + '\u001b[0m');
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
				ctx.params.title = "survey.service -> All Data"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.size=dbLimit.length
			    ctx.params.DB = order === "asc" ? dbLimit?.sort((a, b) => (a.id < b.id ? -1 : 1)) : dbLimit?.sort((a, b) => (a.id > b.id ? -1 : 1))

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [All] All Data Read [ /api/survey/all/params ] ' + '\u001b[0m');

			} catch (error) {

				//! Return Api   
				ctx.params.title = "survey.service -> All Data"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.size= 0
				ctx.params.DB = error

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [All] All Data Could Not Read  [ /api/survey/all/params ] ' + '\u001b[0m');
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
                
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [Find] Data Search [ /api/survey/find ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.DB = "survey  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [Find] No Data Found [ /api/survey/find ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.id

			return ctx.params
		},
		async find_post(ctx) {

			//! Search
			const dbFind = db.find(u => u.id == ctx.params.id);

			//! If Data Is Available
			if (dbFind) {	               
                
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [Find] Data Search [ /api/survey/find_post ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.DB = "survey  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [Find] No Data Found [ /api/survey/find_post ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.id

			return ctx.params
		},
		async find_token(ctx) {

			//! Search
			const dbFind = db.find(u => u.token == ctx.params.token);	

			//! If Data Is Available
			if (dbFind) {	               
                
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [Find] Data Search [ /api/survey/find_token ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.DB = "survey  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [Find] No Data Found [ /api/survey/find_token ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.token

			return ctx.params
		},
		async find_user(ctx) {

			//! Search
			const dbFilter = db.filter(u => u.created_byToken == ctx.params.created_byToken);

			//! If Data Is Available
			if (dbFilter.length > 0) {   	               
                
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [Find] Data Search [ /api/survey/find_user ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.DB = "survey  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [Find] No Data Found [ /api/survey/find_user ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.created_byToken

			return ctx.params
		},
		async find_serverToken(ctx) {

			//! Search
			const dbFilter = db.filter(u => u.serverToken == ctx.params.serverToken);

			//! If Data Is Available
			if (dbFilter.length > 0) {   	               
                
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [Find] Data Search [ /api/survey/find_serverToken ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.DB = "survey  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [Find] No Data Found [ /api/survey/find_serverToken ] ' + '\u001b[0m');	

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
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [Find] Data Search [ /api/survey/find_serverToken ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey.service -> Data Search"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.DB = "survey  Not Found"
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [Find] No Data Found [ /api/survey/find_serverToken ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.serverId

			return ctx.params
		},
		async add(ctx) {  

			try {

				//! Token
				let TokenId=new Date().getTime();

				let TokenInfo={				
					id: TokenId,	
					question: ctx.params.question,
					answers: ctx.params.answers
				}
				
				const secret = 'secret';
				const data = TokenInfo;
				const jwt = sign(data, secret);		
				//! End Token

				//! Data to add
				const willSaveData = {
					id:TokenId,		
					serverId: ctx.params.serverId,
					serverToken: ctx.params.serverToken,
					question: ctx.params.question,
					answers: ctx.params.answers,
					token:jwt,				
					created_at: dayjs().format(),
					created_byToken: ctx.params.created_byToken,
					isUpdated: false,
					updated_at: null,
					updated_byToken : null,
					isActive: true,
					isDeleted: false,
					deleted_at: null,
					deleted_byToken: null
				}

				//Save Data
				db.push(willSaveData)

	
				//Writing Data into Json -> db
				fs.writeFile('./public/DB/survey.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[survey] [Json] [Add] Failed to Save Json Data [ survey.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[survey] [Json] [Add] Json Data Saved [ survey.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	


				//! Return Api   
				ctx.params.title = "survey.service -> Adding Data"
				ctx.params.table = "survey.json"
				ctx.params.status = 1
				ctx.params.message = "Data Added"	
				
				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey] [Add] Data Added [ /api/survey/add ] ' + '\u001b[0m');	
				

			} catch (error) {

				//! Return Api   
				ctx.params.title = "survey.service -> Adding Data"
				ctx.params.table = "survey.json"
				ctx.params.status = 0
				ctx.params.message = "Failed to Add Data"	
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey] [Add] Failed to Add Data [ /api/survey/add ] ' + '\u001b[0m');	

			}

			//! Delete
		    delete ctx.params.serverId 
		    delete ctx.params.serverToken 
		    delete ctx.params.question 
		    delete ctx.params.answers 
              
			return ctx.params
		},
		async update(ctx) {

			//! Search
			const dbFind = db.find(u => u.token == ctx.params.token && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available 
			if (dbFind) {
              
				// Reference Data Updating
				Object.keys(ctx.params).forEach(key => {					
					if(key!="userToken"  ) { dbFind[key] = ctx.params[key] }  //! Only Text 				
				})
				dbFind["isUpdated"] = true
				dbFind["updated_at"] = dayjs().format()
				// End  Reference Data Updating
	
				//Writing Data into Json -> db
				fs.writeFile('./public/DB/survey.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[survey] [Json] [Update] Failed to Save Json Data [ survey.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[survey] [Json] [Update] Json Data Saved [ survey.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	
	
				
              
                //! Return Api	
				ctx.params.title = "survey.service -> Data Update"
				ctx.params.table = "survey.json"        
				ctx.params.status = 1			
				ctx.params.message="Data Updated"

				//! Console Writing	
				console.log('\u001b[' + 32 + 'm' + '[survey] [Update] Data Update [ /api/survey/update ]' + '\u001b[0m');

			}

			//! No Data 
			else {
				
				
               //! Return Api	
			   ctx.params.title = "survey.service -> Data Update"
			   ctx.params.table = "survey.json"        
			   ctx.params.status = 0			
			   ctx.params.message="Data could not be updated"

			   //! Console Writing	
			   console.log('\u001b[' + 31 + 'm' + '[survey] [Update] Data could not be updated [ /api/survey/update ] ' + '\u001b[0m');

			}
			
			//! Return
			delete ctx.params.updated_byToken 
			delete ctx.params.token
			delete ctx.params.serverToken
			delete ctx.params.userRoleTypeId 
			delete ctx.params.userRoleTypeTitle 

			return ctx.params

		},
		async delete(ctx) {
         
			//! Search
			const dbFind = db.find(u => u.id == ctx.params.id);
			var index = db.findIndex(a => a.id == ctx.params.id && a.serverToken == ctx.params.serverToken );    
			if (index > -1) {
				db.splice(index, 1);

				//Writing Data into Json -> db
				fs.writeFile('./public/DB/survey.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[survey] [Json] [Delete] Failed to Save Json Data [ survey.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[survey] [Json] [Delete] Json Data Saved [ survey.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	
			
				
                //! Return Api   
				ctx.params.title = "survey.service -> Data Deletion"
				ctx.params.table  = "survey.json"
				ctx.params.status = 1
				ctx.params.message = "Data Deleted"	
				
				//! Console Writing	
			    console.log('\u001b[' + 32 + 'm' + '[survey] [Delete] Data Deleted [ /api/survey/delete/:id ] ' + '\u001b[0m');
               

			} else {

				//! Return Api   
				ctx.params.title = "survey.service -> Data Deletion"
				ctx.params.table  = "survey.json"
				ctx.params.status = 0
				ctx.params.message = "Failed to Delete Data"	
				
				//! Console Writing	
				console.log('\u001b[' + 31 + 'm' + '[survey] [Delete] Failed to Delete Data [ /api/survey/delete/:id ] ' + '\u001b[0m');

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
				fs.writeFile('./public/DB/survey.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[survey] [Json] [Delete_Updated] Failed to Save Json Data [ survey.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[survey] [Json] [Delete_Updated] Json Data Saved [ survey.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	
	
			
              
                //! Return Api	
				ctx.params.title = "survey.service -> Data Pass Deletion"
				ctx.params.table  = "survey.json"        
				ctx.params.status = 1			
				ctx.params.message="Data Updated"

				//! Console Writing	
				console.log('\u001b[' + 32 + 'm' + '[survey] [Delete_Updated] Data Update [ /api/survey/update ]' + '\u001b[0m');

			}

			//! No Data 
			else {
				
				
               //! Return Api	
			   ctx.params.title = "survey.service -> Data Pass Deletion"
			   ctx.params.table  = "survey.json"        
			   ctx.params.status = 0			
			   ctx.params.message="Data could not be updated"

			   //! Console Writing	
			   console.log('\u001b[' + 31 + 'm' + '[survey] [Delete_Updated] Data could not be updated [ /api/survey/update ] ' + '\u001b[0m');

			}
			
			//! Return
			delete ctx.params.id
			delete ctx.params.serverToken
			delete ctx.params.deleted_byToken 
			
			return ctx.params

		}		
	}
}
