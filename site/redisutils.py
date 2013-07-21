import redis
import datetime

class RedisUtils:

    def __init__(self):
        self.db = redis.Redis(host='localhost', port=6379, db=0)
        try:
            self.db.ping()
        except:
            print 'redis not connected'

    def add_project_index(self, name):
        count = self.db.incr('page_count')
        self.db.zadd('rank', name, count)

    # kwargs should be title, type, template, date, preview
    def set_project(self, name, **kwargs):
        timestamp = datetime.datetime.now()
        for key in kwargs:
            self.db.hset(name, key, kwargs[key])
            if key == 'type':
                self.db.sadd(kwargs[key], name)
                self.db.sadd('types', kwargs[key])
        if not kwargs['type']:
            self.db.sadd('types', 'other')
        self.db.hset(name, 'timestamp', timestamp)
        self.add_project_index(name)

    def get_project(self, name):
        project = self.db.hgetall(name)
        if not project:
            print 'project not found'
        return project

    def get_projects_bytype(self, type):
        projects = self.db.smembers(type)
        project_data = []
        for p in projects:
            project = self.get_project(p)
            project['name'] = p
            project.pop('type', None)
            project_data.append(project)
        if not projects:
            print 'format type not found'
        return project_data

    def get_all_types(self):
        types = self.db.smembers('types')
        if not types:
            print 'no types found'
        return types

    def get_projects_byrank(self, range):
        start, stop = range
        return self.db.zrange('rank', start, stop)


