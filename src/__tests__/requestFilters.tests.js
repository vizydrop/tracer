const {
    removeNameDoubleSlash,
    stripSensitiveData,
    skipOptionsRequest,
} = require(`../requestFilters`);

describe(`request filters`, () => {
    describe(`#removeNameDoubleSlash`, () => {
        it(`should replace double slashes`, () => {
            const result = removeNameDoubleSlash({
                name: `/api//v1/sources//:sourceId`,
            });
            expect(result.name).toBe(`/api/v1/sources/:sourceId`);
        });

        it(`should do nothing if there are no double slashes`, () => {
            const result = removeNameDoubleSlash({
                name: `/api/v1/sources/:sourceId`,
            });
            expect(result.name).toBe(`/api/v1/sources/:sourceId`);
        });
    });

    describe(`#stripSensitiveData`, () => {
        it(`should strip sensitive data`, () => {
            const payload = {
                context: {
                    request: {
                        url: {
                            raw: `/api/v1/sources?token=1234`,
                            search: `?token=1234`,
                            full: `http://localhost/api/v1/sources?token=1234`,
                        },
                    },
                },
            };
            const result = stripSensitiveData(payload);
            expect(result.context.request.url).toEqual({
                raw: `/api/v1/sources?token=********`,
                search: `?token=********`,
                full: `http://localhost/api/v1/sources?token=********`,
            });
        });
    });

    describe(`OPTIONS requests`, () => {
        it(`should skip OPTIONS requests`, () => {
            const result = skipOptionsRequest({
                context: {
                    request: {
                        url: {
                            method: `OPTIONS`
                        },
                    },
                },
            });
            expect(result).toBe(null);
        });

        it(`should bypass GET requests`, () => {
            const payload = {
                context: {
                    request: {
                        url: {
                            method: `GET`
                        },
                    },
                },
            };

            const result = skipOptionsRequest(payload);
            expect(result).toBe(payload);
        });

        it(`should by pass non HTTP request`, () => {
            const payload = {
                context: {
                },
            };

            const result = skipOptionsRequest(payload);
            expect(result).toBe(payload);
        });
    });
});
