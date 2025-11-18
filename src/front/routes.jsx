// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

import backgroundImage from "./assets/img/AdoptApp.png";

// Import all your pages
import { Users } from "./pages/Users/Users";
import { AddUsers } from "./pages/Users/AddUsers";
import { EditUsers } from "./pages/Users/EditUsers";
import { ViewUsers } from "./pages/Users/ViewUsers";
import { DashboardUser } from "./pages/LoginUser/DashboardUser";
import { SignUpUser } from "./pages/LoginUser/SignUpUser";
import { LoginUser } from "./pages/LoginUser/LoginUser";

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

import { Admins } from "./pages/LoginAdmin/Admin";
import { DashboardAdmin } from "./pages/LoginAdmin/DashboardAdmin";
import { SignUpAdmin } from "./pages/LoginAdmin/SignUpAdmin";
import { LoginAdmin } from "./pages/LoginAdmin/LoginAdmin";
import { ViewAdmin } from "./pages/LoginAdmin/ViewAdmin";
import { EditAdmin } from "./pages/LoginAdmin/EditAdmin";

import { LandingPreviews } from "./pages/LandingPreviews";

// ✅ Define router here
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

      <Route path="/users" element={<Users />} />
      <Route path="/users/addUser" element={<AddUsers />} />
      <Route path="/users/edit/:userId" element={<EditUsers />} />
      <Route path="/users/view/:userId" element={<ViewUsers />} />
      <Route path="/user/login" element={<LoginUser />} />
      <Route path="/user/signup" element={<SignUpUser />} />
      <Route path="/users/dashboard" element={<DashboardUser />} />

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

      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/signup" element={<SignUpAdmin />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/list" element={<Admins />} />
      <Route path="/admin/view/:adminId" element={<ViewAdmin />} />
      <Route path="/admin/edit/:adminId" element={<EditAdmin />} />

      <Route path="/landing" element={<LandingPreviews />} />
    </Route>
  )
);
