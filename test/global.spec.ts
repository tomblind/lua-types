import { describeForEachLuaTarget, tstl } from './test-utils';

describeForEachLuaTarget('global', (target) => {
    test('assert', () => {
        const lua = tstl(
            target,
            `
            assert({ bla: "not false"});
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('assert with return', () => {
        const lua = tstl(
            target,
            `
            const v = assert({ bla: "not false"});
            assertType<string>(v.bla);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('assert with multi-return', () => {
        const lua = tstl(
            target,
            `
            const [v, a, b] = assert({ bla: "not false"}, { foo: "FOO" }, { bar: "BAR" });
            assertType<string>(v.bla);
            assertType<string>(a.foo);
            assertType<string>(b.bar);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('assert', () => {
        const lua = tstl(
            target,
            `
            assert(false, "assert message");
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('getmetatable', () => {
        const lua = tstl(
            target,
            `
            const metatable = getmetatable({});
            const add = metatable!.__add;
            assertType<Function | undefined>(add);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('getmetatable on string', () => {
        const lua = tstl(
            target,
            `
            const metatable = getmetatable("foo");
            const index = metatable!.__index;
            assertType<Function | object | undefined>(index);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('getmetatable on string', () => {
        const lua = tstl(
            target,
            `
            const metatable = getmetatable("foo");
            const index = metatable!.__index;
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('ipairs', () => {
        const lua = tstl(
            target,
            `
            for (const [i, v] of ipairs([1, 2, 3])) {
                assertType<number>(i);
                assertType<number>(v);
            }
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('next', () => {
        const lua = tstl(
            target,
            `
            const [nextKey, nextValue] = next({x: "foo"});
            assertType<"x">(nextKey);
            assertType<string>(nextValue);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('next with previous index', () => {
        const lua = tstl(
            target,
            `
            const [nextKey, nextValue] = next({ a: "b", c: "d" }, "a");
            assertType<"a" | "c">(nextKey);
            assertType<string>(nextValue);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('pairs', () => {
        const lua = tstl(
            target,
            `
            for (const [k, v] of pairs({ foo: "bar", baz: "bur" })) {
                assertType<"foo" | "baz">(k);
                assertType<string>(v);
            }
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('pairs with LuaTable', () => {
        const lua = tstl(
            target,
            `
            const tbl = new LuaTable<string, string>();
            tbl.set("foo", "bar");
            tbl.set("baz", "bur");
            for (const [k, v] of pairs(tbl)) {
                assertType<string>(k);
                assertType<string>(v);
            }
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('pairs with LuaTable', () => {
        const lua = tstl(
            target,
            `
            const tbl = new LuaTable<string, string>();
            tbl.set("foo", "bar");
            tbl.set("baz", "bur");
            const takesStr = (str: string) => {};
            for (const [k, v] of pairs(tbl)) {
                takesStr(k);
                takesStr(v);
            }
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('pcall', () => {
        const lua = tstl(
            target,
            `
            const result = pcall((a: number) => true, 3);
            assertType<[false, string] | [true, boolean]>(result);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('pcall with context', () => {
        const lua = tstl(
            target,
            `
            const result = pcall((a: number) => true, {}, 3);
            assertType<[false, string] | [true, boolean]>(result);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('rawget', () => {
        const lua = tstl(
            target,
            `
            const value = rawget({ foo: "bar" }, "foo");
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('select', () => {
        const lua = tstl(
            target,
            `
            const values = select(2, "a", "b", "c");
            assertType<string[]>(values);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('select destructured', () => {
        const lua = tstl(
            target,
            `
            const [b, c] = select(2, "a", "b", "c");
            assertType<string>(b);
            assertType<string>(c);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('select with #', () => {
        const lua = tstl(
            target,
            `
            const count = select("#", "a", "b", "c");
            assertType<number>(count);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('setmetatable with table index', () => {
        const lua = tstl(
            target,
            `
            const tbl = setmetatable({}, {__index: {foo: "bar"}});
            assertType<string>(tbl.foo);
            `
        );

        expect(lua).toMatchSnapshot();
    });

    test('setmetatable with function index', () => {
        const lua = tstl(
            target,
            `
            const tbl = setmetatable({}, {__index: (key: string) => key + "bar"});
            assertType<string>(tbl.foo);
            `
        );

        expect(lua).toMatchSnapshot();
    });

    test('setmetatable with no index', () => {
        const lua = tstl(
            target,
            `
            const tbl = setmetatable({});
            assertType<object>(tbl);
            `
        );

        expect(lua).toMatchSnapshot();
    });

    test('tonumber', () => {
        const lua = tstl(
            target,
            `
            const number = tonumber("213.4");
            assertType<number>(number);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('tonumber with base', () => {
        const lua = tstl(
            target,
            `
            const number = tonumber("213.4", 5);
            assertType<number>(number);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('tostring', () => {
        const lua = tstl(
            target,
            `
            const str = tostring(213.4);
            assertType<string>(str);
        `
        );

        expect(lua).toMatchSnapshot();
    });

    test('type', () => {
        const lua = tstl(
            target,
            `
            const t = type(213.4);
            assertType<'nil' | 'number' | 'string' | 'boolean' | 'table' | 'function' | 'thread' | 'userdata'>(t);
        `
        );

        expect(lua).toMatchSnapshot();
    });
});
