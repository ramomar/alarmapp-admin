export class AlarmStateSummary {
  readonly areas: Array<AreaSummary>;
  readonly sirenIsActive: boolean;
  readonly systemIsActive: boolean;

  constructor(areas: Array<AreaSummary>,
              sirenIsActive: boolean,
              systemIsActive: boolean) {
    this.areas = areas;
    this.sirenIsActive = sirenIsActive;
    this.systemIsActive = systemIsActive;
  }

  getOpenAreasCount(): number {
    return this.areas.filter(z => !z.isClosed).length;
  }

  getClosedAreasCount(): number {
    return this.areas.filter(z => z.isClosed).length;
  }
}

export class AreaSummary {
  readonly areaNumber: number;
  readonly isClosed: boolean;

  constructor(areaNumber: number,
              isClosed: boolean) {
    this.areaNumber = areaNumber;
    this.isClosed = isClosed;
  }
}

export const AreaZonesMappings: Map<number, Array<string>> = new Map([
  [1, ['main_door']],
  [2, ['sitting_room_movement_sensor']],
  [3, ['sitting_room_front_window', 'sitting_room_lateral_window']],
  [4, ['dinning_room_window', 'dinning_room_door', 'laundry_room_window', 'laundry_room_door']],
  [5, ['main_bedroom_window']],
  [6, ['living_room_window', 'living_room_bathroom_window', 'right_bedroom', 'left_bedroom']]
]);

export const AreaFloorMappings: Map<number, number> = new Map([
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 2],
  [6, 2]
]);
