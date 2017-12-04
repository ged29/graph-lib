System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Graph;
    return {
        setters: [],
        execute: function () {
            Graph = (function () {
                function Graph() {
                    this.nodesCount = 0;
                    this.edgesCount = 0;
                }
                Graph.prototype.setNodes = function (ids, value) {
                    var inx = 0, len = ids.length;
                    for (; inx < len; inx++) {
                        this.setNode(ids[inx], value);
                    }
                    return this;
                };
                Graph.prototype.hasNode = function (id) {
                    return this.nodes.hasOwnProperty[id];
                };
                Graph.prototype.setNode = function (id, value) {
                    if (this.nodes.hasOwnProperty(id)) {
                        if (value !== undefined) {
                            this.nodes[id] = value;
                        }
                        return this;
                    }
                    this.nodes[id] = value;
                    this.in[id] = {};
                    this.out[id] = {};
                    this.nodesCount += 1;
                    return this;
                };
                Graph.prototype.removeNode = function (id) {
                    var _this = this;
                    var edges, removeEdgeFn = function (edgeId) { return _this.removeEdge.apply(_this, edgeId.split(":")); };
                    if (!this.nodes.hasOwnProperty[id]) {
                        return this;
                    }
                    if ((edges = Object.keys(this.in[id])).length) {
                        edges.forEach(removeEdgeFn);
                        delete this.in[id];
                    }
                    if ((edges = Object.keys(this.out[id])).length) {
                        edges.forEach(removeEdgeFn);
                        delete this.out[id];
                    }
                    delete this.nodes[id];
                    return this;
                };
                Graph.prototype.setEdge = function (aId, bId, value) {
                    var edgeId = aId + ":" + bId, edgeObj = { outNodeId: aId, inNodeId: bId };
                    // [aId]------|edgeId|---------[bId]
                    this.setNode(aId);
                    this.setNode(bId);
                    this.in[bId][edgeId] = edgeObj;
                    this.out[aId][edgeId] = edgeObj;
                    this.edges[edgeId] = value;
                    this.edgesCount += 1;
                    return this;
                };
                Graph.prototype.removeEdge = function (aId, bId) {
                    var edgeId = aId + ":" + bId;
                    if (!this.edges.hasOwnProperty(edgeId)) {
                        return false;
                    }
                    delete this.in[bId][edgeId];
                    delete this.out[aId][edgeId];
                    delete this.edges[edgeId];
                    this.edgesCount -= 1;
                };
                Graph.prototype.hasEdge = function (aId, bId) {
                    var edgeId = aId + ":" + bId;
                    return this.edges.hasOwnProperty(edgeId);
                };
                return Graph;
            }());
            exports_1("Graph", Graph);
        }
    };
});
