export class Floor {
  readonly name: string;
  readonly zones: ReadonlyArray<Zone>;

  constructor(name: string, zones: Array<Zone>) {
    this.name = name;
    this.zones = zones;
  }

  getOpenZonesCount(): number {
    return this.zones.filter(z => !z.isClosed).length;
  }

  getClosedZonesCount(): number {
    return this.zones.filter(z => z.isClosed).length;
  }
}

export class Zone {
  readonly name: string;
  readonly isClosed: boolean;

  constructor(name: string, isClosed: boolean) {
    this.name = name;
    this.isClosed = isClosed;
  }
}

export class GeneralSummary {
  readonly systemStatus: boolean;
  readonly sirenIsOn: boolean;

  constructor(systemStatus: boolean, sirenIsOn: boolean) {
    this.systemStatus = systemStatus;
    this.sirenIsOn = sirenIsOn;
  }
}
