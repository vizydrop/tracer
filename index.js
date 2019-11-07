const {createTracer} = require(`./src/tracer`);
const {
    captureCorrelationIdMiddleware,
} = require(`./src/captureCorrelationIdMiddleware`);

module.exports = {
    createTracer,
    captureCorrelationIdMiddleware,
};
