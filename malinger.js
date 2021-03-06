/**
 * Malinger (https://github.com/alienhard/malinger)
 *
 * (c) Adrian Lienhard, adrian.lienhard@gmail.com
 */

function start_server(config) {
  var
    server,
    fs = require('fs'),
    secure_server = config['ssl'],
    secure_client = config['remote-ssl'],
    proxy_server = require(secure_server ? 'https' : 'http'),
    proxy_client = require(secure_client ? 'https' : 'http');

  if (secure_server) {
    var options = {
      key: fs.readFileSync('privatekey.pem').toString(),
      cert: fs.readFileSync('certificate.pem').toString()
    };
    server = proxy_server.createServer(options, serve_request);
  } else {
    server = proxy_server.createServer(serve_request);
  }
  server.listen(config['port']);

  function serve_request(request, response) {
    var
      remote_host = config['remote-host'],
      delay = config['delay'] * 1000,
      start = Date.now(),
      response_status,
      response_headers,
      data = "";

    var options = {
      host: remote_host,
      method: request.method,
      path: request.url,
      headers: request.headers
    };

    process.stdout.write("-> http" + (secure_client ? 's' : '') + '://' + config['host'] + request.url + "...");
    proxy_request = proxy_client.request(options, handle_proxy_response);

    request.setEncoding('utf8');

    request.addListener('data', function(chunk) {
      proxy_request.write(chunk, 'binary');
    });

    request.addListener('end', function() {
      proxy_request.end();
    });

    function handle_proxy_response(proxy_response) {
      response_status = proxy_response.statusCode;
      response_headers = proxy_response.headers;
      
      proxy_response.addListener('data', function(chunk) {
        data += chunk;
      });

      proxy_response.addListener('end', function() {
        time_since_start = Date.now() - start;
        delay_left = delay - time_since_start;
        setTimeout(complete_response, delay_left);
      });
    }

    function complete_response() {
      response.writeHead(response_status, response_headers);
      response.write(data, 'utf8');
      response.end();
      console.log(" done");
    }
  }
}


function update_config_from_args(config) {
  var
    arg,
    args = process.argv.slice(2);
  while (args.length > 0) {
    arg = args.shift();
    switch (arg) {
      case '--port':
        config['port'] = parseInt(args.shift()); break;
      case '--ssl':
        config['ssl'] = true; break;
      case '--delay':
        config['delay'] = parseInt(args.shift()); break;
      case '--remote-host':
        config['remote-host'] = args.shift(); break;
      case '--remote-ssl':
        config['remote-ssl'] = true; break;
      default:
        console.log('unrecognized argument: ' + arg);
        process.exit();
    }
  }
}

function log_messages(config) {
  console.log('\nListening on port ' + config['port'] +
  ' for HTTP' + (config['ssl'] ? 'S' : '') + ' requests...');
  console.log('  * proxying requests to HTTP' + (config['remote-host'] ? 'S' : '') + '://' + config['remote-host']);
  if (config['delay'])
    console.log('  * delaying each response for ' + config['delay'] + ' seconds');
  console.log();
}

(function main() {
  var config = {
    port: 8080,
    secure: false,
    delay: 0
  };
  update_config_from_args(config);
  start_server(config);
  log_messages(config);
})();
