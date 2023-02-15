'use strict';
const dayjs = require('dayjs'); //! Time
const dotenv = require('dotenv'); //! env
dotenv.config(); //! env
const sign = require('jwt-encode'); //! Token - Encode
const jwt_decode = require('jwt-decode'); //! Token - Decode
const fs = require("fs"); //! File
const path = require("path"); //! File
const mkdir = require("mkdirp").sync; //! File
const mime = require("mime-types"); //! File-Information
const sharp = require('sharp');  //! File Upload
const fastifyPlugin = require('fastify-plugin'); //! Fastify-plugin
const fastify = require('fastify')({ logger: false }); //! Fastify
fastify.register(require('fastify-formbody')) //! Fastify-formbody
this.fastify = fastify; //! Fastify
const fastifyStatic = require('fastify-static')  //! Fastify-static
fastify.register(require('fastify-cors'), {})  //! Fastify-cors

var md5 = require('md5'); //! Md5

const axios = require('axios'); //! Axios
const querystring = require('querystring'); //! Axios Querystring

/*************   Socket Description *********** */
const fastifySession = require('fastify-session'); //! Fastify Session
const fastifyCookie = require('fastify-cookie'); //! Fastify Cookie
fastify.register(fastifyCookie); //! Fastify Cookie
fastify.register(fastifySession, { secret: 'a secret with minimum length of 32 characters' });; //! Fastify Session
/*************   Socket Description *********** */


/*************   Socket  *********** */
fastify.register(require('fastify-websocket'), { options: { maxPayload: 1048576 } })  //! Fastify Web Socket
let OnlineCount = 0; //! Number of Online
/*************   Socket END  *********** */


/*************  File  *********** */
fastify.register(require('fastify-multipart'), {
	addToBody: true,
	limits: {
		fieldNameSize: 100, // Max field name size in bytes
		fieldSize: 53000000, // Max field value size in bytes
		fields: 20,         // Max number of non-file fields
		fileSize: 53000000,      // For multipart forms, the max file size
		files: 10,           // Max number of file fields
		headerPairs: 2000   // Max number of header key=>value pairs 
	}
});
/*************  File END *********** */

/************* Public File *********** */
fastify.register(fastifyStatic, {
	root: path.join(__dirname, '../public')
})
/************* Public File END *********** */

//! Json
const db_user = require('../public/DB/user.json'); //! Json -> user
const db_survey = require('../public/DB/survey.json'); //! Json -> survey
const db_survey_vote = require('../public/DB/survey_vote.json'); //! Json -> survey vote


