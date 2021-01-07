var db = require('./db.js');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

exports.home = function(request, response){
  db.query('SELECT * from topic', function (error, topics){
    if(error){
      throw error;
    }
    //console.log(topics); 배열이 나옴
    var title = 'Welcome';
    var description = 'hello, Node.js';
    var list = template.list(topics);
    var html = template.html(title, list,
      `<a href="/create">create</a>`,
      `<h2>${title}</h2>${description}`);
    response.writeHead(200);
    response.end(html);
  });
}


exports.page = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('SELECT * from topic', function (error, topics){
    if(error){
      throw error;
    }
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,
      [queryData.id],
      function(error2, topic){
        if(error2){
          throw error2;
        }
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.html(title, list,
           `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
            </form>`,
            `
              <h2>${title}</h2>
              ${description}
              <p>by ${topic[0].name}</p>
            `
        );
        response.writeHead(200);
        response.end(html);
      });
  });
}


exports.create = function(request, response){
  db.query('SELECT * from topic', function (error, topics,){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM author`, function(error2, authors){
        if(error){
          throw error2;
        }
        var title = 'WEB - create';
        var list = template.list(topics);
        var html = template.html(title, list,
          ``,
          `<form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              ${template.authorselect(authors)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`);
        response.writeHead(200);
        response.end(html);
    });
  });
}


exports.create_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
       var post = qs.parse(body);
           db.query(
             `INSERT INTO topic (title, description, created, author_id)
             VALUES(?, ?, NOW(), ?);`,
             [post.title, post.description, post.author],
             function(error, result){
               if(error){
                 throw error;
               }
               response.writeHead(302, {Location: `/?id=${result.insertId}`});
               response.end();
             }
          );
  });
}


exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('SELECT * from topic', function (error, topics,){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
      if(error2){
        throw error2;
      }
      db.query(`SELECT * FROM author`, function(error, authors){
        var list = template.list(topics);
        var html = template.html(topic[0].title, list,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`,
          `<form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${topic[0].description}</textarea>
            </p>
            <p>
              ${template.authorselect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`);
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}


exports.update_process = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
       var post = qs.parse(body);
       db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
          [post.title, post.description, post.author, post.id],
          function(error, result){
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          }
       )
  });
}


exports.delete = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
       var post = qs.parse(body);
       db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result){
         if(error){
           throw error;
         }
         response.writeHead(302, {Location: `/`});
         response.end();
       });
   });
}
