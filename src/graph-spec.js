System.register(["./graph"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var graph_1;
    return {
        setters: [
            function (graph_1_1) {
                graph_1 = graph_1_1;
            }
        ],
        execute: function () {
            describe("setNodes", function () {
                var g;
                beforeEach(function () { return g = new graph_1.Graph(); });
                it("creates multiple nodes", function () {
                    g.setNodes(["a", "b", "c"]);
                    expect(g.hasNode("a")).toBe(true);
                    expect(g.hasNode("b")).toBe(true);
                    expect(g.hasNode("c")).toBe(true);
                });
                it("can set a value for all of the nodes", function () {
                    g.setNodes(["a", "b", "c"], "foo");
                    expect(g.nodes["a"]).toEqual("foo");
                    expect(g.nodes["b"]).toEqual("foo");
                    expect(g.nodes["c"]).toEqual("foo");
                });
            });
            describe("setNode", function () {
                var g;
                beforeEach(function () { return g = new graph_1.Graph(); });
                it("creates the node if it isn\"t part of the graph", function () {
                    g.setNode("a");
                    expect(g.hasNode("a")).toBe(true);
                    expect(g.nodes["a"]).toBe(undefined);
                    expect(g.nodesCount).toEqual(1);
                });
                it("does not change the node\"s value with a 1-arg invocation", function () {
                    g.setNode("a", "foo");
                    g.setNode("a");
                    expect(g.nodes["a"]).toEqual("foo");
                });
            });
            describe("removeNode", function () {
                var g;
                beforeEach(function () { return g = new graph_1.Graph(); });
                it("removes the node if it is in the graph", function () {
                    g.setNode("a");
                    expect(g.hasNode("a")).toBe(true);
                    expect(g.nodesCount).toEqual(1);
                    g.removeNode("a");
                    expect(g.hasNode("a")).toBe(false);
                    expect(g.nodesCount).toEqual(0);
                });
                it("removes edges incident on the node", function () {
                    g.setEdge("a", "b");
                    g.setEdge("b", "c");
                    expect(g.nodesCount).toBe(3);
                    expect(g.hasNode("a")).toBe(true);
                    expect(g.hasNode("b")).toBe(true);
                    expect(g.hasNode("c")).toBe(true);
                    g.removeNode("b");
                    expect(g.edgesCount).toBe(0);
                });
            });
        }
    };
});
