"use strict";

require('./elements');
require('./register-ui-properties');
const { promisify } = require("util");

module.exports = {
    'jsonToReanimator': async function (event, info) {
        let {jsonData, nodeUUID } = info;

        if(!jsonData) {
            Editor.Dialog.messageBox({
                title: 'ERROR',
                type: 'error',
                message: 'json이 유효하지 않습니다.'
            })
        }

        const node = JSON.parse(await promisify(Editor.Ipc.sendToPanel)("scene", "scene:query-node", nodeUUID)).value;
        const jsonObj = JSON.parse(jsonData);

        let reanimatorNode = null;
        if(node && node['__comps__']) {
            const components = node['__comps__'];
            for (let i = 0; i < components.length; i++) {
                let compName = cc.js._getClassById(components[i].type).name;

                if (compName === 'Reanimator') {
                    reanimatorNode = await this.parseJSON(jsonObj, nodeUUID);
                }
            }
        }

        if(reanimatorNode && event.reply) {
            event.reply(null, reanimatorNode.uuid);
        }
    },
    async parseJSON(data, parentUUID) {
        let self = this;
        let animatorNode = cc.engine.getInstanceById(parentUUID);
        
        console.log(data);

        // Start DFS tree travel
        let instanceNode = await self.recursiveDFS(data.root, animatorNode.parent);
        console.log(instanceNode);
        instanceNode.name = `${animatorNode.name}<Reanimator>`;

        let reanimatorComp = animatorNode.getComponent(cc.js.getClassByName("Reanimator"));

        reanimatorComp.root = instanceNode.getComponent(cc.js.getClassByName("ReanimatorNode"));
        reanimatorComp.fps = data.fps;

        return instanceNode;
    },
    parseToNode(node, parent) {
        let instanceNode = new cc.Node(`${node.name}[${node.type}]`);
        instanceNode.setParent(parent);

        instanceNode.addComponent(cc.js.getClassByName(node.type));

        return instanceNode;
    },
    async recursiveDFS(node, root) {
        let self = this;

        if(!node) {
            return;
        }

        let newParent = self.parseToNode(node, root);

        switch (node.type) {
            case 1: // SimpleAnimationNode node
                {
                    let simpleAnimNodeComp = newParent.getComponent(
                        cc.js.getClassByName(node.type),
                    );

                    simpleAnimNodeComp.setControlDriver(node.controlDriver);
                    simpleAnimNodeComp.setDrivers(node.drivers);
                    for (let i = 0; i < node.cells.length; i++) {
                        simpleAnimNodeComp.addCell();
                        let msg = {
                            id: simpleAnimNodeComp.uuid,
                            path: `cells.${i}.main.sprite`,
                            type: 'cc.SpriteFrame',
                            value: {
                                uuid: node.cells[i].main.uuid,
                            },
                        };

                        Editor.Ipc.sendToPanel('scene', 'scene:set-property', msg);
                    }
                }
                break;
            case 2: // SwitchNode node
                {
                    let switchNodeComp = newParent.getComponent(cc.js.getClassByName(node.type));

                    // data binding
                    switchNodeComp.setControlDriver(node.controlDriver);
                    switchNodeComp.setDrivers(node.drivers);
                    for (let i = 0; i < node.nodes.length; i++) {
                        let child = await self.recursiveDFS(node.nodes[i], newParent);

                        if (child) {
                            switchNodeComp.addNode(
                                child.getComponent(cc.js.getClassByName('ReanimatorNode')),
                            );
                        }
                    }
                }
                break;
        }

        return newParent;
    }
    // editPrefab(uuid, savePath) {
    //     let self = this;

    //     cc.loader.load({ type: 'uuid', uuid: uuid }, (err, res) => {
    //         let info = res;

    //         if(info) {
    //             let root = new cc.Node(info.name);
    //             root.setParent(cc.find('Canvas'));
    //             self.editNode(info, root);

    //             Editor.Ipc.sendToPanel('scene', 'scene:create-prefab', root.uuid, savePath);

    //             let uuid = Editor.assetdb.remote.urlToUuid(savePath + info.name + '.prefab')
    //             Editor.Ipc.sendToAll('scene:enter-prefab-edit-mode', uuid);
    //         }
    //     })
    // }
}