const pool = require('./database');

async function callProcedure(procedureName, params = []) {
	return new Promise((resolve, reject) => {
		// CALL PNAME (?)
		const placeholders = params.map(() => '?').join(',');
		const query = `CALL ${procedureName}(${placeholders})`;

		pool.query(query, params, (error, results, fields) => {
			if (error) {
				console.log(error);

				reject(error.sqlMessage);
			} else {
				// console.log(procedureName + '\n');
				// console.log(results);
				// console.log('\n');

				// Проверяем, содержит ли results[0] один объект или несколько
				if (results[0].length === 1) {
					if (results[0][0].error) {
						reject(results[0][0].error);
					}
					// Возвращаем один объект, если в массиве один элемент
					resolve(results[0][0]);
				} else {
					// Возвращаем массив объектов, если их несколько
					resolve(results[0]);
				}
			}
		});
	});
}

module.exports = callProcedure;
