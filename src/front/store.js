export const initialStore=()=>{
  return{
    message: null,
    users: [],
    publications: [],
    media: []
  };
}
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload
      };

    case "SET_USERS":
      return { ...store, users: action.payload };

    case "ADD_USER":
      return { ...store, users: [...store.users, action.payload] };

    case "UPDATE_USER":
      return {
        ...store,
        users: store.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        )
      };

    case "DELETE_USER":
      return {
        ...store,
        users: store.users.filter((u) => u.id !== action.payload)
      };

    
    case "SET_PUBLICATIONS":
      return { ...store, publications: action.payload };

    case "ADD_PUBLICATION":
      return { ...store, publications: [...store.publications, action.payload] };

    case "UPDATE_PUBLICATION":
      return {
        ...store,
        publications: store.publications.map((p) =>
          p.id === action.payload.id ? action.payload : p
        )
      };

    case "DELETE_PUBLICATION":
      return {
        ...store,
        publications: store.publications.filter((p) => p.id !== action.payload)
      };

    case "SET_MEDIA":
      return { ...store, media: action.payload };

    case "ADD_MEDIA":
      return { ...store, media: [...store.media, action.payload] };

    case "UPDATE_MEDIA":
      return {
        ...store,
        media: store.media.map((m) =>
          m.id === action.payload.id ? action.payload : m
        )
      };

    case "DELETE_MEDIA":
      return {
        ...store,
        media: store.media.filter((m) => m.id !== action.payload)
      };

    default:
      throw Error("Unknown action: " + action.type);
  }
}
