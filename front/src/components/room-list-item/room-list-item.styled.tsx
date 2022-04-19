import styled from 'styled-components';

const RoomListItemStyled = styled.li`
  list-style-type: none;
  width: 100%;
  height: 60px;
  box-shadow: 0 0 5px rgba(0, 0, 0, .5);
  border-radius: 10px;

  padding: 15px;

  margin-bottom: 15px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  cursor: pointer;

  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, .75);
  }
  
  &:active {
    box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  }
`;

export default RoomListItemStyled