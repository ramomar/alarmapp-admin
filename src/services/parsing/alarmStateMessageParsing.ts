import {
  AlarmStateSummary,
  AreaSummary
} from '../AlarmSystemService';

function toAreaSummary(string, index): AreaSummary {
  return new AreaSummary(index+1, string.includes('1'), string.includes('d'));
}

export function parseAlarmStateMessage(state): AlarmStateSummary {
  const [areasState, sirenState, systemState] = state.split('|');

  const areas = areasState.split('-').map(toAreaSummary);

  const sirenIsActive = sirenState.includes('1');

  const systemIsActive = systemState.includes('1');

  return new AlarmStateSummary(areas, sirenIsActive, systemIsActive);
}
