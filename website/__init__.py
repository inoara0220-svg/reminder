from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime 


db = SQLAlchemy()
DB_NAME = ("database.db")


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'asdjf;lasjdfj;la'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import User, Note
    
    create_database(app)    

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))
    

    from .notify import send_telegram
    from .models import Note
    
    def check_reminders():
         with app.app_context():
              now = datetime.now().strftime("%Y-%m-%d %H:%M")
              notes = Note.query.filter_by(remind_at=now, done=False).all()
              for note in notes:
                   send_telegram(f"Reminder: {note.data}")
                   note.done = True
              db.session.commit()

    scheduler = BackgroundScheduler()
    scheduler.add_job(check_reminders, 'interval', minutes=1)
    scheduler.start()



    return app 

def create_database(app):
        with app.app_context():
            db.create_all()
        print('Created Database!')