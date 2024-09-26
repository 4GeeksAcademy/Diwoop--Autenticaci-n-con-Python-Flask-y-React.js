from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

favorite_planets = db.Table(
    'favorite_planets',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('planet_id', db.Integer, db.ForeignKey('planet.id'), primary_key=True)
)

favorite_people = db.Table(
    'favorite_people',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('people_id', db.Integer, db.ForeignKey('people.id'), primary_key=True)
)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    user_name= db.Column(db.String(80), nullable=False, unique=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    favorite_planets = db.relationship('Planet', secondary=favorite_planets, backref=db.backref('favorited_by_users', lazy='dynamic'))
    favorite_people = db.relationship('People', secondary=favorite_people, backref=db.backref('favorited_by_users', lazy='dynamic'))
    def __repr__(self):
        return '<User %r>' % self.email
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "user_name": self.user_name,
            "is_active": self.is_active,
            "favorite_planets": list(map(lambda x: x.serialize(), self.favorite_planets))
        }
class People(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    birth_year = db.Column(db.String(250), nullable=False)
    gender = db.Column(db.String(250), nullable=False)
    height = db.Column(db.String(250), nullable=False)
    skin_color = db.Column(db.String(250), nullable=False)
    eye_color = db.Column(db.String(250), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    def __repr__(self):
        return '<People %r>' % self.name
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "birth_year": self.birth_year,
            "gender": self.gender,
            "height": self.height,
            "skin_color": self.skin_color,
            "eye_color": self.eye_color,
            "image_url": self.image_url,
        }
class Planet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    diameter = db.Column(db.String(250), nullable=False)
    climate = db.Column(db.String(250), nullable=False)
    population = db.Column(db.String(250), nullable=False)
    orbital_period = db.Column(db.String(250), nullable=False)
    rotation_period= db.Column(db.String(250), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    def __repr__(self):
        return '<Planet %r>' % self.name
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "diameter": self.diameter,
            "climate": self.climate,
            "population": self.population,
            "orbital_period": self.orbital_period,
            "rotation_period": self.rotation_period,
            "image_url": self.image_url,
        }