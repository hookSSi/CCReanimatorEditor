'use-strict'

Vue.component("reanimator-drivers", {
    dependencies: ['packages://cc-reanimator-editor/src/renderer/inspector/reanimator-driver.js'],
    template: `
        <ui-prop 
        name="Drivers"
        :indent="indent" 
        style="padding-top: 8px;"
        auto-height
        foldable
        >
        <div class="child layout vertical flex-1">
            <div class="layout horizontal flex-1">
                <ui-button class="flex-1 green" v-on:click="addDriver" unnavigable>Add</ui-button>
                <ui-button class="flex-1 red" v-on:click="clearDriver" unnavigable>Clear</ui-button>
            </div>
            <template v-if="target.drivers.value && target.drivers.value.length > 0">
                <template v-for="driver in target.drivers.value">
                    <div class="child layout horizontal">
                        <component 
                        v-prop="driver.value.key"
                        :is="driver.value.key.compType"
                        :target.sync="driver.value.key"
                        :indent="indent+1"
                        type="string"
                        >
                        </component>
                        <component 
                        v-prop="driver.value.num"
                        :is="driver.value.num.compType"
                        :target.sync="driver.value.num"
                        :indent="indent+1"
                        type="number"
                        slidable 
                        min="0" max="255" step="1" 
                        >
                        </component>
                    </div>
                </template>
            </template>
            <template v-else>
                <span>Difference</span>
            </template>
        </div>
        </ui-prop>
    `,
    props: {
        indent: {
            default: 0,
            type: Number
        },
        target: {
            twoWay: !0,
            type: Object
        }
    },
    methods: {
        T: Editor.T,
        addDriver() {
            const driverLen = this.target.drivers.value.length ?? 0;
            this.target.drivers.value.length = driverLen + 1;

            if (!this.target.drivers.value) {
                this.target.drivers.value = [];
            }

            Editor.UI.fire(this.$el, "target-size-change", {
                bubbles: true,
                detail: {
                    path: this.target.drivers.path + ".length",
                    value: driverLen + 1
                }
            })
        },
        removeDriver(driver) {
            this.target.drivers.value = this.target.drivers.value.filter((e) => e !== driver);
        },
        clearDriver() {
            this.target.drivers.value = new Array(0);
            this.target.drivers.value.length = 0;

            Editor.UI.fire(this.$el, "target-size-change", {
                bubbles: true,
                detail: {
                    path: this.target.drivers.path + ".length",
                    value: 0
                }
            })
        }
    }
})
