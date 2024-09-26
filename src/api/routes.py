from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, People, Planet
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/users', methods=['GET'])
def handle_users():
    users_query = User.query.all()
    all_users = list(map(lambda x: x.serialize(), users_query))

    return jsonify(all_users), 200

@api.route('/users/favorites/', methods=['GET'])
@jwt_required()
def handle_user_favorites(current_user_id):
    current_user_id = get_jwt_identity()
    user_favorites_query = User.query.get(current_user_id)
    user_favorites = user_favorites_query.serialize()

    return jsonify(user_favorites), 200
@api.route('/planets', methods=['GET'])
def handle_planets():
    planets_query = Planet.query.all()
    all_planets = list(map(lambda x: x.serialize(), planets_query))

    return jsonify(all_planets), 200

@api.route('/planets/<int:planet_id>', methods=['GET'])
def handle_specific_planet(planet_id):
    planet_query = Planet.query.get(planet_id)
    specific_user = planet_query.serialize()

    return jsonify(specific_user), 200

@api.route('/people', methods=['GET'])
def handle_people():
    people_query = People.query.all()
    all_people = list(map(lambda x: x.serialize(), people_query))

    return jsonify(all_people), 200

@api.route('/people/<int:people_id>', methods=['GET'])
def handle_specific_people(people_id):
    specific_people_query = specific_people.query.get(people_id)
    specific_people = specific_people_query.serialize()

    return jsonify(specific_people), 200

@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
@jwt_required()
def handle_favorite_planet(planet_id, current_user_id):
    current_user_id = get_jwt_identity()
    favorite_planet_query = Planet.query.get(planet_id)
    user_query = User.query.get(current_user_id)
    user_query.favorite_planets.append(favorite_planet_query)
    print("planet fav añadido")

    return jsonify(user_query.serialize()), 200

@api.route('/favorite/people/<int:people_id>', methods=['POST'])
@jwt_required()
def handle_favorite_people(people_id):
    current_user_id = get_jwt_identity()
    favorite_people_query = People.query.get(people_id)
    user_query = User.query.get(current_user_id)
    user_query.favorite_peoples.append(favorite_people_query)
    print("personaje fav añadido")

    return jsonify(user_query.serialize()), 200

@api.route('/favorite/people/<int:people_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_people(people_id, ):
    current_user_id = get_jwt_identity()
    favorite_people_query = People.query.get(people_id)
    user_query = User.query.get(current_user_id)
    user_query.favorite_peoples.remove(favorite_people_query)
    print("personaje favorito eliminado")

    return jsonify(user_query.serialize()), 200

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_planet(planet_id, current_user_id):
    current_user_id = get_jwt_identity()
    favorite_planet_query = Planet.query.get(planet_id)
    user_query = User.query.get(current_user_id)
    user_query.favorite_planets.remove(favorite_planet_query)
    print("planeta favorito eliminado")

    return jsonify(user_query.serialize()), 200

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    print("\n\n\n")
    print(email)
    print(password)

    if email is None or password is None:
        return jsonify({"msg": "Bad username or password"}), 401

    user_query = User.query.filter_by(email=email)
    user = user_query.first()
    print(user)

    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401
    if user.email != email or user.password != password:
        return jsonify({"msg": "Bad username or password"}), 401

    print("\n\n\n")
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token)

@api.route("/current-user", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    print(current_user_id)

    if current_user_id is None:
        return jsonify({"msg": "User not found"}), 401
    
    user_query = User.query.get(current_user_id)
    print(user_query)

    if user_query is None:
        return jsonify({"msg": "User not found"}), 401

    user = user_query.serialize()
    return jsonify(current_user=user), 200

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    api.run(host='0.0.0.0', port=PORT, debug=False)