import { Graph, IEdge } from "./graph";

describe("setNodes", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("creates multiple nodes", function () {
        g.setNodes(["a", "b", "c"]);
        expect(g.hasNode("a")).toBe(true);
        expect(g.hasNode("b")).toBe(true);
        expect(g.hasNode("c")).toBe(true);
        expect(g.nodeCount).toBe(3);
    });

    it("can set a value for all of the nodes", function () {
        g.setNodes(["a", "b", "c"], "foo");
        expect(g.nodes["a"]).toEqual("foo");
        expect(g.nodes["b"]).toEqual("foo");
        expect(g.nodes["c"]).toEqual("foo");
    });
});

describe("setNode", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("creates the node if it isn\"t part of the graph", function () {
        g.setNode("a");

        expect(g.hasNode("a")).toBe(true);
        expect(g.nodes["a"]).toBe(undefined);
        expect(g.nodeCount).toEqual(1);
    });

    it("does not change the node\"s value with a 1-arg invocation", function () {
        g.setNode("a", "foo");
        g.setNode("a");

        expect(g.nodes["a"]).toEqual("foo");
    });
});

describe("removeNode", function () {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("removes the node if it is in the graph", function () {
        g.setNode("a");
        expect(g.hasNode("a")).toBe(true);
        expect(g.nodeCount).toBe(1);

        g.removeNode("a");
        expect(g.hasNode("a")).toBe(false);
        expect(g.nodeCount).toBe(0);
    });

    it("removes edges incident on the nodes", function () {
        // [a] -> [b] -> [c]
        g.setEdge("a", "b");
        g.setEdge("b", "c");

        expect(g.hasNode("a")).toBe(true);
        expect(g.hasNode("b")).toBe(true);
        expect(g.hasNode("c")).toBe(true);
        expect(g.nodeCount).toBe(3);

        g.removeNode("b");
        expect(g.hasNode("a")).toBe(true);
        expect(g.hasNode("b")).toBe(false);
        expect(g.hasNode("c")).toBe(true);
        expect(g.nodeCount).toBe(2);
        expect(g.edgeCount).toBe(0);
    });
});

describe("setEdge", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("creates the edge if it isn't part of the graph", function () {
        var edgeId = "a:b",
            edgeObj: IEdge = { outNodeId: "a", inNodeId: "b" };

        g.setNode("a");
        g.setNode("b");
        g.setEdge("a", "b");

        expect(g.hasEdge("a", "b")).toBe(true);
        expect(g.edges[edgeId]).toBe(undefined);

        expect(g.out["a"][edgeId]).toEqual(edgeObj);
        expect(g.in["b"][edgeId]).toEqual(edgeObj);
        // [a] -> [b]
        expect(g.predecessors("a")).toEqual([]);
        expect(g.predecessors("b")).toEqual(["a"]);

        expect(g.successors("a")).toEqual(["b"]);
        expect(g.successors("b")).toEqual([]);

        expect(g.edgeCount).toEqual(1);
    });

    it("creates the nodes for the edge if they are not part of the graph", function () {
        g.setEdge("a", "b");

        expect(g.hasNode("a")).toBe(true);
        expect(g.hasNode("b")).toBe(true);
        expect(g.nodeCount).toEqual(2);
    });

    it("changes the value for an edge if it is already in the graph", function () {
        g.setEdge("a", "b", "foo");
        g.setEdge("a", "b", "bar");
        expect(g.edges["a:b"]).toEqual("bar");
    });

    it("treats edges in opposite directions as distinct", function () {
        g.setEdge("a", "b");
        expect(g.hasEdge("a", "b")).toBe(true);
        expect(g.hasEdge("b", "a")).toBe(false);
    });
});

