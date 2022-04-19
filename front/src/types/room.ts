export type RoomID = number;
export type RoomName = string;
export type RoomUserCount = number;

export interface Room {
    id: number;
    name: RoomName,
    count: RoomUserCount
}

export type RoomList = Room[];