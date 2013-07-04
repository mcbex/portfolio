from flask import render_template
from portfolio import app


# route declarations
# load last 4 (or whatever) posts as child templates into home page
@app.route('/')
def load_index():
    return render_template('index.html')

# other routes here include /snippet, /demo, /article /<id> all child
# templates that go into a container.html type page

# other main routes could be /about and /all (all posts)


