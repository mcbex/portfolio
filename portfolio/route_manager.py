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
            projects[t] = self.redis.get_projects_bytype(t)
        return projects

    def get_n_projects(self, num_projects):
        range = (0, num_projects)
        projects = self.redis.get_projects_byrank(range)
        project_data = None
        if projects and len(projects):
            project_data = []
            for p in projects:
                project_data.append(self.redis.get_project(p))
        return project_data

