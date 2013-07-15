from flask import render_template, abort
from portfolio import app
import route_manager

manager = route_manager.RouteManager()

# route declarations
# load last 4 (or whatever) posts as child templates into home page
@app.route('/')
def load_index():
    pages = manager.get_n_pages(4)
    # need to add 'no pages found'
    data = pages or {'test': { 'timestamp': 'today' }}
    return render_template('index.html', data=data)

@app.route('/projects/')
def load_projects():
    return 'hello projects'

@app.route('/about/')
def load_about():
    return 'hello about'

@app.route('/project/<id>')
def load_page(id):
    template = manager.get_page_template(id)
    if template:
        return render_template(template)
    else:
        abort(404)

# error pages etc
@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404
