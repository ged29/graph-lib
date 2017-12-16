import { Graph, IEdge } from "../graph";
import { floydWarshall } from "./floyd-warshall";

describe("allShortestPaths", function () {
    var g: Graph,
        weightFn = (g) => (edge: IEdge) => g.edges(`${edge.outNodeId}:${edge.inNodeId}`);

    beforeEach(() => { g = new Graph(); });

    it("returns 0 for the node itself", function () {
        g.setNode("a");
        expect(floydWarshall(g)).toEqual({
            a: {
                a: { distance: 0 }
            }
        });
    });

    it("returns the distance and path from all nodes to other nodes", function () {
        g.setEdge("a", "b");
        g.setEdge("b", "c");
        
        expect(floydWarshall(g)).toEqual({
            a: {
                a: { distance: 0 },
                b: { distance: 1, predecessor: "a" },
                c: { distance: 2, predecessor: "b" }
            },
            b: {
                a: { distance: Number.POSITIVE_INFINITY },
                b: { distance: 0 },
                c: { distance: 1, predecessor: "b" }
            },
            c: {
                a: { distance: Number.POSITIVE_INFINITY },
                b: { distance: Number.POSITIVE_INFINITY },
                c: { distance: 0 }
            }
        });
    });

    // it("uses an optionally supplied weight function", function () {
    //     g.setEdge("a", "b", 2);
    //     g.setEdge("b", "c", 3);

    //     expect(floydWarshall(g, weightFn(g))).to.eql({
    //         a: {
    //             a: { distance: 0 },
    //             b: { distance: 2, predecessor: "a" },
    //             c: { distance: 5, predecessor: "b" }
    //         },
    //         b: {
    //             a: { distance: Number.POSITIVE_INFINITY },
    //             b: { distance: 0 },
    //             c: { distance: 3, predecessor: "b" }
    //         },
    //         c: {
    //             a: { distance: Number.POSITIVE_INFINITY },
    //             b: { distance: Number.POSITIVE_INFINITY },
    //             c: { distance: 0 }
    //         }
    //     });
    // });

    // it("uses an optionally supplied incident function", function () {
    //     var g = new Graph();
    //     g.setEdge("a", "b");
    //     g.setEdge("b", "c");

    //     expect(sp(g, undefined, function (v) { return g.inEdges(v); })).to.eql({
    //         a: {
    //             a: { distance: 0 },
    //             b: { distance: Number.POSITIVE_INFINITY },
    //             c: { distance: Number.POSITIVE_INFINITY }
    //         },
    //         b: {
    //             a: { distance: 1, predecessor: "b" },
    //             b: { distance: 0 },
    //             c: { distance: Number.POSITIVE_INFINITY }
    //         },
    //         c: {
    //             a: { distance: 2, predecessor: "b" },
    //             b: { distance: 1, predecessor: "c" },
    //             c: { distance: 0 }
    //         }
    //     });
    // });

    // it("works with undirected graphs", function () {
    //     var g = new Graph({ directed: false });
    //     g.setEdge("a", "b", 1);
    //     g.setEdge("b", "c", 2);
    //     g.setEdge("c", "a", 4);
    //     g.setEdge("b", "d", 6);

    //     expect(sp(g, weightFn(g), g.nodeEdges.bind(g))).to.eql({
    //         a: {
    //             a: { distance: 0 },
    //             b: { distance: 1, predecessor: "a" },
    //             c: { distance: 3, predecessor: "b" },
    //             d: { distance: 7, predecessor: "b" },
    //         },
    //         b: {
    //             a: { distance: 1, predecessor: "b" },
    //             b: { distance: 0 },
    //             c: { distance: 2, predecessor: "b" },
    //             d: { distance: 6, predecessor: "b" },
    //         },
    //         c: {
    //             a: { distance: 3, predecessor: "b" },
    //             b: { distance: 2, predecessor: "c" },
    //             c: { distance: 0 },
    //             d: { distance: 8, predecessor: "b" },
    //         },
    //         d: {
    //             a: { distance: 7, predecessor: "b" },
    //             b: { distance: 6, predecessor: "d" },
    //             c: { distance: 8, predecessor: "b" },
    //             d: { distance: 0 },
    //         }
    //     });
    // });
});