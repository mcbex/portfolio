import urllib2, re
from redisutils import Scraper

sites = {
    'java': 'http://www.java.com/en/',
    'windows7': 'http://windows.microsoft.com/en-us/windows7/products/home',
    'math': 'http://www.math.com/',
    'jquery': 'http://jquery.com/',
    'net': 'http://en.wikipedia.org/wiki/.NET_Framework',
    'science': 'http://www.sciencemag.org/',
    'javascript': 'http://www.w3schools.com/js/',
    'php': 'http://us.php.net/',
    'thesun': 'http://www.thesun.co.uk/sol/homepage/',
    'c++': 'http://en.wikipedia.org/wiki/C%2B%2B'
}
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36'
}
tag_counter = {}
scraper = Scraper()
opener = urllib2.build_opener()
urllib2.install_opener(opener)

def add_tags(key, tags):
    if not key in tag_counter:
        tag_counter[key] = {}
        tag_counter[key]['url'] = sites[key]
    for tag in tags:
        if not tag in tag_counter[key]:
            tag_counter[key][tag] = 1
        else:
            tag_counter[key][tag] += 1

for key, val in sites.iteritems():
    request = urllib2.Request(val, headers=headers)
    html = urllib2.urlopen(request).read()
    tags = re.findall("<([A-Za-z0-9]+){1}", html)
    add_tags(key, tags)

scraper.scraper_save_tagcount('science2013', tag_counter)
