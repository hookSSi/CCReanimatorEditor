"use strict";

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

Vue.component("reanimator", {
    template: `
    <ui-button class="green medium"
        @confirm="onClickImport"
    >
    Import JSON To Reanimator
    </ui-button>
    <ui-button class="medium"
        @confirm="onClickExport"
    >
    Export Reanimator To JSON
    </ui-button>

    <hr/>

    <ui-prop v-prop="target.root">Root</ui-prop>
    <ui-prop v-prop="target.fps">FPS</ui-prop>
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
    methods: {
        T: Editor.T,
        async onClickExport() { // export
            const fileFilter = [{
                    name: 'json',
                    extensions: ['json']
                }];
            const message = "test";
            const properties = ['dontAddToRecent', 'createDirectory'];
            const defaultPath = Editor.url('db://assets/resources/reanimation');
            const title = "Export Reanimator to JSON";

            let jsonPath = Editor.Dialog.saveFile({
                title: title, 
                defaultPath: defaultPath, 
                filters: fileFilter, 
                properties: properties,
                message: message
            });

            if(!jsonPath || jsonPath < 0)
                return void 0;

            console.log(this.target);

            const assetPath = Editor.url("db://assets/");
            const jsonData = this.target.data.value;
            
            if(fs.existsSync(jsonPath)) {
                jsonPath = "db://assets/" + path.relative(assetPath, jsonPath);
                Editor.assetdb.saveExists(jsonPath, jsonData, (error, meta) => {
                    if(error) {
                        Editor.error(error);
                        return void 0;
                    }
                })
            } else {
                jsonPath = "db://assets/" + path.relative(assetPath, jsonPath);
                Editor.assetdb.create(jsonPath, jsonData, (error, meta) => {
                    if(error) {
                        Editor.error(error);
                        return void 0;
                    }

                })
            }

            return void 0;
        },
        async onClickImport() { // Import
            const fileFilter = [{
                    name: 'json',
                    extensions: ['json']
                }];
            const properties = ['openFile'];
            const defaultPath = Editor.url('db://assets/resources/reanimation');
            const title = "Import JSON to Reanimator"

            let jsonPath = Editor.Dialog.openFile({
                title: title, 
                defaultPath: defaultPath, 
                filters: fileFilter, 
                properties: properties
            });

            if(!jsonPath || jsonPath < 0)
                return void 0;

            console.log(jsonPath);
            console.log(this.target);

            let jsonData = await promisify(fs.readFile)(jsonPath[0], { encoding: "utf-8" });
            let nodeUUID = this.target.node.value.uuid;

            Editor.Scene.callSceneScript('cc-reanimator-editor', 'jsonToReanimator', { jsonData: jsonData, nodeUUID: nodeUUID }, (err, uuid) => {
                console.log(`import complete ${uuid}`);
            });
        }
    }
});

