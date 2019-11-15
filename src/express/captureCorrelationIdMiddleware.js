const captureCorrelationIdMiddleware = (agent, getCorrelationId) => {
    if (!getCorrelationId && typeof getCorrelationId !== `function`) {
        throw new Error(`getCorrelationId expect to be a function`);
    }

    return (req, res, next) => {
        if (agent) {
            agent.setLabel(`correlationId`, getCorrelationId(req));
        }
        next();
    };
};

module.exports = {captureCorrelationIdMiddleware};
