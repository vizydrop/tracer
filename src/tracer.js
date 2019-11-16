const APM = require(`elastic-apm-node`);
const requestFilters = require(`./requestFilters`);

function createConfig(overrides) {
    return {
        // metricsInterval: 0, // https://github.com/elastic/apm-agent-nodejs/issues/1515
        centralConfig: false,

        // request processing
        usePathAsTransactionName: true,
        captureHeaders: false,
        ignoreUrls: [
            `/api/v1/status`,
            /\/assets\/.*/,
            /\/favicon.*/,
            `/status`,
        ],

        // stack traces, erros,
        errorOnAbortedRequests: false,
        captureErrorLogStackTraces: false,
        captureSpanStackTraces: false,
        stackTraceLimit: 0,
        captureExceptions: false,
        logUncaughtExceptions: false,

        active: true,

        // overrides
        ...overrides,
    };
}

function createTracer(opts) {
    const conf = createConfig(opts);

    const agent = APM.start(conf);

    agent.addFilter(requestFilters.skipOptionsRequest);
    agent.addFilter(requestFilters.removeNameDoubleSlash);
    agent.addFilter(requestFilters.stripSensitiveData);

    if (
        conf.active &&
        conf.logger &&
        conf.logger.additionalFields &&
        typeof conf.logger.additionalFields.add === `function`
    ) {
        conf.logger.additionalFields.add({
            "trace.id": () => agent.currentTraceIds[`trace.id`],
            "transaction.id": () => agent.currentTraceIds[`transaction.id`],
            "span.id": () => agent.currentTraceIds[`span.id`],
        });
    }

    return agent;
}

module.exports = {createTracer};
