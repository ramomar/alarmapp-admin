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

  getAreasForFloor(floorNumber: number): Array<AreaSummary> {
    return this.areas.filter(a => AreaFloorMappings.get(a.areaNumber) === floorNumber);
  }
}

export class AreaSummary {
  readonly areaNumber: number;
  readonly isClosed: boolean;
  readonly isDisabled: boolean;

  constructor(areaNumber: number,
              isClosed: boolean,
              isDisabled: boolean) {
    this.areaNumber = areaNumber;

    this.isClosed = isClosed;

    this.isDisabled = isDisabled;
  }
}

export enum Areas {
  MainDoor = 'main_door',
  SittingRoomMovementSensor = 'sitting_room_movement_sensor',
  SittingRoomFrontWindow = 'sitting_room_front_window',
  SittingRoomLateralWindow = 'sitting_room_lateral_window',
  DinningRoomWindow = 'dinning_room_window',
  DinningRoomDoor = 'dinning_room_door',
  LaundryWindow = 'laundry_window',
  LaundryDoor = 'laundry_door',
  LaundryBathroomWindow = 'laundry_bathroom_window',
  MainBedroomWindow = 'main_bedroom_window',
  LivingRoomWindow = 'living_room_window',
  LivingRoomBathroomWindow = 'living_room_bathroom_window',
  RightBedroomWindow = 'right_bedroom_window',
  LeftBedroomWindow = 'left_bedroom_window'
}

export const ZoneAreaMappings: Map<string, number> = new Map([
  [Areas.MainDoor, 1],
  [Areas.SittingRoomMovementSensor, 2],
  [Areas.SittingRoomFrontWindow, 3],
  [Areas.SittingRoomLateralWindow, 3],
  [Areas.DinningRoomWindow, 4],
  [Areas.DinningRoomDoor, 4],
  [Areas.LaundryWindow, 4],
  [Areas.LaundryDoor, 4],
  [Areas.LaundryBathroomWindow, 4],
  [Areas.MainBedroomWindow, 5],
  [Areas.LivingRoomWindow, 6],
  [Areas.LivingRoomBathroomWindow, 6],
  [Areas.RightBedroomWindow, 6],
  [Areas.LeftBedroomWindow, 6]
]);

export const AreaZonesMappings: Map<number, Array<string>> = new Map([
  [1, [Areas.MainDoor]],
  [2, [Areas.SittingRoomMovementSensor]],
  [3, [Areas.SittingRoomFrontWindow, Areas.SittingRoomLateralWindow]],
  [4,
    [
      Areas.DinningRoomWindow, Areas.DinningRoomDoor, Areas.LaundryWindow,
      Areas.LaundryDoor, Areas.LaundryBathroomWindow
    ]
  ],
  [5, [Areas.MainBedroomWindow]],
  [6,
    [
      Areas.LivingRoomWindow, Areas.LivingRoomBathroomWindow,
      Areas.RightBedroomWindow, Areas.LeftBedroomWindow
    ]
  ]
]);

export const AreaFloorMappings: Map<number, number> = new Map([
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 2],
  [6, 2]
]);
