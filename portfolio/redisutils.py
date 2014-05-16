import redis
import datetime


class RedisUtils:
    # set of utilitly functions for interacting with redis
    def __init__(self):
        """ connect to database """
        self.db = redis.Redis(host='localhost', port=6379, db=0)
        self.timestamp = datetime.datetime.now()
        self.indicies = {
            'project': 'projectrank',
            'article': 'articlerank'
        }
        try:
            self.db.ping()
        except:
            print 'redis not connected'

    def add_index(self, index, name):
        # TODO refactor the count for multiple indexes
        """ helper method to auto add new projects with the next index num """
        idx = self.indicies[index]
        count = self.db.incr('page_count')
        self.db.zadd(idx, name, count)

    def get_index_byrank(self, index, range):
        """ retrieves sorted sets that have ranks within a certain range.
        expects the set name and a tuple with the start(int) and stop(int)
        of the range """
        start, stop = range
        return self.db.zrange(self.indicies[index], start, stop)


class Projects(RedisUtils):
    # TODO make separate file
    # TODO: add tagging, add remove project
    # TODO ugh reconsider projects vs articles
    # TODO reverse chronological
    # TODO refactor and clean up so individual projects are not top level
    def set_project(self, name, **kwargs):
        """ adds a new project to the db. expects name(str), optional kwargs
            are: type, template(html file name), preview(image file name),
            title, description"""
        for key in kwargs:
            self.db.hset(name, key, kwargs[key])
        if 'type' in kwargs:
            type = kwargs['type']
            self.db.sadd(type, name)
            self.db.sadd('types', type)
            if type == 'article':
                self.add_index('article', name)
            else:
                self.add_index('project', name)
        else:
            if not self.db.hget(name, 'type'):
                self.db.sadd('types', 'other')
            self.add_index('project', name)
        if self.db.hget(name, 'timestamp'):
            self.db.hset(name, 'updated', self.timestamp)
        else:
            self.db.hset(name, 'timestamp', self.timestamp)

    def get_project(self, name):
        """ retrieves a project by name """
        project = self.db.hgetall(name)
        if not project:
            print 'project not found'
        project['name'] = name
        return project

    def get_projects(self, type='project', range=(0, -1)):
        """ convenienve method to get all projects sorted by rank """
        projects = self.get_index_byrank(type, range);
        data = []
        if projects and len(projects):
            for p in projects:
                data.append(self.get_project(p))
        return data

    def format_data(self, data):
        project_data = []
        for d in data:
            project = self.get_project(d)
            project['name'] = d
            project.pop('type', None)
            project_data.append(project)
        if not data:
            print 'format type not found'
        return project_data

    def get_projects_bytype(self, type):
        """ retrieves all projects by a given type """
        projects = self.db.smembers(type)
        return self.format_data(projects)

    # TODO get all names
    def get_all_types(self):
        """ lists all project types added to date """
        types = self.db.smembers('types')
        if not types:
            print 'no types found'
        return types

    def remove_prop(self, name, prop):
        """ remove a property completely from a project """
        self.db.hdel(name, prop)


class Scraper(RedisUtils):
    # stuff for d3 web scraper project
    # TODO: make separate file and rename
    # TODO add help text
    def scraper_save_tagcount(self, name, data):
        self.db.sadd('scrapers', name)
        self.db.hset('scrapetimes', name, self.timestamp)
        for key in data:
            self.db.sadd(name, key)
            self.db.hset('scrapeurls', name + ':' + key, data[key]['url'])
            for tag in data[key]:
                if tag != 'url':
                    self.db.hset(name + ':' + key, tag, data[key][tag])

    def scraper_normalize_tagcounts(self, tags):
        tagcounts = []
        for key, value in tags.iteritems():
            tag = {}
            tag['name'] = key
            tag['count'] = value
            tagcounts.append(tag)
        return tagcounts

    def scraper_get_scrape(self, scraper):
        data = []
        keys = self.db.smembers(scraper)
        for key in keys:
            scrape = {}
            scrape['topic'] = key
            scrape['url'] = self.db.hget('scrapeurls', scraper + ':' + key)
            timestamp = self.db.hget('scrapetimes', scraper)
            if timestamp:
                scrape['timestamp'] = timestamp
            tags = self.db.hgetall(scraper + ':' + key)
            scrape['tags'] = self.scraper_normalize_tagcounts(tags)
            data.append(scrape)
        return data

    def scraper_remove_scrape(self, scraper):
        keys = self.db.smembers(scraper)
        for key in keys:
            self.db.delete(scraper + ':' + key)
        self.db.srem('scrapers', scraper)
        self.db.hdel('scrapetimes', scraper)
        self.db.hdel('scrapeurls', scraper + ':' + key)
        self.db.delete(scraper)

    def scraper_getall(self):
        return self.db.smembers('scrapers')
