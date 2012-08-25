import wsgiref.handlers

from google.appengine.ext import webapp
from google.appengine.ext import db

import logging

from django.utils import simplejson
from models import Portfolio
 
class ApiHandler(webapp.RequestHandler):
 
  def get(self):
    # check out the API request
    version = self.request.get('v')
    query = self.request.get('q')
    logging.info('Processing an API request version: %s query: %s', version, query)
    apiResponse = ''
    if query == 'portfolios':
        portfoliosQuery = Portfolio.all()
        portfolios = portfoliosQuery.count()
        if portfoliosQuery.count() != 0:
            apiResponse = simplejson.dumps([p.to_dict() for p in portfoliosQuery.run()])
        else :
            logging.info('There are no portfolios')
    else :
        # only portfolios available at this stage - should probably send back some kind of error here
        logging.info('Invalid API request')
    self.response.headers['Content-Type'] = 'application/json;charset=utf-8'
    self.response.out.write(apiResponse)
 
def main():
  application = webapp.WSGIApplication([('/.*', ApiHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)
 
if __name__ == '__main__':
  main()