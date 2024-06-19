var dbm;
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.runSql(`
    CREATE TABLE IF NOT EXISTS public.product (
      id                          SERIAL PRIMARY KEY,
      name                        VARCHAR(255) NOT NULL,
      description                 VARCHAR(255) NOT NULL,
      price                       INTEGER DEFAULT NULL,
      status                      INTEGER DEFAULT NULL,
      created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`, function (err) {
    if (err) return callback(err);
    callback();
  });
};

exports.down = function (db, callback) {
  db.runSql(`
          DROP TABLE IF EXISTS public.product;
          `, function (err) {
    if (err) return callback(err);
    callback();
  });
};

exports._meta = {
  "version": 1
};