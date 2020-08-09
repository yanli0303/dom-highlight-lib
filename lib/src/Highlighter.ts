import { Alert } from './Alert';

export class Highlighter {
  matches: {
    node: Node;
    alerts: Alert[];
    ranges: Range[];
  }[] = [];

  constructor(
    readonly getTextNodes: () => Node[],
    readonly match: (paragraphs: string[]) => Promise<Alert[][]>,
    readonly minBatchTextLength: number = 1000
  ) {}

  async scan() {
    this.matches.forEach(m => m.ranges.forEach(r => r.detach()));
    this.matches = [];

    const nodes = await this.getTextNodes();
    const l = nodes.length;
    let batch: Node[] = [];
    let batchTextLength = 0;
    for (let i = 0; i < l; i += 1) {
      const node = nodes[i];
      batch.push(node);
      batchTextLength += (node.nodeValue || '').length;
      if (i === l - 1 || batchTextLength > this.minBatchTextLength) {
        const alertGroups = await this.match(batch.map(n => n.nodeValue || ''));
        batch.forEach((n, i) => {
          this.matches.push({
            node: n,
            alerts: alertGroups[i],
            ranges: [],
          });
        });

        batch = [];
        batchTextLength = 0;
      }
    }

    this.updateHighlights();
  }

  updateHighlights() {
    for (const m of this.matches) {
      m.ranges.forEach(r => r.detach());

      m.ranges = m.alerts.map(a => {
        const r = document.createRange();
        r.setStart(m.node, a.start);
        r.setEnd(m.node, a.end);
        return r;
      });
    }
  }
}
