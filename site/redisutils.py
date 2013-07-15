import redis
import datetime

class RedisUtils:

    def __init__(self):
        self.db = redis.Redis(host='localhost', port=6379, db=0)
        try:
            self.db.ping()
        except:
            print 'redis not connected'

    def add_page_index(self, name):
        count = self.db.incr('page_count')
        self.db.zadd('rank', name, count)

    # kwargs should be title, type, template, date, preview
    def set_page(self, name, **kwargs):
        timestamp = datetime.datetime.now()
        for key in kwargs:
            self.db.hset(name, key, kwargs[key])
            if key == 'type':
                self.db.sadd(kwargs[key], name)
            else:
                self.db.sadd('other', name)
        self.db.hset(name, 'timestamp', timestamp)
        self.add_page_index(name)

    def get_page(self, name):
        page = self.db.hgetall(name)
        if not page:
            print 'page not found'
        return page

    def get_pages_bytype(self, type):
        pages = self.db.smembers(type)
        if not pages:
            print 'format type not found'
        return pages

    def get_pages_byrank(self, range):
        start, stop = range
        return self.db.zrange('rank', start, stop)


