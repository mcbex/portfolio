from redisutils import RedisUtils

class RouteManager:

    def __init__(self):
        self.redis = RedisUtils()

    def get_page_template(self, page_id):
        page = self.redis.get_page(page_id)
        if page and page['template']:
            return page['template']
        else:
            return None

    def get_n_pages(self, num_pages):
        range = (0, num_pages)
        pages = self.redis.get_pages_byrank(range)
        page_data = None
        if pages and len(pages):
            page_data = {}
            for p in pages:
                page_data[p] = self.redis.get_page(p)
        return page_data
    def all_projects_bytype(self):
        types = self.redis.get_all_types()
        projects = {}
        for t in types:
            projects[t] = self.redis.get_projects_bytype(t)
        return projects


