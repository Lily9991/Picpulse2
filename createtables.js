// Set up the database of PicPulse
// Using Knex.js and PostgreSQL
// By: Xihao Zhang

// connect to database
var knex = require('knex')({
  client: 'pg',
  //connection: process.env.PG_CONNECTION_STRING
  connection: {
    host     : '127.0.0.1', // address
    user     : 'postgres', // my user name
    password : '19911225gydcr7', // my password
    database : 'postgres' // database name
  }
});

// create table 'post'
knex.schema.hasTable('post')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table post');
    return knex.schema.createTable('post', function(table) {
      table.increments('post_id');
      table.string('body');
      table.timestamps();
    });
  }
  else {console.log('\nTable post exists!');}
}).catch(function(error) {
    console.error(error);
});

// create table 'image'
knex.schema.hasTable('image')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table image');
    return knex.schema.createTable('image', function(table) {
      table.increments('image_id');
      table.integer('post_id').references('post_id').inTable('post');
      table.string('local_path'); // address in server
      table.string('public_url'); // address from Internet
      table.timestamps();
    });
  }
  else {console.log('\nTable image exists!');}
}).catch(function(error) {
    console.error(error);
});

// create table 'item'
knex.schema.hasTable('item')
.then(function(exists) {
  if (!exists) { // if not exist
    console.log('\nCreate table item');
    return knex.schema.createTable('item', function(table) {
      table.increments('item_id'); // range from 1 to 2,147,483,647
      table.integer('image_id').references('image_id').inTable('image');
      table.integer('worker_id');
      //table.dateTime('tag_time'); // data + time
      table.timestamps(); // create time and update time
    });
  }
  else {console.log('\nTable item exists!');}
}).catch(function(error) { // error detection
    console.error(error);
});

// create table 'itemtag'
knex.schema.hasTable('itemtag')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table itemtag');
    return knex.schema.createTable('itemtag', function(table) {
      table.integer('item_id').references('item_id').inTable('item');
      table.integer('tag_id').references('tag_id').inTable('tag');
      table.timestamps();
    });
  }
  else {console.log('\nTable itemtag exists!');}
}).catch(function(error) {
    console.error(error);
});

// create table 'tag'
knex.schema.hasTable('tag')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table tag');
    return knex.schema.createTable('tag', function(table) {
      table.integer('tag_id').primary();
      table.integer('parent_id').references('tag_id').inTable('tag');
      table.integer('level');
      table.text('tag_desc');
      table.timestamps();
    });
  }
  else {console.log('\nTable tag exists!');}
}).catch(function(error) {
    console.error(error);
});

// create table 'synonym'
knex.schema.hasTable('synonym')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table synonym');
    return knex.schema.createTable('synonym', function(table) {
      table.increments('synonym_id');
      table.string('synonym');
      table.text('synonym_desc');
      table.timestamps();
    });
  }
  else {console.log('\nTable synonym exists!');}
}).catch(function(error) {
    console.error(error);
});

// create table 'synonymtag'
knex.schema.hasTable('synonymtag')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table synonymtag');
    return knex.schema.createTable('synonymtag', function(table) {
      table.integer('synonym_id')
        .references('synonym_id').inTable('synonym');
      table.integer('tag_id').references('tag_id').inTable('tag');
      table.timestamps();
    });
  }
  else {console.log('\nTable synonymtag exists!');}
}).catch(function(error) {
    console.error(error);
});

// create table 'color'
knex.schema.hasTable('color')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table color');
    return knex.schema.createTable('color', function(table) {
      table.increments('color_id');
      table.string('pantone_code');
      table.string('pantone_desc');
      table.string('rgb');
      table.timestamps();
    });
  }
  else {console.log('\nTable color exists!');}
}).catch(function(error) {
    console.error(error);
});

// create table 'itemcolor'
knex.schema.hasTable('itemcolor')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table itemcolor');
    return knex.schema.createTable('itemcolor', function(table) {
      table.integer('item_id').references('item_id').inTable('item');
      table.integer('color_id').references('color_id').inTable('color');
      table.timestamps();
    });
  }
  else {console.log('\nTable itemcolor exists!');}
}).catch(function(error) {
    console.error(error);
});

// create table 'user'
knex.schema.hasTable('picuser')
.then(function(exists) {
  if (!exists) {
    console.log('\nCreate table picuser');
    return knex.schema.createTable('picuser', function(table) {
      table.increments('user_id');
      table.string('username');
      table.string('password');
      table.boolean('admin');
      table.string('company');
      table.string('address_id');
      table.string('email');
      table.string('job');
      table.timestamps();
    });
  }
  else {console.log('\nTable picuser exists!');}
}).catch(function(error) {
    console.error(error);
});
