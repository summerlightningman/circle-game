export type RoomName = string;
export type RoomUserCount = number;

export interface Room {
    name: RoomName,
    count: RoomUserCount
}

export type RoomList = Room[];