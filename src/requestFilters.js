const _ = require(`lodash/fp`);

function removeNameDoubleSlash(payload) {
    // eslint-disable-next-line no-param-reassign
    payload.name = payload.name.replace(/\/\//g, `/`);
    return payload;
}

function replaceSensitiveData(text) {
    if (!text) {
        return text;
    }

    const sensitivePatterns = [
        /token=([^&]*)/gi,
        /reset-password\/(?:.*)\/(.*)/gi,
        /sessionId=([^&]*)/g,
        /secret=([^&]*)/gi,
    ];

    return sensitivePatterns.reduce((result, regexp) => {
        const matches = regexp.exec(result);

        if (matches) {
            return _.tail(matches).reduce(
                (res, match) => res.replace(match, `********`),
                result,
            );
        }

        return result;
    }, text);
}

function stripSensitiveData(payload) {
    const urlData = _.get(`context.request.url`, payload);
    if (urlData) {
        Object.entries(urlData).forEach(([key, value]) => {
            urlData[key] = replaceSensitiveData(value);
        });
    }

    return payload;
}

function skipOptionsRequest(payload) {
    const method = _.get(`context.request.url.method`, payload);
    return method === `OPTIONS` ? null : payload;
}

module.exports = {
    removeNameDoubleSlash,
    stripSensitiveData,
    skipOptionsRequest,
};
