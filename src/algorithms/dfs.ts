import { Graph } from "../graph";
// Depth-First Search
export function dfs(g: Graph, nodeId: string): string[] {
    var visited: { [nodeId: string]: boolean } = {},
        cache: string[] = [],
        result: string[] = [];

    while (nodeId) {
        visited[nodeId] = true;
        result.push(nodeId);

        for (let testNodeId of g.successors(nodeId)) {
            if (!visited[testNodeId]) {
                cache.push(testNodeId);
            }
        }

        nodeId = cache.pop();
    }

    return result;
}