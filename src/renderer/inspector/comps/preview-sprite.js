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
    },
    methods: {
        T: Editor.T,
        onClick(e) {
            console.log(e);
            console.log(this);
            // Editor.Ipc.sendToMain("project-settings:open", {tab: 0})
            // e.stopPropagation();
            // this._requestID && (Editor.Ipc.cancelRequest(this._requestID), this._requestID = null),
            // this._requestID = Editor.Ipc.sendToPanel("scene", "scene:has-copied-component", (e, t) => {
            //     let n = this.$els.dropdown.getBoundingClientRect();
            //     Editor.Ipc.sendToPackage("cc-reanimator-editor", "popup-menu", {
            //         uuids: this.target.uuids,
            //         hasCopyComp: t,
            //         x: n.left,
            //         y: n.bottom + 5
            //     })
            // }, -1)
        },
    }
});

