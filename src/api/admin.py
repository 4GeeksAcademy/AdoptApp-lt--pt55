import os
from flask_admin import Admin as AdminApp
from flask_admin.contrib.sqla import ModelView
from .models import (
    db,
    User,
    Publication,
    Media,
    Review,
    Favorite,
    Follower,
    CandidatePublication,
    Admin as AdminModel  
)

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'

    admin = AdminApp(
        app,
        name='4Geeks Admin',
        template_mode='bootstrap3',
        url='/admin',            
        endpoint='flask_admin'   
    )

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Publication, db.session))
    admin.add_view(ModelView(Media, db.session))
    admin.add_view(ModelView(Review, db.session))
    admin.add_view(ModelView(Favorite, db.session))
    admin.add_view(ModelView(Follower, db.session))
    admin.add_view(ModelView(CandidatePublication, db.session))
    admin.add_view(ModelView(AdminModel, db.session))  

    # Ejemplo para agregar más modelos:
    # from .models import YourModel
    # admin.add_view(ModelView(YourModel, db.session))
