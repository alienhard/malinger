# malinger

An HTTP proxy that makes external APIs slow. Why do you need this? It lets you test
whether your application gracefully handles slow APIs and API failures!

## Features

Useful for testing how an application deals with an API becoming slow (e.g.,
are timeouts handled gracefully?). The proxy delays the delivery of the
header and body for a given number of seconds.

Suports SSL for both incoming requests and proxied requests.

## Usage

    node malinger.js [options]

    Options:
      --port              The port the proxy listens on, default is 8080
      --ssl               Make the proxy listens for HTTPS connections
      --delay SECONDS     Delay until response header and body is delivered
      --remote-host HOST  The remote host to which requests are proxied (required)
      --remote-ssl        Use HTTPS to proxy the requests to the remote host


## Support for HTTPS

If using --ssl, the files privatekey.pem and certificate.pem are expected to be
present in the current directory. You can create a self-signed SSL cert as follows
using openssl:

   openssl genrsa -out privatekey.pem 1024
   openssl req -new -key privatekey.pem -out certrequest.csr
   openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem

Note: when using a self-signed certificate, you may need to disable verification of
the certificate in the client library. It may be easier to switch to non-SSL mode.


## License 

(The MIT License)

Copyright (c) 2011 Adrian Lienhard adrian.lienhard@gmail.com;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.