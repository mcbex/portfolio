from flask import render_template, abort, Blueprint
from route_manager import RouteManager

views = Blueprint('views', __name__)
manager = RouteManager()

# route declarations
# load last 4 (or whatever) posts as child templates into home page
@views.route('/')
def load_index():
    projects = manager.get_n_projects(4)
    # need to add 'no pages found'
    data = projects or {'test': { 'timestamp': 'today' }}
    return render_template('index.html', data=data)

@views.route('/projects/')
def load_projects():
    projects = manager.all_projects_bytype()
    return render_template('projects.html', data=projects)

@views.route('/about/')
def load_about():
    return 'hello about'

@views.route('/project/<id>')
def load_page(id):
    project = manager.get_project_byid(id)
    template = project['template']
    if template:
        return render_template(template, data=project)
    else:
        abort(404)

