"use strict"

Vue.component("control-driver", {
    template: `
    <ui-prop name="Control driver" type="object" value='{"Name": "Foobar", "Auto Increment": false, "Percentage Based": false}'></ui-prop>
    `,
})

Vue.component("simple-animation-node", {
    template: `
        <control-driver></control-driver>
        <drivers></drivers>
    `,

    props: {
        target: {
            twoWay: true,
            type: Object
        }
    }
});