from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import Publication, db, User, Media, Review, Favorite, Follower, CandidatePublication
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# ----------------- USERS CRUD ----------------------------

@api.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        required_fields = ['email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Required field: {field}'}), 400

        existing = User.query.filter_by(email=data['email']).first()
        if existing:
            return jsonify({'error': 'Email already exists'}), 409

        user = User(
            email=data['email'],
            password=generate_password_hash(data['password']),  # store hashed password
            role=data.get('role', 'user'),
            is_active=data.get('is_active', True)
        )

        db.session.add(user)
        db.session.commit()

        return jsonify(user.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'city' in data:
            user.city = data['city']
        if 'phone' in data:
            user.phone = data['phone']
        if 'profile_image' in data:
            user.profile_image = data['profile_image']

        if 'email' in data:
            if data['email'] != user.email:
                existing = User.query.filter_by(email=data['email']).first()
                if existing:
                    return jsonify({'error': 'Email already exists'}), 409
            user.email = data['email']

        if 'password' in data:
            user.password = generate_password_hash(data['password'])

        if 'role' in data:
            user.role = data['role']

        if 'is_active' in data:
            user.is_active = data['is_active']

        db.session.commit()
        return jsonify(user.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ----------------- PUBLICATIONS CRUD ----------------------------

@api.route('/publications', methods=['POST'])
def create_publication():
    try:
        data = request.get_json()

        required_fields = ['user_id', 'title', 'description', 'race', 'sex', 'species', 'age', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Required field: {field}'}), 400

        publication = Publication(
            user_id=data['user_id'],
            title=data['title'],
            description=data['description'],
            race=data['race'],
            sex=data['sex'],
            species=data['species'],
            age=data['age'],
            location=data['location'], 
        )

        db.session.add(publication)
        db.session.commit()

        return jsonify(publication.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/publications', methods=['GET'])
def get_publications():
    try:
        publications = Publication.query.all()
        return jsonify([pub.serialize() for pub in publications]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/publications/<int:publication_id>', methods=['GET'])
def get_publication(publication_id):
    try:
        publication = Publication.query.get_or_404(publication_id)
        return jsonify(publication.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@api.route('/publications/<int:publication_id>', methods=['PUT'])
def update_publication(publication_id):
    try:
        publication = Publication.query.get_or_404(publication_id)
        data = request.get_json()

        if 'title' in data:
            publication.title = data['title']
        if 'description' in data:
            publication.description = data['description']
        if 'race' in data:
            publication.race = data['race']
        if 'sex' in data:
            publication.sex = data['sex']
        if 'species' in data:
            publication.species = data['species']
        if 'age' in data:
            publication.age = data['age']
        if 'location' in data:
            publication.location = data['location']
        if 'adopted' in data:
            publication.adopted = data['adopted']
        if 'adopter_id' in data:
            publication.adopter_id = data['adopter_id']

        db.session.commit()
        return jsonify(publication.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/publications/<int:publication_id>', methods=['DELETE'])
def delete_publication(publication_id):
    try:
        publication = Publication.query.get_or_404(publication_id)
        db.session.delete(publication)
        db.session.commit()
        return jsonify({'message': 'Publication successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

        # ----------------- MEDIA CRUD ----------------------------

@api.route('/media', methods=['POST'])
def create_media():
    try:
        data = request.get_json()

        required_fields = ['url', 'file_type', 'publication_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Required field: {field}'}), 400

        media = Media(
            url=data['url'],
            file_type=data['file_type'],
            publication_id=data['publication_id']
        )

        db.session.add(media)
        db.session.commit()

        return jsonify(media.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/media', methods=['GET'])
def get_all_media():
    try:
        media_items = Media.query.all()
        return jsonify([media.serialize() for media in media_items]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/media/<int:media_id>', methods=['GET'])
def get_media(media_id):
    try:
        media = Media.query.get_or_404(media_id)
        return jsonify(media.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@api.route('/media/<int:media_id>', methods=['PUT'])
def update_media(media_id):
    try:
        media = Media.query.get_or_404(media_id)
        data = request.get_json()

        if 'url' in data:
            media.url = data['url']
        if 'file_type' in data:
            media.file_type = data['file_type']
        if 'publication_id' in data:
            media.publication_id = data['publication_id']

        db.session.commit()
        return jsonify(media.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/media/<int:media_id>', methods=['DELETE'])
def delete_media(media_id):
    try:
        media = Media.query.get_or_404(media_id)
        db.session.delete(media)
        db.session.commit()
        return jsonify({'message': 'Media successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
# --------------------------REVIEWS CRUD----------------------------

@api.route('/reviews', methods=['POST'])
def create_review():
    try:
        data = request.get_json()

        required_fields = ['user_id', 'publication_id', 'comment', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Required field: {field}'}), 400

        review = Review(
            user_id=data['user_id'],
            publication_id=data['publication_id'],
            comment=data['comment'],
            amount=data['amount']
        )

        db.session.add(review)
        db.session.commit()

        return jsonify(review.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/reviews', methods=['GET'])
def get_all_reviews():
    try:
        reviews = Review.query.all()
        return jsonify([review.serialize() for review in reviews]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/reviews/<int:review_id>', methods=['GET'])
def get_review(review_id):
    try:
        review = Review.query.get_or_404(review_id)
        return jsonify(review.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@api.route('/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    try:
        review = Review.query.get_or_404(review_id)
        data = request.get_json()

        if 'user_id' in data:
            review.user_id = data['user_id']
        if 'publication_id' in data:
            review.publication_id = data['publication_id']
        if 'comment' in data:
            review.comment = data['comment']
        if 'amount' in data:
            review.amount = data['amount']

        db.session.commit()
        return jsonify(review.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
@api.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    try:
        review = Review.query.get_or_404(review_id)
        db.session.delete(review)
        db.session.commit()
        return jsonify({'message': 'Review successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# --------------------------FAVORITE CRUD----------------------------

@api.route('/favorites', methods=['POST'])
def create_favorite():
    try:
        data = request.get_json()

        required_fields = ['user_id', 'publication_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Required field: {field}'}), 400

        favorite = Favorite(
            user_id=data['user_id'],
            publication_id=data['publication_id']
        )

        db.session.add(favorite)
        db.session.commit()

        return jsonify(favorite.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/favorites', methods=['GET'])
def get_all_favorites():
    try:
        favorites = Favorite.query.all()
        return jsonify([favorite.serialize() for favorite in favorites]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/favorites/<int:favorite_id>', methods=['GET'])
def get_favorite(favorite_id):
    try:
        favorite = Favorite.query.get_or_404(favorite_id)
        return jsonify(favorite.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@api.route('/favorites/<int:favorite_id>', methods=['PUT'])
def update_favorite(favorite_id):
    try:
        favorite = Favorite.query.get_or_404(favorite_id)
        data = request.get_json()

        if 'user_id' in data:
            favorite.user_id = data['user_id']
        if 'publication_id' in data:
            favorite.publication_id = data['publication_id']

        db.session.commit()
        return jsonify(favorite.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
def delete_favorite(favorite_id):
    try:
        favorite = Favorite.query.get_or_404(favorite_id)
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({'message': 'Favorite successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({'error': str(e)}), 500
# --------------------------FOLLOWER CRUD----------------------------
@api.route('/followers', methods=['GET'])
def get_all_followers():
    try:
        followers = Follower.query.all()
        return jsonify([f.serialize() for f in followers]), 200
    except Exception as e:
        print("Error fetching followers:", e)
        return jsonify({'error': str(e)}), 500


@api.route('/followers/<int:follower_id>', methods=['GET'])
def get_follower(follower_id):
    try:
        follower = Follower.query.get_or_404(follower_id)
        return jsonify(follower.serialize()), 200
    except Exception as e:
        print("Error fetching follower:", e)
        return jsonify({'error': str(e)}), 404


@api.route('/followers', methods=['POST'])
def create_follower():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        required_fields = ['follower_id', 'followed_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Required field: {field}'}), 400

        if not isinstance(data['follower_id'], int) or not isinstance(data['followed_id'], int):
            return jsonify({'error': 'IDs must be integers'}), 400

        if data['follower_id'] == data['followed_id']:
            return jsonify({'error': 'Cannot follow yourself'}), 400

        existing = Follower.query.filter_by(
            follower_id=data['follower_id'],
            followed_id=data['followed_id']
        ).first()
        if existing:
            return jsonify({'error': 'Already following'}), 400

        follower = Follower(
            follower_id=data['follower_id'],
            followed_id=data['followed_id']

        )
        db.session.add(follower)
        db.session.commit()

        return jsonify(follower.serialize()), 201

    except Exception as e:
        db.session.rollback()
        print("Error creating follower:", e)
        return jsonify({'error': 'Internal server error'}), 500

# Actualizar un follower
@api.route('/followers/<int:follower_id>', methods=['PUT'])
def update_follower(follower_id):
    try:
        follower = Follower.query.get_or_404(follower_id)
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        if 'follower_id' in data:
            follower.follower_id = data['follower_id']
        if 'followed_id' in data:
            follower.followed_id = data['followed_id']

        db.session.commit()
        return jsonify(follower.serialize()), 200

    except Exception as e:
        db.session.rollback()
        print("Error updating follower:", e)
        return jsonify({'error': 'Internal server error'}), 500


@api.route('/followers/<int:follower_id>', methods=['DELETE'])
def delete_follower(follower_id):
    try:
        follower = Follower.query.get(follower_id)
        if not follower:
            return jsonify({'error': 'Follower not found'}), 404

        db.session.delete(follower)
        db.session.commit()
        return jsonify({'message': 'Follower successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()
        print("Error deleting follower:", e)
        return jsonify({'error': 'Internal server error'}), 500

# --------------------------CANDIDATE PUBLICATION CRUD----------------------------
@api.route('/candidate_publications', methods=['GET'])
def get_all_candidate_publications():
    try:
        candidate_publications = CandidatePublication.query.all()
        return jsonify([cp.serialize() for cp in candidate_publications]), 200
    except Exception as e:
        print("Error fetching candidate publications:", e)
        return jsonify({'error': str(e)}), 500


@api.route('/candidate_publications/<int:candidate_publication_id>', methods=['GET'])
def get_candidate_publication(candidate_publication_id):
    try:
        candidate_publication = CandidatePublication.query.get_or_404(candidate_publication_id)
        return jsonify(candidate_publication.serialize()), 200
    except Exception as e:
        print("Error fetching candidate publication:", e)
        return jsonify({'error': str(e)}), 404


@api.route('/candidate_publications', methods=['POST'])
def create_candidate_publication():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        required_fields = ['publication_id', 'user_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Required field: {field}'}), 400

        if not isinstance(data['publication_id'], int) or not isinstance(data['user_id'], int):
            return jsonify({'error': 'IDs must be integers'}), 400

        if data['publication_id'] == data['user_id']:
            return jsonify({'error': 'Publication ID and User ID cannot be the same'}), 400
        existing = CandidatePublication.query.filter_by(
            publication_id=data['publication_id'],
            user_id=data['user_id']
        ).first()
        if existing:
            return jsonify({'error': 'Already following'}), 400

        candidate_publication = CandidatePublication(
            publication_id=data['publication_id'],
            user_id=data['user_id']
        )
        db.session.add(candidate_publication)
        db.session.commit()

        return jsonify(candidate_publication.serialize()), 201

    except Exception as e:
        db.session.rollback()
        print("Error creating candidate publication:", e)
        return jsonify({'error': 'Internal server error'}), 500

@api.route('/candidate_publications/<int:candidate_publication_id>', methods=['PUT'])
def update_candidate_publication(candidate_publication_id):
    try:
        candidate_publication = CandidatePublication.query.get_or_404(candidate_publication_id)
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        if 'publication_id' in data:
            candidate_publication.publication_id = data['publication_id']
        if 'user_id' in data:
            candidate_publication.user_id = data['user_id']

        db.session.commit()
        return jsonify(candidate_publication.serialize()), 200

    except Exception as e:
        db.session.rollback()
        print("Error updating candidate publication:", e)
        return jsonify({'error': 'Internal server error'}), 500


@api.route('/candidate_publications/<int:candidate_publication_id>', methods=['DELETE'])
def delete_candidate_publication(candidate_publication_id):
    try:
        candidate_publication = CandidatePublication.query.get(candidate_publication_id)
        if not candidate_publication:
            return jsonify({'error': 'Candidate publication not found'}), 404
        db.session.delete(candidate_publication)
        db.session.commit()
        return jsonify({'message': 'Candidate publication successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()
        print("Error deleting candidate publication:", e)
        return jsonify({'error': 'Internal server error'}), 500
