import { Graph } from "../graph";

export function topSort(g: Graph) {
    var visited: { [nodeId: string]: boolean } = {},
        stack: string[] = [],
        gray: string[] = [],
        results: string[] = [];

    g.sinks().forEach(sinkNodeId => {
        // dfs
        let nodeId = sinkNodeId;

        while (nodeId) {
            for (let testNodeId of g.predecessors(nodeId)) {
                if (!visited[testNodeId]) {
                    visited[nodeId] = true;
                    stack.push(nodeId);
                    gray.push(nodeId);
                }
            }

            nodeId = stack.pop();
        }

        results.unshift(gray.pop());
    });

    return results;
}
