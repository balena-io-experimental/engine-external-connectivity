const http = require('http');

// All services on port 8080
const PORT = 8080;
const SERVICE = process.env.BALENA_SERVICE_NAME;
const services = ['one', 'two', 'three', 'four'].filter((svc) => svc !== SERVICE);

const createServer = () => {
    return http.createServer((req, res) => {
        if (req.url === '/healthy') {
            // Always return unhealthy
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Unhealthy\n');
            process.exit(1);
        } else if (req.url === '/ping') {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Pong\n');
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found\n');
        }
    });
};

const pingService = (service) => {
    const options = {
        hostname: service,
        port: PORT,
        path: '/ping',
        method: 'GET',
    };
    
    const req = http.request(options, (res) => {
        res.on('error', (err) => {
            console.error(`Error on response while pinging ${service}: ${err}`);
        });
    });

    req.on('error', (err) => {
        console.error(`Error on request while pinging ${service}: ${err}`);
    });

    req.end();
}


(() => {
    const server = createServer(PORT);
    server.listen(PORT, () => {
        console.log(`${process.env.BALENA_SERVICE_NAME} listening on port ${PORT}`);
    });

    const pingInterval = setInterval(() => {
        services.forEach((service) => {
            pingService(service);
        });
    }, 10000);

    process.on('SIGTERM', () => {
        log.info('Received SIGTERM. Exiting.');
        server.close();
        clearInterval(pingInterval);
        process.exit(143);
    });
})();






