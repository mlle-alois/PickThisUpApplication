import {UserModel} from "./user.model";
import {StatusModel} from "./status.model";

export interface IZoneProps {
  zoneId: number;
  zoneStreet: string;
  zoneZipcode: string;
  zoneCity: string;
  zoneDescription: string;
  signalman: number;
  status: number;
}

export class ZoneModel implements IZoneProps {
  zoneId: number;
  zoneStreet: string;
  zoneZipcode: string;
  zoneCity: string;
  zoneDescription: string;
  signalman: number;
  status: number;

  constructor(properties: IZoneProps) {
    this.zoneId = properties.zoneId;
    this.zoneStreet = properties.zoneStreet;
    this.zoneZipcode = properties.zoneZipcode;
    this.zoneCity = properties.zoneCity;
    this.zoneDescription = properties.zoneDescription;
    this.signalman = properties.signalman;
    this.status = properties.status;
  }
}
