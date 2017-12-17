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
            edgeObj: IEdge = { fromNodeId: "a", toNodeId: "b" };

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
            edgeObj: IEdge = { fromNodeId: "a", toNodeId: "b" };;

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
        expect(g.inEdges("b")).toEqual([{ fromNodeId: "a", toNodeId: "b" }]);
        expect(g.inEdges("c")).toEqual([{ fromNodeId: "b", toNodeId: "c" }]);
    });

    it("can return only incoming edges from a specified node", function () {
        var compareFn = (a: IEdge, b: IEdge) => a.fromNodeId.localeCompare(b.toNodeId);
        g.setEdge("a", "b");
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("z", "b");
        g.setEdge("x", "b");

        expect(g.inEdges("c").sort(compareFn)).toEqual([
            { fromNodeId: "a", toNodeId: "c" },
            { fromNodeId: "b", toNodeId: "c" }
        ]);
        expect(g.inEdges("c", "a")).toEqual([{ fromNodeId: "a", toNodeId: "c" }]);

        expect(g.inEdges("b").sort(compareFn)).toEqual([
            { fromNodeId: "a", toNodeId: "b" },
            { fromNodeId: "x", toNodeId: "b" },
            { fromNodeId: "z", toNodeId: "b" }
        ]);
        expect(g.inEdges("b", "z").sort(compareFn)).toEqual([{ fromNodeId: "z", toNodeId: "b" }]);
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
        expect(g.outEdges("b")).toEqual([{ fromNodeId: "b", toNodeId: "c" }]);
        expect(g.outEdges("a")).toEqual([{ fromNodeId: "a", toNodeId: "b" }]);
    });

    it("can return only incoming edges from a specified node", function () {
        var compareFn = (a: IEdge, b: IEdge) => a.toNodeId.localeCompare(b.toNodeId);
        g.setEdge("a", "b");
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("z", "b");
        g.setEdge("x", "b");

        expect(g.outEdges("z").sort(compareFn)).toEqual([
            { fromNodeId: "z", toNodeId: "a" },
            { fromNodeId: "z", toNodeId: "b" }
        ]);
        expect(g.outEdges("z", "a")).toEqual([{ fromNodeId: "z", toNodeId: "a" }]);

        expect(g.outEdges("a").sort(compareFn)).toEqual([
            { fromNodeId: "a", toNodeId: "b" },
            { fromNodeId: "a", toNodeId: "c" }
        ]);
        expect(g.outEdges("a", "b").sort(compareFn)).toEqual([{ fromNodeId: "a", toNodeId: "b" }]);
    });

});

describe("nodeEdges", () => {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns [] for a node that is not in the graph", function () {
        expect(g.nodeEdges("a")).toEqual([]);
    });

    it("returns all edges that this node points at", function () {
        let compareFn = (a: IEdge, b: IEdge) => a.toNodeId.localeCompare(b.toNodeId);
        // [a] -> [b] -> [c]
        g.setEdge("a", "b");
        g.setEdge("b", "c");

        expect(g.nodeEdges("a")).toEqual([{ fromNodeId: "a", toNodeId: "b" }]);

        expect(g.nodeEdges("b").sort(compareFn)).toEqual([
            { fromNodeId: "a", toNodeId: "b" },
            { fromNodeId: "b", toNodeId: "c" }
        ]);

        expect(g.nodeEdges("c")).toEqual([{ fromNodeId: "b", toNodeId: "c" }]);
    });

    it("can return only incoming edges from a specified node", function () {
        let compareFn = (a: IEdge, b: IEdge) => {
            let outNodeCompare = a.fromNodeId.localeCompare(b.fromNodeId);
            return outNodeCompare === 0 ? a.toNodeId.localeCompare(b.toNodeId) : outNodeCompare;
        };

        g.setEdge("a", "b");
        g.setEdge("a", "c");
        g.setEdge("b", "c");
        g.setEdge("z", "a");
        g.setEdge("z", "b");
        g.setEdge("x", "b");

        expect(g.nodeEdges("b").sort(compareFn)).toEqual([
            { fromNodeId: "a", toNodeId: "b" },
            { fromNodeId: "b", toNodeId: "c" },
            { fromNodeId: "x", toNodeId: "b" },
            { fromNodeId: "z", toNodeId: "b" }
        ]);
        expect(g.nodeEdges("b", "c").sort(compareFn)).toEqual([{ fromNodeId: "b", toNodeId: "c" }]);

        expect(g.nodeEdges("a").sort(compareFn)).toEqual([
            { fromNodeId: "a", toNodeId: "b" },
            { fromNodeId: "a", toNodeId: "c" },
            { fromNodeId: "z", toNodeId: "a" }
        ]);
        expect(g.nodeEdges("a", "z").sort(compareFn)).toEqual([{ fromNodeId: "z", toNodeId: "a" }]);
    });
});

describe("sources", function () {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns nodes in the graph that have no in-edges", function () {
        g.setPath(["a", "b", "c"]);
        g.setNode("d");
        expect(g.sources().sort()).toEqual(["a", "d"]);
    });
});

describe("sinks", function () {
    let g: Graph;
    beforeEach(() => g = new Graph());

    it("returns nodes in the graph that have no out-edges", function () {
        g.setPath(["a", "b", "c"]);
        g.setNode("d");
        expect(g.sinks().sort()).toEqual(["c", "d"]);
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