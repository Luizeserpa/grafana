import { DataFrame, FieldCache } from '@grafana/data';

type Line = { x1: number; y1: number; x2: number; y2: number };

/**
 * Makes line shorter while keeping the middle in he same place.
 */
export function shortenLine(line: Line, length: number): Line {
  const vx = line.x2 - line.x1;
  const vy = line.y2 - line.y1;
  const mag = Math.sqrt(vx * vx + vy * vy);
  const ratio = Math.max((mag - length) / mag, 0);
  const vx2 = vx * ratio;
  const vy2 = vy * ratio;
  const xDiff = vx - vx2;
  const yDiff = vy - vy2;
  const newx1 = line.x1 + xDiff / 2;
  const newy1 = line.y1 + yDiff / 2;
  return {
    x1: newx1,
    y1: newy1,
    x2: newx1 + vx2,
    y2: newy1 + vy2,
  };
}

export function getNodeFields(nodes: DataFrame) {
  const fieldsCache = new FieldCache(nodes);
  return {
    id: fieldsCache.getFieldByName('id'),
    title: fieldsCache.getFieldsByLabel(labelType, titleLabel)[0],
    subTitle: fieldsCache.getFieldsByLabel(labelType, subTitleLabel)[0],
    mainStat: fieldsCache.getFieldsByLabel(labelType, mainStat)[0],
    secondaryStat: fieldsCache.getFieldsByLabel(labelType, secondaryStat)[0],
    arc: fieldsCache.getFieldsByLabel(labelType, arcLabel),
  };
}

export function getEdgeFields(edges: DataFrame) {
  const fieldsCache = new FieldCache(edges);
  return {
    id: fieldsCache.getFieldByName('id'),
    source: fieldsCache.getFieldByName('source'),
    target: fieldsCache.getFieldByName('target'),
    mainStat: fieldsCache.getFieldsByLabel(labelType, mainStat)[0],
    secondaryStat: fieldsCache.getFieldsByLabel(labelType, secondaryStat)[0],
  };
}

// TODO move to grafana data probably
const labelType = 'NodeGraphValueType';
const arcLabel = 'arc';
const titleLabel = 'title';
const subTitleLabel = 'subTitle';
const mainStat = 'mainStat';
const secondaryStat = 'secondaryStat';
