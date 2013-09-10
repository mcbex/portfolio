from flask import render_template, Blueprint

errorviews = Blueprint('errorviews', __name__)

@errorviews.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

