"use strict";

Vue.component("preview-sprite", {
    template: `
    <component
        v-for="prop in target.value"
        :is="prop.compType"
        :target.sync="prop"
        :indent="indent">
    </component>
    `,
    props: {
        target: {
            twoWay: !0,
            type: Object
        },
        indent: {
            type: Number,
            default: 0
        }
    }
});

