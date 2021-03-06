from flask import abort, Blueprint, jsonify, make_response
from redisutils import Scraper
import backgrounds

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
        except Exception as e:
            message = { 'Error': 'Internal Server Error, ' + str(e) }
            response = make_response(jsonify(message), 500)
    else:
        message = { 'Error': 'Scraper ID not found' }
        response = make_response(jsonify(message), 404)
    return response

# TODO consider whether to pass args in route
@services.route('/backgrounds/squares/<int:size>/<int:height>', methods=['GET'])
def return_squares(size, height):
    rows = height / size
    data = backgrounds.squares(size, rows)
    if data:
        try:
            data = jsonify({ 'background': data })
            response = make_response(data, 200)
            for header in response_headers:
                response.headers[header] = response_headers[header]
        except Exception as e:
            message = { 'Error': 'Internal Server Error, ' + str(e) }
            response = make_response(jsonify(message), 500)
    else:
        message = { 'Error': 'No background generated' }
        response = make_response(jsonify(message), 500)
    return response

@services.route('/test/<message>', methods=['GET'])
def return_message(message):
    try:
        output = { 'message': message }
        response = make_response(jsonify(output), 200)
    except:
        output = { 'Error': 'Internal Server Error' }
        response = make_response(jsonify(output), 500)
    return response
