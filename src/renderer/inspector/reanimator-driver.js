Vue.component("reanimator-driver", {
    template: `
        <div class="layout horizontal">
            <ui-button class="flex-1 blue" @click="logTarget" unnavigable>Log Target</ui-button>
            <ui-prop v-prop="target?.key ?? ''" :indent="indent" name="Key" type="string"></ui-prop>
            <ui-prop v-prop="target?.num ?? 0" :indent="indent" name="Value" type="number" slidable min="0" max="255" step="1" ></ui-prop>
        </div>
        `,
    props: {
        target: {
            twoWay: true,
            type: Object
        },
        indent: {
            default: 0,
            type: Number
        }
    },
    method: {
        logTarget() {
            Editor.log(JSON.stringify(this.target));
        }
    }
})
