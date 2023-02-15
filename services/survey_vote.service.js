'use strict';
const dayjs = require('dayjs'); //! Time
const fs = require("fs"); //! File
const sign = require('jwt-encode'); //! Token
const jwt_decode = require('jwt-decode'); //! Token
const db = require('../public/DB/survey_vote.json'); //! Json

const db_survey = require('../public/DB/survey.json'); //! Json -> survey
const db_user = require('../public/DB/user.json'); //! Json -> user


module.exports = {
	name: "survey_vote",

	actions: {
		async info(ctx) {

			//! Return Api
			ctx.params.title = "survey_vote.service -> Info"
			ctx.params.table = "survey_vote.json"
			ctx.params.time = dayjs().toDate()
			ctx.params.note = "Oylama"
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
				ctx.params.title = "survey_vote.service -> All Data"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.size=db.length
				ctx.params.DB = db?.sort((a, b) => (a.id > b.id ? -1 : 1))		

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [All] All Data Read [ /api/survey_vote/all ] ' + '\u001b[0m');

			} catch (error) {

				//! Return Api   
				ctx.params.title = "survey_vote.service -> All Data"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.size= 0
				ctx.params.DB = error

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [All] All Data Could Not Read  [ /api/survey_vote/all ] ' + '\u001b[0m');
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
				ctx.params.title = "survey_vote.service -> All Data"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.size=dbLimit.length
			    ctx.params.DB = order === "asc" ? dbLimit?.sort((a, b) => (a.id < b.id ? -1 : 1)) : dbLimit?.sort((a, b) => (a.id > b.id ? -1 : 1))

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [All] All Data Read [ /api/survey_vote/all/params ] ' + '\u001b[0m');

			} catch (error) {

				//! Return Api   
				ctx.params.title = "survey_vote.service -> All Data"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.size= 0
				ctx.params.DB = error

				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [All] All Data Could Not Read  [ /api/survey_vote/all/params ] ' + '\u001b[0m');
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
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Find] Data Search [ /api/survey_vote/find ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.DB = []
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Find] No Data Found [ /api/survey_vote/find ] ' + '\u001b[0m');	

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
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Find] Data Search [ /api/survey_vote/find_post ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.DB = []
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Find] No Data Found [ /api/survey_vote/find_post ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.id

			return ctx.params
		},
		async find_token(ctx) {

			//! Search
			const dbFind = db.find(u => u.token == ctx.params.token && u.serverToken == ctx.params.serverToken );

			//! If Data Is Available
			if (dbFind) {	               
                
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.DB = dbFind
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Find] Data Search [ /api/survey_vote/find_token ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.DB = []
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Find] No Data Found [ /api/survey_vote/find_token ] ' + '\u001b[0m');	

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
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Find] Data Search [ /api/survey_vote/find_user ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.DB = []
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Find] No Data Found [ /api/survey_vote/find_user ] ' + '\u001b[0m');	

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
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Find] Data Search [ /api/survey_vote/find_serverToken ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.DB = []
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Find] No Data Found [ /api/survey_vote/find_serverToken ] ' + '\u001b[0m');	

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
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Find] Data Search [ /api/survey_vote/find_serverId ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.DB = []
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Find] No Data Found [ /api/survey_vote/find_serverId ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.serverId

			return ctx.params
		},
		async find_surveyId(ctx) {

			//! Search
			const dbFilter = db.filter(u => u.surveyId == ctx.params.id);

			//! If Data Is Available
			if (dbFilter.length > 0) {   	   
				
				
				for (let index = 0; index < dbFilter.length; index++) {
					const element_voterToken = dbFilter[index]["voterToken"];
					const element_surveyId = dbFilter[index]["surveyId"];
					const element_surveyAnswersId = dbFilter[index]["surveyAnswersId"];

					var dbFind_user = db_user.find(u => u.token == element_voterToken);
					dbFilter[index]["voterInfo"] = dbFind_user;

					var dbFind_survey = db_survey.find(u => u.id == element_surveyId);
					dbFilter[index]["surveyAnswersTitle"] = dbFind_survey.answers.find(u => u.id === element_surveyAnswersId)?.title;

				}

				let answers_array = db_survey.find(u => u.id == ctx.params.id).answers;
				for (let index = 0; index < answers_array.length; index++) {
					const elementId = answers_array[index].id;
					const dbFilter_vote = db.filter(u => u.surveyId == ctx.params.id && u.surveyAnswersId == elementId).length;
					
					answers_array[index]["count"] = dbFilter_vote
				
				}
                
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.answers = answers_array
				ctx.params.size=dbFilter.length
				ctx.params.DB = dbFilter?.sort((a, b) => (a.id > b.id ? -1 : 1))
			

				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Find] Data Search [ /api/survey_vote/find_surveyId ] ' + '\u001b[0m');
			}

			//! No Data
			else {
				
				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Search"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.DB = []
			
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Find] No Data Found [ /api/survey_vote/find_surveyId ] ' + '\u001b[0m');	

			}

            //! Return
			delete ctx.params.id

			return ctx.params
		},
		async add(ctx) {  

			try {

				//! Token
				let TokenId=new Date().getTime();

				let TokenInfo={				
					id: TokenId,	
					voterToken: ctx.params.voterToken,
					surveyToken: ctx.params.surveyToken
				}
				
				const secret = 'secret';
				const data = TokenInfo;
				const jwt = sign(data, secret);		
				//! End Token

				//! Data to add
				const willSaveData = {
					id:TokenId,		
					serverId: ctx.params.serverId || null,
					serverToken: ctx.params.serverToken || null,
					voterToken: ctx.params.voterToken || null,
					voterId: ctx.params.voterId || null,
					voterInfo: null,
					surveyToken: ctx.params.surveyToken || null,
					surveyId: ctx.params.surveyId || null,
					surveyAnswersId: ctx.params.surveyAnswersId || null,
					surveyAnswersTitle:null,
					token:jwt,				
					created_at: dayjs().format(),
					created_byToken: ctx.params.created_byToken || null,
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
				fs.writeFile('./public/DB/survey_vote.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Json] [Add] Failed to Save Json Data [ survey_vote.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Json] [Add] Json Data Saved [ survey_vote.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	


				//! Return Api   
				ctx.params.title = "survey_vote.service -> Adding Data"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.message = "Data Added"	
				
				//! Console Writing
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Add] Data Added [ /api/survey_vote/add ] ' + '\u001b[0m');	
				

			} catch (error) {

				//! Return Api   
				ctx.params.title = "survey_vote.service -> Adding Data"
				ctx.params.table = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.message = "Failed to Add Data"	
				
				//! Console Writing
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Add] Failed to Add Data [ /api/survey_vote/add ] ' + '\u001b[0m');	

			}

			//! Delete
		    delete ctx.params.serverId 
            delete ctx.params.serverToken 
            
		    delete ctx.params.voterToken 
		    delete ctx.params.surveyToken 
		    delete ctx.params.surveyAnswersId 

		    delete ctx.params.voterId 
		    delete ctx.params.surveyId 
		    delete ctx.params.created_byToken 
              
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
				fs.writeFile('./public/DB/survey_vote.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Json] [Update] Failed to Save Json Data [ survey_vote.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Json] [Update] Json Data Saved [ survey_vote.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	
	
				
              
                //! Return Api	
				ctx.params.title = "survey_vote.service -> Data Update"
				ctx.params.table = "survey_vote.json"        
				ctx.params.status = 1			
				ctx.params.message="Data Updated"

				//! Console Writing	
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Update] Data Update [ /api/survey_vote/update ]' + '\u001b[0m');

			}

			//! No Data 
			else {
				
				
               //! Return Api	
			   ctx.params.title = "survey_vote.service -> Data Update"
			   ctx.params.table = "survey_vote.json"        
			   ctx.params.status = 0			
			   ctx.params.message="Data could not be updated"

			   //! Console Writing	
			   console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Update] Data could not be updated [ /api/survey_vote/update ] ' + '\u001b[0m');

			}
			
			//! Return
			delete ctx.params.updated_byToken 
			delete ctx.params.token
			delete ctx.params.serverToken
			
            delete ctx.params.voterToken 
		    delete ctx.params.surveyToken 
		    delete ctx.params.surveyAnswersId 
		    delete ctx.params.created_byToken 

			return ctx.params

		},
		async delete(ctx) {
         
			//! Search
			const dbFind = db.find(u => u.id == ctx.params.id);
			var index = db.findIndex(a => a.id == ctx.params.id && a.serverToken == ctx.params.serverToken );    
			if (index > -1) {
				db.splice(index, 1);

				//Writing Data into Json -> db
				fs.writeFile('./public/DB/survey_vote.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Json] [Delete] Failed to Save Json Data [ survey_vote.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Json] [Delete] Json Data Saved [ survey_vote.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	
			
				
                //! Return Api   
				ctx.params.title = "survey_vote.service -> Data Deletion"
				ctx.params.table  = "survey_vote.json"
				ctx.params.status = 1
				ctx.params.message = "Data Deleted"	
				
				//! Console Writing	
			    console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Delete] Data Deleted [ /api/survey_vote/delete/:id ] ' + '\u001b[0m');
               

			} else {

				//! Return Api   
				ctx.params.title = "survey_vote.service -> Data Deletion"
				ctx.params.table  = "survey_vote.json"
				ctx.params.status = 0
				ctx.params.message = "Failed to Delete Data"	
				
				//! Console Writing	
				console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Delete] Failed to Delete Data [ /api/survey_vote/delete/:id ] ' + '\u001b[0m');

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
				fs.writeFile('./public/DB/survey_vote.json', JSON.stringify(db), err => {

					// If there is an error
					if (err) {
						console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Json] [Delete_Updated] Failed to Save Json Data [ survey_vote.json ] ' + '\u001b[0m');	
						console.log('\u001b[' + 31 + 'm' + err+ '\u001b[0m');
					}							

					//! Console Writing
					console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Json] [Delete_Updated] Json Data Saved [ survey_vote.json ] ' + '\u001b[0m');								
					
				});
				// End Writing Data into Json -> db	
	
			
              
                //! Return Api	
				ctx.params.title = "survey_vote.service -> Data Pass Deletion"
				ctx.params.table  = "survey_vote.json"        
				ctx.params.status = 1			
				ctx.params.message="Data Updated"

				//! Console Writing	
				console.log('\u001b[' + 32 + 'm' + '[survey_vote] [Delete_Updated] Data Update [ /api/survey_vote/update ]' + '\u001b[0m');

			}

			//! No Data 
			else {
				
				
               //! Return Api	
			   ctx.params.title = "survey_vote.service -> Data Pass Deletion"
			   ctx.params.table  = "survey_vote.json"        
			   ctx.params.status = 0			
			   ctx.params.message="Data could not be updated"

			   //! Console Writing	
			   console.log('\u001b[' + 31 + 'm' + '[survey_vote] [Delete_Updated] Data could not be updated [ /api/survey_vote/update ] ' + '\u001b[0m');

			}
			
			//! Return
			delete ctx.params.id
			delete ctx.params.serverToken
			delete ctx.params.deleted_byToken 
			
			return ctx.params

		}		
	}
}
