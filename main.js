// 내장된 함수가 막 몇백개 몇천개 있으면 정리정돈이 안될거아니에요
// 그래서 그것들을 관리하는 일종의 디렉토리같은 것이 객체라고 보시면 됩니다.
var http = require('http');
var url = require('url');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

// 함수가 객체안에 있을 때는 걔를 메소드라고도 한다.
var app = http.createServer(function(request, response){
    var _url = request.url;
    // request.url은 실제 요청한 주소전체
    var queryData = url.parse(_url, true).query;
    // url객체의 query속성을 객체 형식으로 가져온다. query속성을 url에서 ?뒤의 값들을 의미
    var pathname = url.parse(_url, true).pathname;



    if(pathname == '/'){
        if(queryData.id == undefined){
          topic.home(request, response);
        }
        else{
          topic.page(request, response);
        }
    }
    else if(pathname == '/create'){
        topic.create(request, response);
    }
    else if(pathname == '/create_process'){
        topic.create_process(request, response);
    }
    else if(pathname == '/update'){
        topic.update(request, response);
    }
    else if(pathname == '/update_process'){
        topic.update_process(request, response);
    }
    else if(pathname == '/delete_process'){
        topic.delete(request, response);
    }
    else if(pathname == '/author'){
        author.home(request, response);
    }
    else if(pathname == '/author/create_process'){
        author.create_process(request, response);
    }
    else if(pathname == '/author/update'){
        author.update(request, response);
    }
    else if(pathname == '/author/update_process'){
        author.update_process(request, response);
    }
    else if(pathname == '/author/delete_process'){
        author.delete_process(request, response);
    }
    else{
      response.writeHead(404);
      response.end('Not found');
    }

});
app.listen(3000);
