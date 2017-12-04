export class Graph {
    in: { [nodeId: string]: { [edgeId: string]: IEdge } };
    out: { [nodeId: string]: { [edgeId: string]: IEdge } };
    nodes: { [nodeId: string]: TValue };
    nodesCount: number = 0;
    edges: { [edgeId: string]: TValue };
    edgesCount: number = 0;

    setNodes(ids: string[], value?: TValue): this {
        var inx: number = 0,
            len: number = ids.length;

        for (; inx < len; inx++) {
            this.setNode(ids[inx], value);
        }

        return this;
    }

    hasNode(id: string): boolean {
        return this.nodes.hasOwnProperty[id];
    }

    setNode(id: string, value?: TValue): this {
        if (this.nodes.hasOwnProperty(id)) { // node already exists
            if (value !== undefined) {
                this.nodes[id] = value;
            }
            return this;
        }

        this.nodes[id] = value;
        this.in[id] = {};
        this.out[id] = {};
        this.nodesCount += 1;
        return this;
    }

    removeNode(id: string): this {
        var edges: string[],
            removeEdgeFn = (edgeId: string) => this.removeEdge.apply(this, edgeId.split(":"));

        if (!this.nodes.hasOwnProperty[id]) {
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
        return this;
    }

    setEdge(aId: string, bId: string, value?: TValue): this {
        var edgeId: string = `${aId}:${bId}`,
            edgeObj: IEdge = { outNodeId: aId, inNodeId: bId };
        // [aId]------|edgeId|---------[bId]
        this.setNode(aId);
        this.setNode(bId);
        this.in[bId][edgeId] = edgeObj;
        this.out[aId][edgeId] = edgeObj;
        this.edges[edgeId] = value;
        this.edgesCount += 1;
        return this;
    }

    removeEdge(aId: string, bId: string): boolean {
        var edgeId: string = `${aId}:${bId}`;
        if (!this.edges.hasOwnProperty(edgeId)) {
            return false;
        }

        delete this.in[bId][edgeId];
        delete this.out[aId][edgeId];
        delete this.edges[edgeId];
        this.edgesCount -= 1;
    }

    hasEdge(aId: string, bId: string): boolean {
        var edgeId: string = `${aId}:${bId}`;
        return this.edges.hasOwnProperty(edgeId);
    }
}

interface IEdge {
    outNodeId: string;
    inNodeId: string;
}

type TValue = number | string;