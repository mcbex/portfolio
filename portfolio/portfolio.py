from flask import Flask
from services import services
from views import views
from errorviews import errorviews
from extensions.jinja2htmlcompress import HTMLCompress

app = Flask('portfolio')
app.jinja_env.add_extension(HTMLCompress)
app.register_blueprint(services, url_prefix='/services')
app.register_blueprint(views)
app.register_blueprint(errorviews)

if __name__ == '__main__':
    app.run(debug=True)
