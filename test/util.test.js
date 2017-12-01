const {
    propsClone
} = require('../lib/vdom/util');

test('propsClone', () => {
    expect(propsClone({}, {
        name: 123
    }, {
        name: undefined
    })).toEqual({
        name:123
    })
})