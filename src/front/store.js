import { Admins } from "./pages/LoginAdmin/Admin";

export const initialStore=()=>{
  return{
    message: null,
    users: [],
    publications: [],
    media: [],
    reviews: [],
    favorites: [],
    followers: [],
    candidate_publications: [],
    Admin: []
  };
}
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload
      };
      /* USERS */
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
      /* PUBLICATIONS */
    
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
      /* MEDIA */
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


    case "SET_REVIEWS":
      return { ...store, reviews: action.payload };

    case "ADD_REVIEW":
      return { ...store, reviews: [...store.reviews, action.payload] };

    case "UPDATE_REVIEW":
      return {
        ...store,
        reviews: store.reviews.map((r) =>
          r.id === action.payload.id ? action.payload : r
        )
      };

    case "DELETE_REVIEW":
      return {
        ...store,
        reviews: store.reviews.filter((r) => r.id !== action.payload)
      };
     /* FAVORITES */
    case "SET_FAVORITES":
      return { ...store, favorites: action.payload };

    case "ADD_FAVORITE":
      return { ...store, favorites: [...store.favorites, action.payload] };

    case "UPDATE_FAVORITE":
      return {
        ...store,
        favorites: store.favorites.map((f) =>
          f.id === action.payload.id ? action.payload : f
        )
      };

    case "DELETE_FAVORITE":
      return {
        ...store,
        favorites: store.favorites.filter((f) => f.id !== action.payload)
      };
      /* FOLLOWERS */
    case "SET_FOLLOWERS":
      return { ...store, followers: action.payload };

    case "ADD_FOLLOWER":
      return { ...store, followers: [...store.followers, action.payload] };
    case "UPDATE_FOLLOWER":
      return {
        ...store,
        followers: store.followers.map((f) =>
          f.id === action.payload.id ? action.payload : f
        )
      };
       /* CANDIDATE PUBLICATIONS */
          case "SET_CANDIDATE_PUBLICATIONS":
      return { ...store, candidate_publications: action.payload };
    case "ADD_CANDIDATE_PUBLICATION":
      return { ...store, candidate_publications: [...store.candidate_publications, action.payload] };
    case "UPDATE_CANDIDATE_PUBLICATION":
      return {
        ...store,
        candidate_publications: store.candidate_publications.map((cp) =>
          cp.id === action.payload.id ? action.payload : cp
        )
      };

    case "DELETE_CANDIDATE_PUBLICATION":
      return {
        ...store,
        candidate_publications: store.candidate_publications.filter((cp) => cp.id !== action.payload)
      };
       /* ADMIN */
    case "SET_ADMIN":
      return { ...store, admins: action.payload };
    case "ADD_ADMIN":
      return { ...store, admins: [...store.admins, action.payload] };
    case "DELETE_ADMIN":
      return {
        ...store,
        admins: store.admins.filter((ad) => ad.id !== action.payload),
      };
    case "UPDATE_ADMIN":
      return {
        ...store,
        admins: store.admins.map((ad) =>
          ad.id === action.payload.id ? action.payload : ad
        ),
      };
    default:
      throw Error("Unknown action: " + action.type);
  }
}