import { Link } from "react-router-dom";

const HomeButtons = () => {
    return ( 
                        <div className="ml-auto mt-5 mb-5">
                    <Link to="/users">
                        <button className="btn btn-light me-2">Users</button>
                    </Link>
                    <Link to="/publications">
                        <button className="btn btn-light me-2">Publications</button>
                    </Link>
                    <Link to="/admin">
                        <button className="btn btn-light me-2">Admin</button>
                    </Link>
                    <Link to="/media">
                        <button className="btn btn-light me-2">Media</button>
                    </Link>
                    <Link to="/reviews">
                        <button className="btn btn-light me-2">Reviews</button>
                    </Link>
                    <Link to="/favorites">
                        <button className="btn btn-light me-2">Favorites</button>
                    </Link>
                    <Link to="/followers">
                        <button className="btn btn-light me-2">Followers</button>
                    </Link>
                    <Link to="/candidate_publications">
                        <button className="btn btn-light me-2">Candidate Publications</button>
                    </Link>
                </div>
    );
};

export default HomeButtons;