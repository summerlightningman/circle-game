const App = require('../app');

describe('AppTest function works', () => {
    test('roomListSearching works correctly', () => {
        App.roomList = {
            'gdfgdv': {name: 'First', players: [{id: 1}, {id: 2}]},
            '23rfds': {name: 'Second', players: [{id: 3}, {id: 4}, {id: 5}]},
            'bvssd': {name: 'Third', players: [{id: 6}]}
        }

        expect(App.findRoomIdByPlayerId(1)).toBe('gdfgdv');
        expect(App.findRoomIdByPlayerId(2)).toBe('gdfgdv');
        expect(App.findRoomIdByPlayerId(3)).toBe('23rfds');
        expect(App.findRoomIdByPlayerId(4)).toBe('23rfds');
        expect(App.findRoomIdByPlayerId(5)).toBe('23rfds');
        expect(App.findRoomIdByPlayerId(6)).toBe('bvssd');
    })
})