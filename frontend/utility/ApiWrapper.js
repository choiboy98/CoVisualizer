import axios from 'axios'
import { BACKEND_URL, MONGO_URL } from './ApiConfig'

export const login = (net_id) => {
    let data = new FormData()
    data.append('net_id', net_id)
    return axios
      .post(BACKEND_URL + '/create_person', data)
      .then(response => {
        return {
          type: 'LOGIN_SUCCESSFUL',
          response
        }
      })
      .catch(error => {
        return {
          type: 'LOGIN_FAIL',
          error
        }
      })
  }
  
export const createUser = (net_id, name, email, phone, infected) => {
  let data = new FormData()
  data.append('net_id', net_id)
  data.append('name', name)
  data.append('email', email)
  data.append('phone', phone)
  data.append('infected', infected)
  return axios
    .post(BACKEND_URL + '/person', data)
    .then(response => {
      return {
        type: 'CREATE_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'CREATE_FAIL',
        error
      }
    })
}

export const updateUser = (net_id, infected) => {
  let data = new FormData()
  data.append('infected', infected)
  return axios
    .put(BACKEND_URL + '/person/' + net_id, data)
    .then(response => {
      return {
        type: 'UPDATE_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'UPDATE_FAIL',
        error
      }
    })
}

export const getLocation = (id, coordinates, net_id) => {
  let data = new FormData()
  data.append('id', id)
  data.append('coordinates', coordinates)
  data.append('net_id', net_id)
  return axios
    .post(BACKEND_URL + '/get_location', data)
    .then(response => {
      return {
        type: 'GET_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'GET_FAIL',
        error
      }
    })
}

export const updateLocation = (coordinates, risk) => {
  let data = new FormData()
  data.append('risk', risk)
  return axios
    .put(BACKEND_URL + '/location/' + coordinates, data)
    .then(response => {
      return {
        type: 'UPDATE_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'UPDATE_FAIL',
        error
      }
    })
}

export const createLocation = (coordinates, net_id, risk, location_name, time_spent) => {
  let data = new FormData()
  data.append('coordinates', coordinates)
  data.append('net_id', net_id)
  data.append('risk', risk)
  data.append('location_name', location_name)
  data.append('time_spent', time_spent)
  return axios
    .post(BACKEND_URL + '/location', data)
    .then(response => {
      return {
        type: 'CREATE_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'CREATE_FAIL',
        error
      }
    })
}

export const deleteLocation = (coordinates, net_id) => {
  let data = new FormData()
  data.append('coordinates', coordinates)
  return axios
    .delete(BACKEND_URL + '/location/' + net_id, data)
    .then(response => {
      return {
        type: 'DELETE_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'DELETE_FAIL',
        error
      }
    })
}

// Can either get tag using tagId or path
// if given path: gets all tags related to the path
// if given tagId: gets the tag with that id
export const getTag = (tagId, path) => {
  let data = {}
  let url = MONGO_URL + 'tags/'
  if (tagId) {
    url = url + tagId;
  } else if (path) {
    data['where'] = "{ \"path\" : \"" + path + "\" }";
  }
  test = JSON.stringify(data);
  console.log(test);
  return axios
    .get(url, "\"" + test + "\"")
    .then(response => {
      data = response.data.data;
      return {
        type: 'GET_TAG_SUCCESSFUL',
        data
      }
    })
    .catch(error => {
      return {
        type: 'GET_TAG_FAIL',
        error
      }
    })
}

// create a tag given the following parameters
// locName is optional and can be set to null
export const createTag = (path, locName, description) => {
  let data = {  
                "path" : path,
                "locName" : locName,
                "description" : description
              }
  return axios
    .post(MONGO_URL + 'tags', data)
    .then(response => {
      return {
        type: 'CREATE_TAG_SUCCESSFUL',
        response
      }
    })
    .catch(error => {
      return {
        type: 'CREATE_TAG_FAIL',
        error
      }
    })
}

// export const deleteTag = (id, path) => {
//   let data = new FormData()
//   data.append('coordinates', coordinates)
//   return axios
//     .delete(BACKEND_URL + '/location/' + net_id, data)
//     .then(response => {
//       return {
//         type: 'DELETE_SUCCESSFUL',
//         response
//       }
//     })
//     .catch(error => {
//       return {
//         type: 'DELETE_FAIL',
//         error
//       }
//     });
// }