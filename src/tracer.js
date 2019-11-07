const APM = require(`elastic-apm-node`);
const requestFilters = require(`./requestFilters`);

const allFilters = {
    request: [
        requestFilters.removeNameDoubleSlash,
        requestFilters.stripSensitiveData,
    ],
};

function createTracer(opts) {
    const agent = APM.start({
        metricsInterval: 0,
        centralConfig: false,
        usePathAsTransactionName: true,
        captureHeaders: false,
        errorOnAbortedRequests: true,
        ...opts,
        ignoreUrls: opts.ignoreUrls || [
            `/api/v1/status`,
            /\/assets\/.*/,
            /\/favicon.*/,
            `/status`,
        ],
    });

    agent.addFilter((payload) => {
        const filtersToApply = allFilters[payload.type];
        if (filtersToApply && filtersToApply.length > 0) {
            return filtersToApply.reduce(
                (data, filter) => filter(data),
                payload,
            );
        }
        return payload;
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
