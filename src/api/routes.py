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

@api.route('/users/favorites', methods=['GET'])
@jwt_required()
def handle_user_favorites():
    current_user_id = get_jwt_identity()
    user_favorites_query = User.query.get(current_user_id)
    if not user_favorites_query:
        return jsonify({"msg": "User not found"}), 404
    user_favorites = user_favorites_query.serialize()
    return jsonify(user_favorites), 200

@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
@jwt_required()
def handle_favorite_planet(planet_id):
    current_user_id = get_jwt_identity()
    planet = Planet.query.get(planet_id)
    if not planet:
        return jsonify({"msg": "Planet not found"}), 404
    user = User.query.get(current_user_id)
    if planet in user.favorite_planets:
        return jsonify({"msg": "Planet already in favorites"}), 400
    user.favorite_planets.append(planet)
    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route('/favorite/people/<int:people_id>', methods=['POST'])
@jwt_required()
def handle_favorite_people(people_id):
    current_user_id = get_jwt_identity()
    people = People.query.get(people_id)
    if not people:
        return jsonify({"msg": "Character not found"}), 404

    user = User.query.get(current_user_id)
    if people in user.favorite_people:
        return jsonify({"msg": "Character already in favorites"}), 400

    user.favorite_people.append(people)
    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route('/favorite/people/<int:people_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_people(people_id):
    current_user_id = get_jwt_identity()
    people = People.query.get(people_id)
    if not people:
        return jsonify({"msg": "Character not found"}), 404
    user = User.query.get(current_user_id)
    if people not in user.favorite_people:
        return jsonify({"msg": "Character not in favorites"}), 400
    user.favorite_people.remove(people)
    db.session.commit() 
    return jsonify(user.serialize()), 200

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_planet(planet_id):
    current_user_id = get_jwt_identity()
    planet = Planet.query.get(planet_id)
    if not planet:
        return jsonify({"msg": "Planet not found"}), 404
    user = User.query.get(current_user_id)
    if planet not in user.favorite_planets:
        return jsonify({"msg": "Planet not in favorites"}), 400
    user.favorite_planets.remove(planet)
    db.session.commit()
    return jsonify(user.serialize()), 200

@api.route('/users', methods=['POST'])
def create_user():
    user_data = request.get_json()
    if 'user_name' not in user_data or 'email' not in user_data or 'password' not in user_data:
        raise APIException('Faltan datos requeridos', status_code=400)
    user_name = user_data['user_name'] 
    email = user_data['email']
    password = user_data['password']
    if User.query.filter_by(user_name=user_name).first() is not None:
        raise APIException('El nombre de usuario ya está en uso', status_code=409)
    if User.query.filter_by(email=email).first() is not None:
        raise APIException('El correo electrónico ya está en uso', status_code=409)
    nuevo_usuario = User(
        user_name=user_name,
        email=email,
        password=password
    )
    try:
        db.session.add(nuevo_usuario)
        db.session.commit()
        return jsonify(nuevo_usuario.serialize()), 201
    except Exception as e:
        db.session.rollback()
        raise APIException(f'Error al crear usuario: {str(e)}', status_code=500)


@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        raise APIException("Correo electrónico y contraseña son requeridos", status_code=400)
    user_query = User.query.filter_by(email=email).first()
    if not user_query or user_query.password != password:
        raise APIException("Correo o contraseña inválidos", status_code=401)
    access_token = create_access_token(identity=user_query.id)
    return jsonify(access_token=access_token), 200