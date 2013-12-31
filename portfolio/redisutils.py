import redis
import datetime


class RedisUtils:
    # set of utilitly functions for interacting with redis
    def __init__(self):
        """ connect to database """
        self.db = redis.Redis(host='localhost', port=6379, db=0)
        self.timestamp = datetime.datetime.now()
        try:
            self.db.ping()
        except:
            print 'redis not connected'


class Projects(RedisUtils):
    # TODO make separate file
    def add_project_index(self, name):
        """ helper method to auto add new projects with the next index num """
        count = self.db.incr('page_count')
        self.db.zadd('rank', name, count)

    # TODO: add tagging, add remove project
    def set_project(self, name, **kwargs):
        """ adds a new project to the db. expects name(str), optional kwargs 
            are: type, template(html file name), preview(image file name),
            title """
        for key in kwargs:
            self.db.hset(name, key, kwargs[key])
            if key == 'type':
                self.db.sadd(kwargs[key], name)
                self.db.sadd('types', kwargs[key])
        if not kwargs['type']:
            if not self.db.hget(name, 'type'):
                self.db.sadd('types', 'other')
        self.db.hset(name, 'timestamp', self.timestamp)
        self.add_project_index(name)

    def get_project(self, name):
        """ retrieves a project by name """
        project = self.db.hgetall(name)
        if not project:
            print 'project not found'
        return project

    def get_projects_bytype(self, type):
        """ retrieves all projects by a given type """
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
        """ lists all project types added to date """
        types = self.db.smembers('types')
        if not types:
            print 'no types found'
        return types

    def get_projects_byrank(self, range):
        """ retrieves projects that have ranks within a certain range. expects
        a tuple with the start(int) and stop(int) of the range """
        start, stop = range
        return self.db.zrange('rank', start, stop)


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
