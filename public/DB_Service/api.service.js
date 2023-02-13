            
            //!------------- Product Options  --------------------------------------------------------------------------------------------------

			fastify.get('/api/product_options/info', async (req, res) => this.broker.call("product_options.info")) //! İnfo
			fastify.post('/api/product_options/post', async (req, res) => this.broker.call("product_options.post", { ...req.body })) //! POST
			fastify.get('/api/product_options/html', async (req, res) => this.broker.call("product_options.html")) //! Html
			fastify.get('/api/product_options/all', async (req, res) => this.broker.call("product_options.all")) //! All

			fastify.get('/api/product_options/:id', async (req, res) => this.broker.call("product_options.find", { id: req.params.id })) //! Search	
			fastify.post('/api/product_options/find_post', async (req, res) => this.broker.call("product_options.find_post", { ...req.body })) //!  Search-Post
			fastify.post('/api/product_options/find_token', async (req, res) => this.broker.call("product_options.find_token", { ...req.body })) //!  Search-Token	
			fastify.post('/api/product_options/find_user', async (req, res) => this.broker.call("product_options.find_user", { ...req.body })) //!  Search-UserToken	
			fastify.post('/api/product_options/find_fullPackage', async (req, res) => this.broker.call("product_options.find_fullPackage", { ...req.body })) //!  Search-FullPackage	

			fastify.post('/api/product_options/add', async (req, res) => this.broker.call("product_options.add", { ...req.body })) //! CREATE		
			fastify.post('/api/product_options/update', async (req, res) => this.broker.call("product_options.update", { ...req.body })) //! UPDATE
			fastify.post('/api/product_options/updated_delete/:id', async (req, res) => this.broker.call("product_options.updated_delete", { id: req.params.id, ...req.body })) //! UPDATE DELETE
			fastify.post('/api/product_options/delete/:id', async (req, res) => this.broker.call("product_options.delete", { id: req.params.id, ...req.body })) //! DELETE
			fastify.post('/api/product_options/delete_update/:id', async (req, res) => this.broker.call("product_options.delete_update", { id: req.params.id, ...req.body })) //! DELETED Update