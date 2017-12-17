import { Graph } from "../graph";
import { topSort } from "./topsort";

describe("algorithms.topSort", function () {
    var g = new Graph();
    beforeEach(() => g = new Graph());

    it("returns an empty array for an empty graph", function () {
        expect(topSort(g)).toEqual([]);
    });

    it("sorts nodes such that earlier nodes have directed edges to later nodes", function () {
        g.setPath(["b", "c", "a"]);
        var ts = topSort;
        //expect(topSort(g)).toEqual(["b", "c", "a"]);
    });

    // it("works for a diamond", function () {
    //     g.setPath(["a", "b", "d"]);
    //     g.setPath(["a", "c", "d"]);

    //     var rez = topSort(g);
    //     expect(topSort(g)).toEqual(["a"]);
    // });

});