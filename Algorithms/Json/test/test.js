const CJSON = require("../index")
const obj = {
    a: '\u0f01',
    c: ['5666f', 4, [55]
    ],
    d: () => {}, //被忽略
    f: undefined, //被忽略
    g: Symbol(), //被忽略
    e: {
        a: '2333',
        c: [
            23,
            4, {
                a: 4
            },
            Symbol(),
            () => {},
            undefined
        ],
        d: 5,
        f: null,
        e: undefined,
        g: NaN
    },
    [() => {}
    ]: Symbol() //被忽略
};
try {
    const c = new CJSON();
    const s = c.stringify(obj);
    console.log(c.stringify(s), '\n\n', c.parse(s));
} catch (error) {
    console.log(error);
}
