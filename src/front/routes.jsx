// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

import { Users } from "./pages/Users/Users";
import { AddUsers } from "./pages/Users/AddUsers";
import { EditUsers } from "./pages/Users/EditUsers";
import { ViewUsers } from "./pages/Users/ViewUsers";

import { Publications } from "./pages/Publications/Publications";
import { AddPublications } from "./pages/Publications/AddPublications";
import { EditPublications } from "./pages/Publications/EditPublications";
import { ViewPublications } from "./pages/Publications/ViewPublications";

import { Media } from "./pages/Media/Media";
import { AddMedia } from "./pages/Media/AddMedia";
import { EditMedia } from "./pages/Media/EditMedia";
import { ViewMedia } from "./pages/Media/ViewMedia";

import { Review } from "./pages/Review/Review";
import { AddReview } from "./pages/Review/AddReview";
import { EditReview } from "./pages/Review/EditReview";
import { ViewReview } from "./pages/Review/ViewReview";

import { Favorites } from "./pages/Favorites/Favorite";
import { AddFavorite } from "./pages/Favorites/AddFavorite";
import { EditFavorite } from "./pages/Favorites/EditFavorite";
import { ViewFavorite } from "./pages/Favorites/ViewFavorite";

import { Follower } from "./pages/Follower/Follower";
import { AddFollower } from "./pages/Follower/AddFollower";
import { EditFollower } from "./pages/Follower/EditFollower";
import { ViewFollower } from "./pages/Follower/ViewFollower";

import { CandidatePublication } from "./pages/CandidatePublication/CandidatePublication";
import { AddCandidatePublication } from "./pages/CandidatePublication/AddCandidatePublication";
import { EditCandidatePublication } from "./pages/CandidatePublication/EditCandidatePublication";
import { ViewCandidatePublication } from "./pages/CandidatePublication/ViewCandidatePublication";

// Create the router using createBrowserRouter and createRoutesFromElements

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path= "/" element={<Home />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />

        <Route path="/users" element={<Users />} />
        <Route path="/users/addUser" element={<AddUsers />} />
        <Route path="/users/edit/:userId" element={<EditUsers />} />
        <Route path="/users/view/:userId" element={<ViewUsers />} />

        <Route path="/publications" element={<Publications />} />
        <Route path="/publications/addPublication" element={<AddPublications />} />
        <Route path="/publications/edit/:publicationId" element={<EditPublications />} />
        <Route path="/publications/view/:publicationId" element={<ViewPublications />} />

        <Route path="/media" element={<Media />} />
        <Route path="/media/add" element={<AddMedia />} />
        <Route path="/media/edit/:mediaId" element={<EditMedia />} />
        <Route path="/media/view/:mediaId" element={<ViewMedia />} />

        <Route path="/reviews" element={<Review />} />
        <Route path="/reviews/add" element={<AddReview />} />
        <Route path="/reviews/edit/:reviewId" element={<EditReview />} />
        <Route path="/reviews/view/:reviewId" element={<ViewReview />} />

        <Route path="/favorites" element={<Favorites />} />
        <Route path="/favorites/add" element={<AddFavorite />} />
        <Route path="/favorites/edit/:favoriteId" element={<EditFavorite />} />
        <Route path="/favorites/view/:favoriteId" element={<ViewFavorite />} />

        <Route path="/followers" element={<Follower />} />
        <Route path="/followers/add" element={<AddFollower />} />
        <Route path="/followers/edit/:followerId" element={<EditFollower />} />
        <Route path="/followers/view/:followerId" element={<ViewFollower />} />

        <Route path="/candidate_publications" element={<CandidatePublication />} />
        <Route path="/candidate_publications/add" element={<AddCandidatePublication />} />
        <Route path="/candidate_publications/edit/:candidatePublicationId" element={<EditCandidatePublication />} />
        <Route path="/candidate_publications/view/:candidatePublicationId" element={<ViewCandidatePublication />} />

      {/* Close the Root Route */}
      </Route>
    )
);