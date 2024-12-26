import { app } from "../../../scripts/app.js";
import { $el } from "../../../scripts/ui.js";

const id = "mxtoolkit.Settings";
const mxConfig_id = id + ".Config"
const mxConfig_default = {
    enable_linkMenu: false,
    enable_contextMenu: false,
}
let mxConfig;

function editSlotTypesDefault(enabled) {
    if (enabled) {
        for (const arr of Object.values(LiteGraph.slot_types_default_out)) {
            const idx = arr.indexOf("Reroute");
            if (idx !== -1) {
                arr.splice(idx, 1);
                arr.unshift("mxReroute");
            }
        }
        for (const arr of Object.values(LiteGraph.slot_types_default_in)) {
            const idx = arr.indexOf("Reroute");
            if (idx !== -1) {
                arr.splice(idx, 1);
                arr.unshift("mxReroute");
            }  
        }
    }
    else {
        for (const arr of Object.values(LiteGraph.slot_types_default_out)) {
            const idx = arr.indexOf("mxReroute");
            if (idx !== -1) {
                arr.splice(idx, 1);
                arr.unshift("Reroute");
            }  
        }
        for (const arr of Object.values(LiteGraph.slot_types_default_in)) {
            const idx = arr.indexOf("mxReroute");
            if (idx !== -1) {
                arr.splice(idx, 1);
                arr.unshift("Reroute");
            }
        }
    }
}

function editContextOptions(enabled) {
    if (enabled) {
        const getCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function () {
        const options = getCanvasMenuOptions.apply(this, arguments);

        options.unshift({
            content: 'mxReroute',
            callback: () => {
                const node = LiteGraph.createNode("mxReroute"); // Find node
                node.pos = [
                    app.canvas.graph_mouse[0], // X
                    app.canvas.graph_mouse[1], // Y
                ];
                app.canvas.graph.add(node); // Add node
                app.canvas.selectNode(node); // Select node
                app.graph.setDirtyCanvas(true, true); // Forces to redraw or the main canvas (LGraphNode) and the bg canvas (links)
            },
        });

        return options;
    };
    }
    else {
        const getCanvasMenuOptions = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function () {
        const options = getCanvasMenuOptions.apply(this, arguments);

        options.shift({
            content: 'mxReroute',
        });

        return options;
    };
    }
}

const ext = {
    name: id,
    setup(app) {
        if (localStorage.getItem(mxConfig_id) === null) {
            localStorage.setItem(mxConfig_id, JSON.stringify(mxConfig_default));
        }
        mxConfig = JSON.parse(localStorage.getItem(mxConfig_id));
        editSlotTypesDefault(mxConfig.enable_linkMenu)
        editContextOptions(mxConfig.enable_contextMenu)

        app.ui.settings.addSetting({
            id: id + "one",
            name: "🧰 mxReroute",
            type: (name) => {
                return $el("tr", [
                    $el("td", [
                        $el("label", {
                            textContent: name,
                        }),
                    ]),
                    
                    $el("td", [
                        $el(
                            "label",
                            {
                                textContent: "Enable in link menu ",
                                style: {
                                    display: "block",
                                },
                            },
                            [
                                $el("input", {
                                    id: id + "linkMenu",
                                    type: "checkbox",
                                    checked: mxConfig.enable_linkMenu,
                                    onchange: (event) => {
                                        mxConfig.enable_linkMenu = event.target.checked;
                                        localStorage.setItem(mxConfig_id, JSON.stringify(mxConfig));
                                        editSlotTypesDefault(mxConfig.enable_linkMenu);
                                    },
                                }),
                            ]
                        ),

                        $el(
                            "label",
                            {
                                textContent: "Enable in the context menu ",
                                style: {
                                    display: "block",
                                },
                            },
                            [
                                $el("input", {
                                    id: id + "contextMenu",
                                    type: "checkbox",
                                    checked: mxConfig.enable_contextMenu,
                                    onchange: (event) => {
                                        mxConfig.enable_contextMenu = event.target.checked;
                                        localStorage.setItem(mxConfig_id, JSON.stringify(mxConfig));
                                        editContextOptions(mxConfig.enable_contextMenu);
                                    },
                                }),
                            ]
                        ),

                    ]),
                ]);
            },
        });
    },
};

app.registerExtension(ext);
