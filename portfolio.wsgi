activate_this = '/Users/ubeckmi/dev/www/portfolio/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import site
site.addsitedir('/Users/ubeckmi/dev/www/portfolio/lib/python2.7')

import sys
sys.path.insert(0, '/Users/ubeckmi/dev/www/portfolio/')
sys.stdout = sys.stderr

from portfolio import portfolio

application = portfolio.app
