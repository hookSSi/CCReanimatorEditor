"use strict";

Vue.component('simple-animation-node', {
    dependencies: [
        'packages://cc-reanimator-editor/src/renderer/inspector/comps/preview-sprite.js',
        'packages://cc-reanimator-editor/src/renderer/inspector/comps/preview-sprite-array.js',
    ],
    template: `
    <cc-prop :target.sync="target.previewInEditor" :indent="indent" :multi-values="multi"></cc-prop>
    <cc-object-prop :target.sync="target.controlDriver" :indent="indent" :multi-values="multi"></cc-object-prop>
    <cc-object-prop :target.sync="target.drivers" :indent="indent" :multi-values="multi"></cc-object-prop>
    <preview-sprite-array :target.sync="target.cells" :indent="indent"></preview-sprite-array>
    `,
    props: {
        target: {
            twoWay: !0,
            type: Object,
        },
        multi: {
            twoWay: !0,
            type: Boolean,
        },
        indent: {
            twoWay: !0,
            type: Number,
        },
    },
});
