export type PlayerID = string;
export type PlayerName = string;
export type PlayerColor = string;
export type PlayerRadius = number;

export type Coord = number;

export interface Player {
    id: PlayerID,
    name: PlayerName,
    color: PlayerColor,
    radius: PlayerRadius;
    x: Coord,
    y: Coord,
    activeKeys: {
        up: boolean,
        down: boolean,
        left: boolean,
        right: boolean
    }
}

export type PlayerList = Player[]