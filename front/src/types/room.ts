export type RoomID = string;
export type RoomName = string;
export type RoomUserCount = number;

export interface Room {
    id: RoomID;
    name: RoomName,
    count: RoomUserCount
}

export type RoomList = Room[];