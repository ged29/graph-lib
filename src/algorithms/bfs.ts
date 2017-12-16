import { Graph } from "../graph";
// Breadth-First Search
export function bfs(g: Graph, nodeId: string): string[] {
    var visited: { [nodeId: string]: boolean } = {},
        cache: string[] = [],
        result: string[] = [];

    visited[nodeId] = true;

    while (nodeId) {
        result.push(nodeId);

        for (let testNodeId of g.successors(nodeId)) {
            if (!visited[testNodeId]) {                
                visited[testNodeId] = true;
                cache.push(testNodeId);
            }
        }

        nodeId = cache.shift();
    }

    return result;
}