const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
<<<<<<< HEAD
      target: 'http://localhost:5001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.method, req.path, 'to', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy response:', proxyRes.statusCode, 'for', req.path);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      },
    })
  );
};
=======
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
