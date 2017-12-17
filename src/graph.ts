export class Graph {
    in: { [nodeId: string]: { [edgeId: string]: IEdge } } = {};
    pred: { [nodeId: string]: { [nodeId: string]: IEdge } } = {};
    out: { [nodeId: string]: { [edgeId: string]: IEdge } } = {};
    sucs: { [nodeId: string]: { [nodeId: string]: IEdge } } = {};

    nodes: { [nodeId: string]: TValue } = {};
    nodeCount: number = 0;
    edges: { [edgeId: string]: TValue } = {};
    edgeCount: number = 0;

    setNodes(ids: string[], value?: TValue): this {
        var inx: number = 0,
            len: number = ids.length;

        for (; inx < len; inx++) {
            this.setNode(ids[inx], value);
        }

        return this;
    }

    hasNode(id: string): boolean {
        return this.nodes.hasOwnProperty(id);
    }

    setNode(id: string, value?: TValue): this {
        if (this.hasNode(id)) { // node already exists
            if (value !== undefined) {
                this.nodes[id] = value;
            }
            return this;
        }

        this.in[id] = {};
        this.pred[id] = {};

        this.out[id] = {};
        this.sucs[id] = {};

        this.nodes[id] = value;
        this.nodeCount += 1;
        return this;
    }

    removeNode(id: string): this {
        var edges: string[],
            removeEdgeFn = (edgeId: string) => this.removeEdge.apply(this, edgeId.split(":"));

        if (!this.hasNode(id)) {
            return this;
        }

        if ((edges = Object.keys(this.in[id])).length) {
            edges.forEach(removeEdgeFn);
            delete this.in[id];
        }

        if ((edges = Object.keys(this.out[id])).length) {
            edges.forEach(removeEdgeFn);
            delete this.out[id];
        }

        delete this.nodes[id];
        this.nodeCount -= 1;
        return this;
    }

    setEdge(fromNodeId: string, toNodeId: string, value?: TValue): this {
        var edgeId: string = `${fromNodeId}:${toNodeId}`,
            edgeObj: IEdge = { fromNodeId, toNodeId };
        // [fromNodeId]------|edgeId|--------->[toNodeId]
        this.setNode(fromNodeId).setNode(toNodeId);

        this.pred[toNodeId][fromNodeId] = edgeObj;
        this.sucs[fromNodeId][toNodeId] = edgeObj;

        this.out[fromNodeId][edgeId] = edgeObj;
        this.in[toNodeId][edgeId] = edgeObj;

        this.edges[edgeId] = value;
        this.edgeCount += 1;
        return this;
    }

    removeEdge(fromNodeId: string, toNodeId: string): this {
        var edgeId: string = `${fromNodeId}:${toNodeId}`;
        if (!this.edges.hasOwnProperty(edgeId)) {
            return this;
        }

        delete this.pred[toNodeId][fromNodeId];
        delete this.sucs[fromNodeId][toNodeId];
        delete this.out[fromNodeId][edgeId];
        delete this.in[toNodeId][edgeId];
        delete this.edges[edgeId];
        this.edgeCount -= 1;
        return this;
    }

    hasEdge(fromNodeId: string, toNodeId: string): boolean {
        return this.edges.hasOwnProperty(`${fromNodeId}:${toNodeId}`);
    }

    inEdges(inNodeId: string, filterByOutNodeId?: string): IEdge[] {
        var result: IEdge[] = [],
            inNodeIdEdges: { [edgeId: string]: IEdge } = this.in[inNodeId];
        if (inNodeIdEdges === undefined) {
            return [];
        }

        if (filterByOutNodeId) {
            let edgeId = `${filterByOutNodeId}:${inNodeId}`;
            return inNodeIdEdges.hasOwnProperty(edgeId) ? [inNodeIdEdges[edgeId]] : [];
        }

        return Object.keys(inNodeIdEdges).map(edgeId => inNodeIdEdges[edgeId]);
    }

    outEdges(outNodeId: string, filterByInNodeId?: string): IEdge[] {
        var result: IEdge[] = [],
            outNodeIdEdges: { [edgeId: string]: IEdge } = this.out[outNodeId];
        if (outNodeIdEdges === undefined) {
            return [];
        }

        if (filterByInNodeId) {
            let edgeId = `${outNodeId}:${filterByInNodeId}`;
            return outNodeIdEdges.hasOwnProperty(edgeId) ? [outNodeIdEdges[edgeId]] : [];
        }

        return Object.keys(outNodeIdEdges).map(edgeId => outNodeIdEdges[edgeId]);
    }

    /**
     * Returns nodes in the graph that have no out-edges
     */
    sinks(): string[] {
        var result: string[] = [];

        for (var nodeId in this.nodes) {
            if (Object.keys(this.out[nodeId]).length === 0) {
                result.push(nodeId);
            }
        }

        return result;
    }
    /**
     * Returns nodes in the graph that have no in-edges
     */
    sources(): string[] {
        var result: string[] = [];

        for (var nodeId in this.nodes) {
            if (Object.keys(this.in[nodeId]).length === 0) {
                result.push(nodeId);
            }
        }

        return result;
    }

    predecessors(nodeId: string): string[] {
        return this.pred.hasOwnProperty(nodeId)
            ? Object.keys(this.pred[nodeId])
            : [];
    }

    successors(nodeId: string): string[] {
        return this.sucs.hasOwnProperty(nodeId)
            ? Object.keys(this.sucs[nodeId])
            : [];
    }

    neighbors(nodeId: string): string[] {
        return this.predecessors(nodeId).concat(this.successors(nodeId));
    }

    nodeEdges(outNodeId: string, inNodeId?: string): IEdge[] {
        return this.outEdges(outNodeId, inNodeId).concat(this.inEdges(outNodeId, inNodeId));
    }

    setPath(path: string[]): this {
        var inx: number = 0,
            last: number = path.length - 1;

        for (; inx < last; inx++) {
            this.setEdge(path[inx], path[inx + 1]);
        }

        return this;
    }
}

export interface IEdge {
    fromNodeId: string;
    toNodeId: string;
}

type TValue = number | string;