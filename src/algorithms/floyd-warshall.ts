import { Graph, IEdge } from "../graph";

export function floydWarshall(
    g: Graph,
    weightFn: (edge: IEdge) => number = (edge: IEdge) => 1,
    edgeFn: (nodeId: string) => IEdge[] = (nodeId: string) => g.outEdges(nodeId)) {

    var result: {
        [fromNodeId: string]: {
            [toNodeId: string]: IDistance
        }
    } = {},
        nodeIds = Object.keys(g.nodes),
        outerNodeId: string,
        innerNodeId: string;

    nodeIds.forEach((fromNodeId) => {
        result[fromNodeId] = {};
        result[fromNodeId][fromNodeId] = { distance: 0 };

        nodeIds.forEach((toNodeId) => {
            if (fromNodeId !== toNodeId) {
                result[fromNodeId][toNodeId] = { distance: Number.POSITIVE_INFINITY };
            }
        });

        edgeFn(fromNodeId).forEach(edge => {
            let toNodeId = edge.fromNodeId === fromNodeId ? edge.toNodeId : edge.fromNodeId,
                distance = weightFn(edge);

            result[fromNodeId][toNodeId] = {
                distance: distance,
                predecessor: fromNodeId
            };
        });
    });

    nodeIds.forEach((k) => {
        let rowK = result[k];

        nodeIds.forEach((i) => {
            let rowI = result[i];

            nodeIds.forEach((j) => {
                var kj = rowK[j],
                    ik = rowI[k],
                    ij = rowI[j],
                    altDistance = kj.distance + ik.distance;
                if (altDistance < ij.distance) {
                    ij.distance = altDistance;
                    ij.predecessor = kj.predecessor;
                }
            });
        });
    });

    return result;
}

export interface IDistance {
    distance: number;
    predecessor?: string;
}