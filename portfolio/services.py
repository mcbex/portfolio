from flask import abort, Blueprint, jsonify, make_response
from redisutils import Scraper

services = Blueprint('services', __name__)
response_headers = {
    'Content-Type': 'application/json'
}

# TODO consider storing error messages for various http codes in a dict

# so far ids = science2013
# TODO: write service that fetches all ids
@services.route('/scraper/<id>', methods=['GET'])
def return_scraped_data(id):
    scraper = Scraper()
    data = scraper.scraper_get_scrape(id)
    if data:
        try:
            data = jsonify({ id: data })
            response = make_response(data, 200)
            for header in response_headers:
                response.headers[header] = response_headers[header]
        except:
            message = { 'Error': 'Internal Server Error, data malformed' }
            response = make_response(jsonify(message), 500)
    else:
        message = { 'Error': 'Scraper ID not found' }
        response = make_response(jsonify(message), 404)
    return response
