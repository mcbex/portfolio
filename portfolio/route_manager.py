from redisutils import Projects

class RouteManager:

    def __init__(self):
        self.redis = Projects()

    def get_project_byid(self, project_id):
        project = self.redis.get_project(project_id)
        if project and project['template']:
            return project
        else:
            return None

    def all_projects_bytype(self):
        types = self.redis.get_all_types()
        projects = {}
        for t in types:
            if t != 'article':
                projects[t] = self.redis.get_projects_bytype(t)
        return projects

    def get_n_projects(self, type, num=-1):
        return self.redis.get_projects(type, (0, num))

