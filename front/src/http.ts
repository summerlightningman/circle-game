const URL = 'http://localhost:4000';

export const getRoomList = async () => fetch(URL + '/rooms')
    .then(resp => resp.json());