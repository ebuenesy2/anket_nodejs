			
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

			fastify.post('/api/survey_vote/add', async (req, res) => this.broker.call("survey_vote.add", { ...req.body })) //! CREATE		
			fastify.post('/api/survey_vote/update', async (req, res) => this.broker.call("survey_vote.update", { ...req.body })) //! UPDATE
			fastify.post('/api/survey_vote/updated_delete/:id', async (req, res) => this.broker.call("survey_vote.updated_delete", { id: req.params.id, ...req.body })) //! UPDATE DELETE
			fastify.post('/api/survey_vote/delete/:id', async (req, res) => this.broker.call("survey_vote.delete", { id: req.params.id, ...req.body })) //! DELETE
			fastify.post('/api/survey_vote/delete_update/:id', async (req, res) => this.broker.call("survey_vote.delete_update", { id: req.params.id, ...req.body })) //! DELETED Update

			//!---------------- survey_vote END ----------------------------------------------------------------------------------------------