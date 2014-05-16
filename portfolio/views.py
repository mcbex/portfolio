from flask import render_template, abort, Blueprint
from route_manager import RouteManager

views = Blueprint('views', __name__)
manager = RouteManager()

# route declarations
# load last 4 (or whatever) posts as child templates into home page
@views.route('/')
def load_index():
    projects = manager.get_n_projects('project', 4)
    articles = manager.get_n_projects('article', 2)
    # need to add 'no pages found'
    data = {
        'projects': projects,
        'articles': articles
    }
    return render_template('index.html', data=data)

@views.route('/projects/')
def load_projects():
    projects = manager.all_projects_bytype()
    return render_template('projects.html', data=projects)

@views.route('/articles/')
def load_articles():
    articles = manager.get_n_projects('article')
    return render_template('articles.html', data=articles)

# TODO come up with clear definitions for projects vs articles or other
# entities - clean up data and either make everything one type or
# abstract things in a more reasonable way
@views.route('/project/<id>')
def load_project(id):
    project = manager.get_project_byid(id)
    template = project['template']
    if template:
        return render_template(template, data=project)
    else:
        abort(404)

@views.route('/article/<id>')
def load_article(id):
    article = manager.get_project_byid(id)
    template = article['template']
    if template:
        return render_template(template, data=article)
    else:
        abort(404)
