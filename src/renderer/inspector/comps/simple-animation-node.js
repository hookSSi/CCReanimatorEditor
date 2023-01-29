"use strict";

Vue.component("simple-animation-node", {
    dependencies: [
        "packages://cc-reanimator-editor/src/renderer/inspector/comps/preview-sprite.js",
        "packages://cc-reanimator-editor/src/renderer/inspector/comps/preview-sprite-array.js"
    ],
    template: `
    <preview-sprite-array :target.sync="target.cells" :indent="0"></preview-sprite-array>
    `,
    props: {
        target: {
            twoWay: !0,
            type: Object
        },
        multi: {
            twoWay: !0,
            type: Boolean
        }
    }
});
