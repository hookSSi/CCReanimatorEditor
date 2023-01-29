"use strict";

require('./elements');
require('./register-ui-properties');
const { promisify } = require("util");

function parseJSON(data) {
    let queue = [];
    let result = [];

    queue.push(data.root);
    while(queue.length > 0) {
        let node = queue.pop();

        if(!node) {
            break;
        }

        result.push(node);

        switch(node.type) {
            case "SwitchNode": {
                    for(let i = 0; i < node.nodes.length; i++) {
                        queue.push(node.nodes[i]);
                    }
                }
                break;
            case "SimpleAnimationNode": {
                    for(let i = 0; i < node.cells.length; i++) {
                        queue.push(node.cells[i]);
                    }
                }
                break;
        }
    }

    console.log(result);
}

module.exports = {
    'jsonToReanimator': async function (event, args) {
        let {jsonData, nodeUUID } = args;

        const node = JSON.parse(await promisify(Editor.Ipc.sendToPanel)("scene", "scene:query-node", nodeUUID)).value;
        const jsonObj = JSON.parse(jsonData);
        
        console.log(nodeUUID);
        console.log(node);
        console.log(jsonObj);
        
        if(node && node['__comps__']) {
            const components = node['__comps__'];
            for (let i = 0; i < components.length; i++) {
                let compName = cc.js._getClassById(components[i].type).name;
                console.log(compName);

                if (compName === 'Reanimator') {
                    parseJSON(jsonObj);
                }
            }
        }

        if(event.reply) {
            event.reply(null, "test");
        }
    }
}