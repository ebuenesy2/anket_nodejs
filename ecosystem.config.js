module.exports = {
	apps: [{
		name: 'moleculer-service',
		script: './index.js',
		instances: 2,
		exec_mode: 'cluster',
		env: {
			NODE_ENV: 'production',
		},
	}],
};
