import { AlarmStateSummary, AreaSummary } from './parsing';

function toAreaSummary(string, index): AreaSummary {
  return new AreaSummary(index+1, string.includes('1'));
}

export function parseAlarmStateMessage(message): AlarmStateSummary {
  const { data } = message;

  const state = JSON.parse(data);

  const [areasState, sirenState, systemState] = state.data.split('|');

  const areas = areasState.split('-').map(toAreaSummary);

  const sirenIsActive = sirenState.includes('1');

  const systemIsActive = systemState.includes('1');

  return new AlarmStateSummary(areas, sirenIsActive, systemIsActive);
}
