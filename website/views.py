from flask import Blueprint, render_template, flash, request, jsonify
from flask_login import login_required, current_user  
from .models import Note
from . import db
import json
from datetime import datetime


views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        note = request.form.get('note')
        remind_date = request.form.get('remind_date')
        remind_time = request.form.get('remind_time')
        remind_at = f"{remind_date} {remind_time}"if remind_date and remind_time else None
        interval = request.form.get('interval') 

        if len(note) < 1:
            flash('Note is too short!', category='error')
        elif remind_at is None:
            flash('The date or time is not decided.', category='error')
        elif  datetime.strptime(remind_at, "%Y-%m-%d %H:%M") < datetime.now():
            flash('Past dates cannot be selected.', category='error')
        else:
            new_note = Note(
                data=note, 
                user_id=current_user.id,
                remind_at=remind_at,
                interval=interval
             )
            
            db.session.add(new_note)
            db.session.commit()
            flash('Reminder added!', category='success')

    return render_template("home.html", user=current_user)

@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
    
    return jsonify({})

@views.route('/edit-note', methods=['POST'])
@login_required
def edit_note():
    data = json.loads(request.data)
    noteId = data['noteId']
    note = Note.query.get(noteId)
    if note and note.user_id == current_user.id:
        if data['data'] is not None:
            note.data = data['data']
        if data['remind_at'] is not None:
            note.remind_at = data['remind_at']
        db.session.commit()
        flash('Note updated!', category='success')

    return jsonify({})
