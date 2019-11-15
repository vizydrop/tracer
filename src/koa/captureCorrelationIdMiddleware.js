const captureCorrelationIdMiddleware = (agent, getCorrelationId) => {
    if (!getCorrelationId && typeof getCorrelationId !== `function`) {
        throw new Error(`getCorrelationId expect to be a function`);
    }

    return async (ctx, next) => {
        if (agent) {
            agent.setLabel(`correlationId`, getCorrelationId(ctx.request));
        }
        await next();
    };
};
