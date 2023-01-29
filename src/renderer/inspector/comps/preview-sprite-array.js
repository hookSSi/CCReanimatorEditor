"use strict";

function _promisify(f) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            function callback(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }

            args.push(callback);

            f.call(this, ...args);
        })
    }
}

Vue.component("preview-sprite-array", {
    template: `
    <style scoped>
        ui-drop-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        
            outline: none;
        
            width: 90%;
            height: 50px;
            padding: 15px;
            margin: 15px;
        
            border: 5px dotted #666;
        
            color: #888;
            font-size: 16px;
            font-weight: bold;
        }
    
        ui-drop-area[multi] {
            border: 5px dotted #660;
            color: #880;
        }
    
        ui-drop-area[drag-hovering] {
            border-color: #090;
            color: #090;
        }

        .drag-area {
            border: 1px solid #666;
            box-shadow: inset 0 0 8px 2px rgba(0,0,0,0.2);
            background: #333;
        }
    
        .drag:hover {
            border: 1px solid #0f0;
            background: #090;
        }
    </style>

    <div class="section">
        <ui-drop-area droppable="asset" multi
            @drop-area-enter="onDropEnter" 
            @drop-area-move="onDropAreaMove"
            @drop-area-accept="onDropAreaAccept"
        >
        Place Anim SpriteFrames Here
        </ui-drop-area>
    </div>
    <ui-prop :tooltip="target.attrs.tooltip" :name="target.name" :indent="indent" v-readonly="target.attrs.readonly" foldable>
        <template v-if="!target.values || target.values.length <= 1">
            <ui-num-input class="flex-1" type="int" min="0" :value="target.value.length" @confirm="arraySizeChanged"></ui-num-input>
            <div slot="child">
                <preview-sprite v-for="prop in target.value" :target.sync="prop" :indent="indent+1"></preview-sprite>
            </div>
        </template>
        <template v-else>
            <span>Difference</span>
        </template>
    </ui-prop>
    `,
    props: {
        indent: {
            type: Number,
            default: 0
        },
        target: {
            twoWay: !0,
            type: Object
        }
    },
    data: () => ({
        requestIDs: [],
        invalid: false,
        cacheUuid: ""
    }),
    methods: {
        T: Editor.T,
        arraySizeChanged(e) {
            if (e.detail.value < this.target.value.length) {
                let t = new Array(e.detail.value);
                for (let n = 0; n < e.detail.value; ++n)
                    t[n] = this.target.value[n];

                this.target.value = t
            } else
                this.target.value.length = e.detail.value;

            Editor.UI.fire(this.$el, "target-size-change", {
                bubbles: !0,
                detail: {
                    path: this.target.path + ".length",
                    value: e.detail.value
                }
            })
        },
        onDropEnter(e) {    // Draggable item enter in drop area
            e.stopPropagation();
        },
        onDropAreaMove(e) { // Draggable item is Moving in Drop Area
            e.stopPropagation();
        },
        async onDropAreaAccept(e) {
            e.stopPropagation();
            console.log(e);
            
            let dragItems = e.detail.dragItems.map(item => item.id);
            let spriteFrames = [];

            for(let i = 0; i < dragItems.length; i++) {           
                let id = dragItems[i]

                let queryMetaInfo = await _promisify(Editor.assetdb.queryMetaInfoByUuid)(id);
                let parsed = JSON.parse(queryMetaInfo.json);

                if(queryMetaInfo.assetType === "sprite-frame") {
                    spriteFrames.push(parsed);
                }
            }

            console.log(spriteFrames);

            if(spriteFrames.length > 0) {
                const prevLength = this.target.value.length;
                const newLength = prevLength + spriteFrames.length;
                this.target.value.length = newLength;

                let lenghtMsg = {
                    id: this.$root.target.uuid.value,
                    path: `cells.length`,
                    type: "Array",
                    value: newLength
                }

                Editor.Ipc.sendToPanel("scene", "scene:set-property", lenghtMsg);

                for(let i = prevLength; i < newLength; i++) {
                    let msg = {
                        id: this.$root.target.uuid.value,
                        path: `cells.${i}.main.sprite`,
                        type: "cc.SpriteFrame",
                        value: {
                            uuid: spriteFrames[i - prevLength].uuid
                        }
                    }

                    // console.log(msg);
                    Editor.Ipc.sendToPanel("scene", "scene:set-property", msg);
                }
            }
        }
    }
});