describe("removeEdge", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("has no effect if the edge is not in the graph", function () {
        g.removeEdge("a", "b");

        expect(g.hasEdge("a", "b")).toBe(false);
        expect(g.edgeCount).toEqual(0);
    });

    it("can remove an edge by connected node ids", function () {
        var edgeId = "a:b",
            edgeObj: IEdge = { outNodeId: "a", inNodeId: "b" };;

        g.setEdge("a", "b");

        expect(g.out["a"][edgeId]).toEqual(edgeObj);
        expect(g.in["b"][edgeId]).toEqual(edgeObj);
        expect(g.hasEdge("a", "b")).toBe(true);
        expect(g.edgeCount).toEqual(1);

        g.removeEdge("a", "b");

        expect(g.out["a"].hasOwnProperty(edgeId)).toBe(false);
        expect(g.in["b"].hasOwnProperty(edgeId)).toBe(false);
        expect(g.hasEdge("a", "b")).toBe(false);
        expect(g.edgeCount).toEqual(0);
    });

    it("correctly removes neighbors", function () {
        g.setEdge("a", "b");
        g.removeEdge("a", "b");
        expect(g.successors("a")).toEqual([]);
        expect(g.neighbors("a")).toEqual([]);
        expect(g.predecessors("b")).toEqual([]);
        expect(g.neighbors("b")).toEqual([]);
    });
});

describe("inEdges", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns [] for a node that is not in the graph", function () {
        expect(g.inEdges("a")).toEqual([]);
    });

    it("returns the edges that point at the specified node", function () {
        // [a] -> [b] -> [c]
        g.setEdge("a", "b");
        g.setEdge("b", "c");

        expect(g.inEdges("a")).toEqual([]);
        expect(g.inEdges("b")).toEqual([{ outNodeId: "a", inNodeId: "b" }]);
        expect(g.inEdges("c")).toEqual([{ outNodeId: "b", inNodeId: "c" }]);
    });

    it("can return only incoming edges from a specified node", function () {
        var compareFn = (a: IEdge, b: IEdge) => a.outNodeId.localeCompare(b.outNodeId);
        g.setEdge("a", "b");
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("z", "b");
        g.setEdge("x", "b");

        expect(g.inEdges("c").sort(compareFn)).toEqual([
            { outNodeId: "a", inNodeId: "c" },
            { outNodeId: "b", inNodeId: "c" }
        ]);
        expect(g.inEdges("c", "a")).toEqual([{ outNodeId: "a", inNodeId: "c" }]);

        expect(g.inEdges("b").sort(compareFn)).toEqual([
            { outNodeId: "a", inNodeId: "b" },
            { outNodeId: "x", inNodeId: "b" },
            { outNodeId: "z", inNodeId: "b" }
        ]);
        expect(g.inEdges("b", "z").sort(compareFn)).toEqual([{ outNodeId: "z", inNodeId: "b" }]);
    });

});

describe("outEdges", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns [] for a node that is not in the graph", function () {
        expect(g.outEdges("a")).toEqual([]);
    });

    it("returns the edges that point at the specified node", function () {
        // [a] -> [b] -> [c]
        g.setEdge("a", "b");
        g.setEdge("b", "c");

        expect(g.outEdges("c")).toEqual([]);
        expect(g.outEdges("b")).toEqual([{ outNodeId: "b", inNodeId: "c" }]);
        expect(g.outEdges("a")).toEqual([{ outNodeId: "a", inNodeId: "b" }]);
    });

    it("can return only incoming edges from a specified node", function () {
        var compareFn = (a: IEdge, b: IEdge) => a.inNodeId.localeCompare(b.inNodeId);
        g.setEdge("a", "b");
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("z", "b");
        g.setEdge("x", "b");

        expect(g.outEdges("z").sort(compareFn)).toEqual([
            { outNodeId: "z", inNodeId: "a" },
            { outNodeId: "z", inNodeId: "b" }
        ]);
        expect(g.outEdges("z", "a")).toEqual([{ outNodeId: "z", inNodeId: "a" }]);

        expect(g.outEdges("a").sort(compareFn)).toEqual([
            { outNodeId: "a", inNodeId: "b" },
            { outNodeId: "a", inNodeId: "c" }
        ]);
        expect(g.outEdges("a", "b").sort(compareFn)).toEqual([{ outNodeId: "a", inNodeId: "b" }]);
    });

});

