import { Graph } from "../graph";
import { dfs } from "./dfs";

describe("algorithms.dfs", function () {
    var g = new Graph();
    beforeEach(() => g = new Graph());

    it("returns the root for a singleton graph", function () {
        g.setNode("a");
        expect(dfs(g, "a")).toEqual(["a"]);
    });

    it("visits each node in the graph once, scenario #1", function () {
        g.setPath(["a", "b", "d", "e"]);
        g.setPath(["a", "c", "d", "e"]);

        expect(dfs(g, "a")).toEqual(["a", "c", "d", "e", "b"]);
    });

    it("visits each node in the graph once, scenario #2", function () {
        g.setPath(["a", "b", "c", "d"]);
        g.setPath(["a", "e", "f", "g"]);
        g.setPath(["a", "h", "i", "j"]);
        g.setPath(["a", "k", "l", "m"]);
        expect(dfs(g, "a")).toEqual(["a", "k", "l", "m", "h", "i", "j", "e", "f", "g", "b", "c", "d"]);
    });

    it("works for a tree", function () {
        g.setEdge("a", "b");
        g.setPath(["a", "c", "d"]);
        g.setEdge("c", "e");

        expect(dfs(g, "a")).toEqual(["a", "c", "e", "d", "b"]);
    });

    it("works for an array of roots", function () {
        var nodes: string[] = [];
        g.setEdge("a", "b");
        g.setEdge("c", "d");
        g.setNode("e");
        g.setNode("f");

        ["a", "c", "e"].forEach(v => nodes.push(...dfs(g, v)));
        expect(nodes).toEqual(["a", "b", "c", "d", "e"]);
    });
});