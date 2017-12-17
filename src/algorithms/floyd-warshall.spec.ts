import { Graph, IEdge } from "../graph";
import { floydWarshall } from "./floyd-warshall";

describe("algorithms.floydWarshall", function () {
    var g: Graph,
        weightFn = (graph: Graph) => (edge: IEdge) => graph.edges[`${edge.fromNodeId}:${edge.toNodeId}`];

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
});