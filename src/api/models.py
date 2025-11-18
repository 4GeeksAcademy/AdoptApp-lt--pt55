from __future__ import annotations
from flask_sqlalchemy import SQLAlchemy
from flask import request
from sqlalchemy import String, Boolean, ForeignKey, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
import enum
from werkzeug.security import generate_password_hash

db = SQLAlchemy()


class RoleEnum(enum.Enum):
    user = "user"
    admin = "admin"


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=True)
    last_name: Mapped[str] = mapped_column(String(50), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    password: Mapped[str] = mapped_column(nullable=False)
    profile_image: Mapped[str] = mapped_column(String(100), nullable=True)
    role: Mapped[RoleEnum] = mapped_column(
        Enum(RoleEnum), nullable=False, default=RoleEnum.user)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    publications: Mapped[list[Publication]] = relationship(
        "Publication", back_populates="user", foreign_keys="Publication.user_id")
    adoptions: Mapped[list[Publication]] = relationship(
        "Publication", back_populates="adopter", foreign_keys="Publication.adopter_id")
    followers: Mapped[list["Follower"]] = relationship(
        "Follower",
        foreign_keys="[Follower.followed_id]",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    following: Mapped[list["Follower"]] = relationship(
        "Follower",
        foreign_keys="[Follower.follower_id]",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "phone": self.phone,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "city": self.city,
            "profile_image": self.profile_image,
            "role": self.role.value if self.role else None,
            "is_active": self.is_active
        }


class Publication(db.Model):
    __tablename__ = "publication"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(260), nullable=False)
    race: Mapped[str] = mapped_column(String(100), nullable=False)
    sex: Mapped[str] = mapped_column(String(10), nullable=False)
    species: Mapped[str] = mapped_column(String(50), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    adopted: Mapped[bool] = mapped_column(Boolean, default=False)

    adopter_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=True)

    user: Mapped[User] = relationship(
        "User", back_populates="publications", foreign_keys=[user_id])
    adopter: Mapped[User] = relationship(
        "User", back_populates="adoptions", foreign_keys=[adopter_id])
    media: Mapped[list[Media]] = relationship(
        "Media", back_populates="publication")

    def serialize(self):
        return {
            "id": self.id,
            "author": self.user.serialize() if self.user else None,
            "title": self.title,
            "description": self.description,
            "race": self.race,
            "sex": self.sex,
            "species": self.species,
            "age": self.age,
            "location": self.location,
            "adopted": self.adopted,
            "media": [m.serialize() for m in self.media] if self.media else []
        }

    def serialize_preview(self):
        filename = None
        image_url = None

        if self.media and len(self.media) > 0:
            filename = self.media[0].url

        if filename:
            if filename.startswith("http"):
                image_url = filename
            elif filename.startswith("media/"):
                image_url = f"{request.host_url}{filename}"
            else:
                image_url = f"{request.host_url}media/{filename}"

        return {
            "id": self.id,
            "title": self.title,
            "description": self.description[:120] + "..." if self.description and len(self.description) > 120 else self.description,
            "species": self.species,
            "race": self.race,
            "sex": self.sex,
            "age": self.age,
            "location": self.location,
            "image_url": image_url
        }

class FileTypeEnum(enum.Enum):
    image = "image"
    video = "video"


class Media(db.Model):
    __tablename__ = "media"
    id: Mapped[int] = mapped_column(primary_key=True)
    publication_id: Mapped[int] = mapped_column(
        ForeignKey("publication.id"), nullable=False)
    file_type: Mapped[FileTypeEnum] = mapped_column(
        Enum(FileTypeEnum), nullable=False)
    url: Mapped[str] = mapped_column(String(260), nullable=False)

    publication: Mapped[Publication] = relationship(
        "Publication", back_populates="media")

    def serialize(self):
        return {
            "id": self.id,
            "publication_id": self.publication_id,
            "file_type": self.file_type.value,
            "url": self.url
        }


class Review(db.Model):
    __tablename__ = "review"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    publication_id: Mapped[int] = mapped_column(
        ForeignKey("publication.id"), nullable=False)
    comment: Mapped[str] = mapped_column(String(260), nullable=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=True)

    user: Mapped[User] = relationship("User")
    publication: Mapped[Publication] = relationship("Publication")

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.serialize() if self.user else None,
            "publication_id": self.publication_id,
            "comment": self.comment,
            "amount": self.amount
        }


class Favorite(db.Model):
    __tablename__ = "favorite"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    publication_id: Mapped[int] = mapped_column(
        ForeignKey("publication.id"), nullable=False)

    user = relationship("User", backref="favorites", lazy=True)
    publication = relationship("Publication", backref="favorites", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "publication_id": self.publication_id,
            "user": {
                "id": self.user.id,
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "email": self.user.email
            } if self.user else None,
            "publication": {
                "id": self.publication.id,
                "title": self.publication.title,
                "species": self.publication.species,
                "race": self.publication.race
            } if self.publication else None
        }


class Follower(db.Model):

    __tablename__ = "followers"
    id: Mapped[int] = mapped_column(primary_key=True)
    follower_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"))
    followed_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"))
    __table_args__ = (
        db.UniqueConstraint("follower_id", "followed_id",
                            name="unique_follower_pair"),
    )

    follower: Mapped["User"] = relationship(
        "User", foreign_keys=[follower_id], back_populates="following")
    followed: Mapped["User"] = relationship(
        "User", foreign_keys=[followed_id], back_populates="followers")

    def serialize(self):
        return {
            "id": self.id,
            "follower": self.follower.serialize() if self.follower else None,
            "followed": self.followed.serialize() if self.followed else None
        }


class CandidatePublication(db.Model):

    __tablename__ = "candidate_publication"

    id: Mapped[int] = mapped_column(primary_key=True)
    publication_id: Mapped[int] = mapped_column(
        ForeignKey("publication.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    __table_args__ = (
        db.UniqueConstraint("publication_id", "user_id",
                            name="unique_candidate_publication_pair"),
    )

    publication: Mapped["Publication"] = relationship(
        "Publication", foreign_keys=[publication_id])
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    def serialize(self):
        return {
            "id": self.id,
            "publication": self.publication.serialize() if self.publication else None,
            "user": self.user.serialize() if self.user else None
        }

class Admin(db.Model):
    __tablename__ = "admin"
    id: Mapped[int] = mapped_column(primary_key=True)
    firstname: Mapped[str] = mapped_column(String(50), nullable=False)
    lastname: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(500), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), default=True, nullable=False)

    @validates("password")
    def _hash_password(self, key, value):
        if value and not str(value).startswith(("pbkdf2:", "scrypt:")):
            return generate_password_hash(value)
        return value

    def serialize(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "is_active": self.is_active,
        }
