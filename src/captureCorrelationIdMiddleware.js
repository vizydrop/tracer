const captureCorrelationIdMiddleware = (agent) => (req, res, next) => {
    agent.setLabel(`correlationId`, req.correlationId);
    next();
};

module.exports = {captureCorrelationIdMiddleware};
