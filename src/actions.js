import axios from 'axios';

// const client_id =
//   'bf16f69d274f8b702a30dbce75523d721c02abc9553ef06176f8d7770686774e';

// const addBird = bird => {
//   return dispatch => {
//     axios
//       .get('https://api.unsplash.com/search/photos', {
//         params: {
//           client_id: client_id,
//           query: bird
//         }
//       })
//       .then(response => {
//         const firstImg = response.data.results[0];

//         dispatch({
//           type: 'ADD_BIRD',
//           bird: {
//             name: bird,
//             image_url: firstImg.urls.small
//           }
//         });
//       });
//   };
// };

export { addBird };
