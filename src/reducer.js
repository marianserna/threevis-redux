export default function reducer(state = {}, action) {
  switch (action.type) {
    case 'SHOW_PROJECT':
      return {
        ...state,
        visible: true,
        positionX: action.positionX,
        positionY: action.positionY,
        projectKey: action.projectKey
      };
    case 'HIDE_PROJECT':
      return {
        ...state,
        visible: false
      };
    default:
      return state;
  }
}
