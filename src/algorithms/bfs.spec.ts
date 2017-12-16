import { Graph } from "../graph";
import { bfs } from "./bfs";

describe("algorithms.bfs", function () {
    var g = new Graph();
    beforeEach(() => g = new Graph());

    it("returns the root for a singleton graph", function () {
        g.setNode("a");
        expect(bfs(g, "a")).toEqual(["a"]);
    });

    it("visits each node in the graph once, scenario #1", function () {
        g.setPath(["a", "b", "d", "e"]);
        g.setPath(["a", "c", "d", "e"]);
        expect(bfs(g, "a")).toEqual(["a", "b", "c", "d", "e"]);
    });

    it("visits each node in the graph once, scenario #2", function () {
        g.setPath(["a", "b", "c", "d"]);
        g.setPath(["a", "e", "f", "g"]);
        g.setPath(["a", "h", "i", "j"]);
        g.setPath(["a", "k", "l", "m"]);
        expect(bfs(g, "a")).toEqual(["a", "b", "e", "h", "k", "c", "f", "i", "l", "d", "g", "j", "m"]);
    });

    it("works for a tree", function () {
        g.setEdge("a", "b");
        g.setPath(["a", "c", "d"]);
        g.setEdge("c", "e");

        expect(bfs(g, "a")).toEqual(["a", "b", "c", "d", "e"]);
    });

    it("works for an array of roots", function () {
        var nodes: string[] = [];
        g.setEdge("a", "b");
        g.setEdge("c", "d");
        g.setNode("e");
        g.setNode("f");

        ["a", "c", "e"].forEach(v => nodes.push(...bfs(g, v)));
        expect(nodes).toEqual(["a", "b", "c", "d", "e"]);
    });
});