const APM = require(`elastic-apm-node`);
const requestFilters = require(`./requestFilters`);

function createConfig(overrides) {
    return {
        // metrics
        metricsInterval: 0,
        breakdownMetrics: false,

        centralConfig: false,

        // request processing
        usePathAsTransactionName: false,
        captureBody: `off`,
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
