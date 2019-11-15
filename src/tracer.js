const APM = require(`elastic-apm-node`);
const requestFilters = require(`./requestFilters`);

function createTracer(opts) {
    const agent = APM.start({
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

        // overrides
        ...opts,
    });

    requestFilters.forEach((filter) => {
        agent.addFilter(filter);
    });

    if (
        opts.logger &&
        opts.logger.additionalFields &&
        typeof opts.logger.additionalFields.add === `function`
    ) {
        opts.logger.additionalFields.add({
            "trace.id": () => agent.currentTraceIds[`trace.id`],
            "transaction.id": () => agent.currentTraceIds[`transaction.id`],
            "span.id": () => agent.currentTraceIds[`span.id`],
        });
    }

    return agent;
}

module.exports = {createTracer};
