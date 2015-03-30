define([], function () {
    describe("returns titles", function () {

        it("toBe", function () {
            expect(true).toBe(true);
        });

        it("toBeDefined", function () {
            var a = { foo: 'foo' };

            expect(a.foo).toBeDefined();
            expect(a.bar).not.toBeDefined();
        });

    });
});