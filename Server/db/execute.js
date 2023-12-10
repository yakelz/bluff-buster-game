const pool = require('./database');

async function executeQuery(queryString, params = []) {
	return new Promise((resolve, reject) => {
		pool.query(queryString, params, (error, results) => {
			if (error) {
				console.log(error);
				reject(error.sqlMessage);
			} else {
				resolve(results[0]);
			}
		});
	});
}

module.exports = executeQuery;