describe("nodeEdges", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns [] for a node that is not in the graph", function () {
        expect(g.nodeEdges("a")).toEqual([]);
    });

    it("returns all edges that this node points at", function () {
        let compareFn = (a: IEdge, b: IEdge) => a.inNodeId.localeCompare(b.inNodeId);
        // [a] -> [b] -> [c]
        g.setEdge("a", "b");
        g.setEdge("b", "c");

        expect(g.nodeEdges("a")).toEqual([{ outNodeId: "a", inNodeId: "b" }]);

        expect(g.nodeEdges("b").sort(compareFn)).toEqual([
            { outNodeId: "a", inNodeId: "b" },
            { outNodeId: "b", inNodeId: "c" }
        ]);

        expect(g.nodeEdges("c")).toEqual([{ outNodeId: "b", inNodeId: "c" }]);
    });

    it("can return only incoming edges from a specified node", function () {
        let compareFn = (a: IEdge, b: IEdge) => {
            let outNodeCompare = a.outNodeId.localeCompare(b.outNodeId);
            return outNodeCompare === 0 ? a.inNodeId.localeCompare(b.inNodeId) : outNodeCompare;
        };

        g.setEdge("a", "b");
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("z", "b");
        g.setEdge("x", "b");

        expect(g.nodeEdges("b").sort(compareFn)).toEqual([
            { outNodeId: "a", inNodeId: "b" },
            { outNodeId: "b", inNodeId: "c" },
            { outNodeId: "x", inNodeId: "b" },
            { outNodeId: "z", inNodeId: "b" }
        ]);
        expect(g.nodeEdges("b", "c").sort(compareFn)).toEqual([{ outNodeId: "b", inNodeId: "c" }]);

        expect(g.nodeEdges("a").sort(compareFn)).toEqual([
            { outNodeId: "a", inNodeId: "b" },
            { outNodeId: "a", inNodeId: "c" },
            { outNodeId: "z", inNodeId: "a" }
        ]);
        expect(g.nodeEdges("a", "z").sort(compareFn)).toEqual([{ outNodeId: "z", inNodeId: "a" }]);
    });
});

describe("setPath", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("creates a path of mutiple edges, scenario #1", function () {
        g.setPath(["a", "b", "c"]);

        expect(g.hasEdge("a", "b")).toBe(true);
        expect(g.hasEdge("b", "c")).toBe(true);
    });

    it("creates a path of mutiple edges, scenario #2", function () {
        g.setPath(["a", "b", "c"]);

        expect(g.hasEdge("a", "b")).toBe(true);
        expect(g.hasEdge("b", "c")).toBe(true);
    });
});

describe("predecessors", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns [] for a node that is not in the graph", function () {
        expect(g.predecessors("a")).toEqual([]);
    });

    it("returns the predecessors of a node", function () {
        g.setEdge("a", "b");
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("z", "b");
        g.setEdge("x", "b");

        expect(g.predecessors("b").sort()).toEqual(["a", "x", "z"]);
        expect(g.predecessors("a")).toEqual(["z"]);
        expect(g.predecessors("x")).toEqual([]);
    });
});

describe("successors", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns [] for a node that is not in the graph", function () {
        expect(g.successors("a")).toEqual([]);
    });

    it("returns the successors of a node", function () {
        g.setEdge("b", "x");
        g.setEdge("b", "z");
        g.setEdge("b", "a");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("a", "c");

        expect(g.successors("b").sort()).toEqual(["a", "c", "x", "z"]);
        expect(g.successors("a")).toEqual(["c"]);
        expect(g.successors("c")).toEqual([]);
    });
});

describe("neighbors", function () {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns [] for a node that is not in the graph", function () {
        expect(g.neighbors("a")).toEqual([]);
    });

    it("returns the neighbors of a node", function () {
        g.setEdge("a", "b");
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("z", "b");
        g.setEdge("x", "b");
        g.setNode("www");

        expect(g.neighbors("b").sort()).toEqual(["a", "c", "x", "z"]);
        expect(g.neighbors("a").sort()).toEqual(["b", "c", "z"]);
        expect(g.neighbors("x")).toEqual(["b"]);
        expect(g.neighbors("www")).toEqual([]);
    });
});