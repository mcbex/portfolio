import redis

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

    def set_page(self, name, **kwargs):
        for key in kwargs:
            self.db.hset(name, key, kwargs[key])
            if key == 'type':
                self.db.sadd(kwargs[key], name)
            else:
                self.db.sadd('other', name)
        self.add_page_index(name)

    def get_page(self, name):
        try:
            page = self.db.hgetall(name)
            return page
        except:
            print 'page not found'
            return None

    def get_pages_bytype(self, type):
        try:
            pages = self.db.smembers(type)
            return pages
        except:
            print 'format type not found'
            return None

    def get_pages_byrank(self, range):
        start, stop = range
        return self.db.zrange('rank', start, stop)