module.exports = {
	name: 'api',

	settings: {
		port: process.env.PORT || 3001
	},

	created() {

		try {


			


			//! ------ Get -------------------------------

			//! Home
			fastify.get('/', function (req, res) {

				res.send({
					title: 'Nodejs -  Home  Get - api - fastify - moleculer - json - [ Port ] [ 3001 ]',
					publishCount: 17,
					Time: dayjs().format()
				});

				console.log('\u001b[' + 32 + 'm' + 'Get Done - Home [ api-service.js ] - [ / ] ' + '\u001b[0m');

			}) //! End Home

			//! ------ Env -----------------------------

			//! Env
			fastify.get('/env', function (req, res) {
				res.send({
					title: 'Env Information',
					PORT: process.env.PORT,
					API:
					{
						APi_URL: process.env.APi_URL,
						APi_URL_Dev: process.env.APi_URL_Dev,
						APi_URL_Local: process.env.APi_URL_Local,
						APi_Title: process.env.APi_Title,
						APi_Name: process.env.APi_Name
					},
					Version:
					{
						Version: process.env.Version,
						Release_Date: process.env.Release_Date,
						Version_Title: process.env.Version_Title,
						Author: process.env.Author
					}

				});

				console.log('\u001b[' + 32 + 'm' + 'Env Information [ /env ] ' + '\u001b[0m');
			}) //! End Env

			//! ------ Env  END ------------------------

			//! ------ Version -------------------------

			//! Version
			fastify.get('/version', function (req, res) {
				res.send({
					title: 'Verison Information',
					Version: process.env.Version,
					Release_Date: process.env.Release_Date,
					Version_Title: process.env.Version_Title,
					Author: process.env.Author
				});

				console.log('\u001b[' + 32 + 'm' + 'Verison Information [ /version ] ' + '\u001b[0m');

			}) //! Version END
			//! ------ Version END  --------------------

			//! ------ Informations -------------------------

			//! Informations
			fastify.get('/info', function (req, res) {
				res.send({
					title: 'Project Information',
					PORT: process.env.PORT,
					API:
					{
						APi_URL: process.env.APi_URL,
						APi_URL_Dev: process.env.APi_URL_Dev,
						APi_URL_Local: process.env.APi_URL_Local,
						APi_Title: process.env.APi_Title,
						APi_Name: process.env.APi_Name
					},
					Version:
					{
						Version: process.env.Version,
						Release_Date: process.env.Release_Date,
						Version_Title: process.env.Version_Title,
						Author: process.env.Author
					}

				});

				console.log('\u001b[' + 32 + 'm' + 'Project Information [ /info ] ' + '\u001b[0m');

			}) //! End Informations

			//! ------ Informations END  --------------------




			//! ------ Post -----------------------------

			// http://localhost:3000/
			fastify.post('/', function (req, res) {

				//res.send(req.body.name);
				res.send(req.body);
				console.log(req.body);

			}) //post	

			//************************************* Token  **************************************************** */	

			//! ------  Token -------------------------------

			//! Get Token
			fastify.post('/token', function (req, res) {

				const secret = process.env.TokenSecret;
				const data = req.body;
				const jwt = sign(data, secret);
				res.send({
					Token: jwt
				});

			}) //! Get Token	



			//! -------------------------   Token Resolution	-----------------------------

			fastify.post('/token_post', function (req, res) {

				const token = req.body.token;
				const decoded = jwt_decode(token);

				res.send(decoded)

			}) //! Token

			//! -------------------------   Token Resolution End	-----------------------------
			
			
			//! -------------------------   MD5	-----------------------------

			fastify.post('/md5', function (req, res) {

				const commingData = req.body;
				const md5_create = md5(commingData.password);
				

				res.send({
					"password":req.body.password,
					"md5_create":md5_create
				})

			}) //! Token

			//! -------------------------   MD5 End	-----------------------------


			//! -------------------------   Dashboard	-----------------------------

			fastify.get('/dashboard', function (req, res) {

				
				res.send({
					"user":db_user,
					"survey":db_survey,
					"survey_vote":db_survey_vote
				})

			}) //! Token

			//! -------------------------   Dashboard End	-----------------------------


		
			//************************************* Web  **************************************************** */



			//!------------- Mail  --------------------------------------------------------------------------------------------------

			fastify.get('/api/mail/info', async (req, res) => this.broker.call("mail.info")) //! İnfo
			fastify.post('/api/mail/post', async (req, res) => this.broker.call("mail.post", { ...req.body })) //! POST
			fastify.get('/api/mail/html', async (req, res) => this.broker.call("mail.html")) //! Html
			fastify.get('/api/mail/status', async (req, res) => this.broker.call("mail.status")) //! Status

			fastify.post('/api/mail/send', async (req, res) => this.broker.call("mail.send", { ...req.body })) //! Send - Simple
			fastify.post('/api/mail/send/html', async (req, res) => this.broker.call("mail.sendHtml", { ...req.body })) //! Send - Simple
			fastify.post('/api/mail/send/file', async (req, res) => this.broker.call("mail.sendFile", { ...req.body })) //! Send - Simple

			//!------------- Mail END --------------------------------------------------------------------------------------------------

			
		
			//!-------------  User --------------------------------------------------------------------------------------------------

			fastify.get('/api/user/info', async (req, res) => this.broker.call("user.info")) //! İnfo
			fastify.post('/api/user/post', async (req, res) => this.broker.call("user.post", { ...req.body })) //! POST
			fastify.get('/api/user/html', async (req, res) => this.broker.call("user.html")) //! Html
			fastify.get('/api/user/all', async (req, res) => this.broker.call("user.all")) //! All
			fastify.get('/api/user/all/params', async (req, res) => this.broker.call("user.all_params",{...req.query})) //! All - Params ?id=11

			fastify.get('/api/user/:id', async (req, res) => this.broker.call("user.find", { id: req.params.id })) //! Search
			fastify.post('/api/user/find_post', async (req, res) => this.broker.call("user.find_post", { ...req.body })) //!  Search-Post
			fastify.post('/api/user/find_token', async (req, res) => this.broker.call("user.find_token", { ...req.body })) //!  Search-Token
			fastify.post('/api/user/find_country', async (req, res) => this.broker.call("user.find_country", { ...req.body })) //!  Search-Country
			fastify.post('/api/user/find_gender', async (req, res) => this.broker.call("user.find_gender", { ...req.body })) //!  Search-Gender
			fastify.post('/api/user/find_dateofAth', async (req, res) => this.broker.call("user.find_dateofAth", { ...req.body })) //!  Search-DateofAth
			fastify.post('/api/user/find_email', async (req, res) => this.broker.call("user.find_email", { ...req.body })) //!  Search-Email

			fastify.post('/api/user/find_serverToken', async (req, res) => this.broker.call("user.find_serverToken", { ...req.body })) //! Search - FromServerToken	
			fastify.post('/api/user/find_serverId', async (req, res) => this.broker.call("user.find_serverId", { ...req.body })) //! Search - FromServerId
			fastify.post('/api/user/find_adminCheck', async (req, res) => this.broker.call("user.find_adminCheck", { ...req.body })) //! Search - AdminCheck
			fastify.post('/api/user/find_userRole', async (req, res) => this.broker.call("user.find_userRole", { ...req.body })) //! Search - UserRole
			fastify.post('/api/user/find_userType', async (req, res) => this.broker.call("user.find_userType", { ...req.body })) //! Search - UserType

			fastify.post('/api/user/add', async (req, res) => this.broker.call("user.add", { ...req.body })) //! CREATE
			fastify.post('/api/user/update', async (req, res) => this.broker.call("user.update", { ...req.body })) //! UPDATE
			fastify.post('/api/user/updateUrl', async (req, res) => this.broker.call("user.updateUrl", { ...req.body })) //! UPDATE - URL
			fastify.post('/api/user/updatePassword', async (req, res) => this.broker.call("user.updatePassword", { ...req.body })) //! UPDATE - Password
			fastify.post('/api/user/updateBankAccount', async (req, res) => this.broker.call("user.updateBankAccount", { ...req.body })) //! UPDATE  - BankAccount

			fastify.post('/api/user/delete/:id', async (req, res) => this.broker.call("user.delete", { id: req.params.id, ...req.body })) //! DELETE
			fastify.post('/api/user/delete_update/:id', async (req, res) => this.broker.call("user.delete_update", { id: req.params.id, ...req.body })) //! DELETED Update

			fastify.post('/api/user/loginOnline', async (req, res) => this.broker.call("user.loginOnline", { ...req.body })) //! Login
			fastify.post('/api/user/loginOnlineUsername', async (req, res) => this.broker.call("user.loginOnlineUsername", { ...req.body })) //! Login User
			fastify.post('/api/user/loginOut', async (req, res) => this.broker.call("user.loginOut", { ...req.body })) //! Loginout
			fastify.post('/api/user/view/:id', async (req, res) => this.broker.call("user.view", { id: req.params.id, ...req.body })) //! Search - View

			fastify.post('/api/user/forgotPassword', async (req, res) => this.broker.call("user.forgotPassword", { id: req.params.id, ...req.body })) //! Search - forgotPassword
			fastify.post('/api/user/mail_send_confirmation_code', async (req, res) => this.broker.call("user.mail_send_confirmation_code", { id: req.params.id, ...req.body })) //! Send Mail - Confirmation_code

			//!---------------- User END ----------------------------------------------------------------------------------------------

			
			//!------------- survey  --------------------------------------------------------------------------------------------------

			fastify.get('/api/survey/info', async (req, res) => this.broker.call("survey.info")) //! İnfo
			fastify.post('/api/survey/post', async (req, res) => this.broker.call("survey.post", { ...req.body })) //! POST
			fastify.get('/api/survey/html', async (req, res) => this.broker.call("survey.html")) //! Html
			fastify.get('/api/survey/all', async (req, res) => this.broker.call("survey.all")) //! All
			fastify.get('/api/survey/all/params', async (req, res) => this.broker.call("survey.all_params",{...req.query})) //! All - Params ?id=11

			fastify.get('/api/survey/:id', async (req, res) => this.broker.call("survey.find", { id: req.params.id })) //! Search	
			fastify.post('/api/survey/find_post', async (req, res) => this.broker.call("survey.find_post", { ...req.body })) //!  Search-Post
			fastify.post('/api/survey/find_token', async (req, res) => this.broker.call("survey.find_token", { ...req.body })) //!  Search-Token	
			fastify.post('/api/survey/find_user', async (req, res) => this.broker.call("survey.find_user", { ...req.body })) //!  Search-UserToken
			fastify.post('/api/survey/find_table', async (req, res) => this.broker.call("survey.find_table", { ...req.body })) //!  Search-Table

			fastify.post('/api/survey/find_serverToken', async (req, res) => this.broker.call("survey.find_serverToken", { ...req.body })) //! Search - FromServerToken	
			fastify.post('/api/survey/find_serverId', async (req, res) => this.broker.call("survey.find_serverId", { ...req.body })) //! Search - FromServerId

			fastify.post('/api/survey/add', async (req, res) => this.broker.call("survey.add", { ...req.body })) //! CREATE		
			fastify.post('/api/survey/update', async (req, res) => this.broker.call("survey.update", { ...req.body })) //! UPDATE
			fastify.post('/api/survey/updated_delete/:id', async (req, res) => this.broker.call("survey.updated_delete", { id: req.params.id, ...req.body })) //! UPDATE DELETE
			fastify.post('/api/survey/delete/:id', async (req, res) => this.broker.call("survey.delete", { id: req.params.id, ...req.body })) //! DELETE
			fastify.post('/api/survey/delete_update/:id', async (req, res) => this.broker.call("survey.delete_update", { id: req.params.id, ...req.body })) //! DELETED Update

			//!---------------- survey END ----------------------------------------------------------------------------------------------

						
			//!------------- survey_vote  --------------------------------------------------------------------------------------------------

			fastify.get('/api/survey_vote/info', async (req, res) => this.broker.call("survey_vote.info")) //! İnfo
			fastify.post('/api/survey_vote/post', async (req, res) => this.broker.call("survey_vote.post", { ...req.body })) //! POST
			fastify.get('/api/survey_vote/html', async (req, res) => this.broker.call("survey_vote.html")) //! Html
			fastify.get('/api/survey_vote/all', async (req, res) => this.broker.call("survey_vote.all")) //! All
			fastify.get('/api/survey_vote/all/params', async (req, res) => this.broker.call("survey_vote.all_params",{...req.query})) //! All - Params ?id=11

			fastify.get('/api/survey_vote/:id', async (req, res) => this.broker.call("survey_vote.find", { id: req.params.id })) //! Search	
			fastify.post('/api/survey_vote/find_post', async (req, res) => this.broker.call("survey_vote.find_post", { ...req.body })) //!  Search-Post
			fastify.post('/api/survey_vote/find_token', async (req, res) => this.broker.call("survey_vote.find_token", { ...req.body })) //!  Search-Token	
			fastify.post('/api/survey_vote/find_user', async (req, res) => this.broker.call("survey_vote.find_user", { ...req.body })) //!  Search-UserToken
			fastify.post('/api/survey_vote/find_table', async (req, res) => this.broker.call("survey_vote.find_table", { ...req.body })) //!  Search-Table

			fastify.post('/api/survey_vote/find_serverToken', async (req, res) => this.broker.call("survey_vote.find_serverToken", { ...req.body })) //! Search - FromServerToken	
			fastify.post('/api/survey_vote/find_serverId', async (req, res) => this.broker.call("survey_vote.find_serverId", { ...req.body })) //! Search - FromServerId
			fastify.get('/api/survey_vote/find_surveyId/:id', async (req, res) => this.broker.call("survey_vote.find_surveyId", {id:req.params.id })) //! Search - FromSurveyId

			

			fastify.post('/api/survey_vote/add', async (req, res) => this.broker.call("survey_vote.add", { ...req.body })) //! CREATE		
			fastify.post('/api/survey_vote/update', async (req, res) => this.broker.call("survey_vote.update", { ...req.body })) //! UPDATE
			fastify.post('/api/survey_vote/updated_delete/:id', async (req, res) => this.broker.call("survey_vote.updated_delete", { id: req.params.id, ...req.body })) //! UPDATE DELETE
			fastify.post('/api/survey_vote/delete/:id', async (req, res) => this.broker.call("survey_vote.delete", { id: req.params.id, ...req.body })) //! DELETE
			fastify.post('/api/survey_vote/delete_update/:id', async (req, res) => this.broker.call("survey_vote.delete_update", { id: req.params.id, ...req.body })) //! DELETED Update

			//!---------------- survey_vote END ----------------------------------------------------------------------------------------------
            

			//************************************* Server  **************************************************** */
			//! Server is listening
			const start = async () => {
				try {
					await fastify.listen(process.env.PORT || 3001, '0.0.0.0')
					console.log('\u001b[' + 32 + 'm' + 'Port Listening [ ' + process.env.PORT + ' ]' + '\u001b[0m');

				} catch (err) {
					fastify.log.error(err)
					process.exit(1)
				}
			}

			//! Initiating
			start()

		} catch (err) {
			console.log(err);
		}
	}
};
