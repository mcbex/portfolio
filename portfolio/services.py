from flask import abort, Blueprint, jsonify, make_response
from redisutils import Scraper

services = Blueprint('services', __name__)
response_headers = {
    'Content-Type': 'application/json'
}

# so far ids = science2013
# TODO: write service that fetches all ids
@services.route('/scraper/<id>', methods=['GET'])
def return_scraped_data(id):
    try:
        data = jsonify({ id: data })
        response = make_response(data, 200)
        for header in response_headers:
            response.headers[header] = response_headers[header]
    except:
    scraper = Scraper()
    data = scraper.scraper_get_scrape(id)
        message = { 'Error': 'Scraper ID not found' }
        response = make_response(jsonify(message), 404)
    return response
