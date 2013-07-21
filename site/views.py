from flask import render_template, abort
from portfolio import app
import route_manager

_manager = route_manager.RouteManager()

# route declarations
# load last 4 (or whatever) posts as child templates into home page
@app.route('/')
def load_index():
    projects = _manager.get_n_projects(4)
    # need to add 'no pages found'
    data = projects or {'test': { 'timestamp': 'today' }}
    return render_template('index.html', data=data)

@app.route('/projects/')
def load_projects():
    projects = _manager.all_projects_bytype()
    return render_template('projects.html', data=projects)

@app.route('/about/')
def load_about():
    return 'hello about'

@app.route('/project/<id>')
def load_page(id):
    project = _manager.get_project_byid(id)
    template = project['template']
    if template:
        return render_template(template, data=project)
    else:
        abort(404)

# error pages etc
@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

