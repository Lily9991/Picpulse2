var config = module.exports;

if (process.env.NODE_ENV == 'local') {
    config.express = {
        port_num: 5000
    };
    config.db = {
        db_client: 'pg',
        db_connection: {
            host     :  '127.0.0.1', // host ip address
            user     :  'postgres',  // db user name
            password :  '19911225gydcr7',  // db password
            database :  'postgres'   // database name
        }
    };
}
else {
    config.express = {
        port_num: process.env.PORT || 5000
    };
    config.db = {
        db_client: 'pg',
        db_connection: process.env.HEROKU_POSTGRESQL_BLUE_URL
    };
}
