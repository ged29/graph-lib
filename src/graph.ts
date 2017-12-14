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

    setEdge(aId: string, bId: string, value?: TValue): this {
        var edgeId: string = `${aId}:${bId}`,
            edgeObj: IEdge = { outNodeId: aId, inNodeId: bId };
        // [aId]------|edgeId|--------->[bId]
        this.setNode(aId).setNode(bId);

        this.pred[bId][aId] = edgeObj;
        this.sucs[aId][bId] = edgeObj;

        this.out[aId][edgeId] = edgeObj;
        this.in[bId][edgeId] = edgeObj;

        this.edges[edgeId] = value;
        this.edgeCount += 1;
        return this;
    }

    removeEdge(aId: string, bId: string): this {
        var edgeId: string = `${aId}:${bId}`;
        if (!this.edges.hasOwnProperty(edgeId)) {
            return this;
        }

        delete this.pred[bId][aId];
        delete this.sucs[aId][bId];
        delete this.out[aId][edgeId];
        delete this.in[bId][edgeId];
        delete this.edges[edgeId];
        this.edgeCount -= 1;
        return this;
    }

    hasEdge(aId: string, bId: string): boolean {
        return this.edges.hasOwnProperty(`${aId}:${bId}`);
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
    outNodeId: string;
    inNodeId: string;
}

type TValue = number | string;