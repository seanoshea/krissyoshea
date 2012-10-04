import wsgiref.handlers

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db

import logging

from django.utils import simplejson
from models import Portfolio
 
class MainHandler(webapp.RequestHandler):
 
  def get(self):
    template_values = {
        'url': self.request.uri
    }
    self.response.out.write(template.render("index.html", template_values))

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
            apiResponse = self.generateError('There are no portfolios')
    else :
        # only portfolios available at this stage - should probably send back some kind of error here
        apiResponse = self.generateError('Invalid API request')
    self.response.headers['Content-Type'] = 'application/json;charset=utf-8'
    self.response.out.write(apiResponse)
    
  def generateError(self, error):
      # TODO - write this error to the response stream.
      logging.info(error)
      return error

def main():

  # not sure if this is the best place to put the portfolio initialization logic - seems to work fine though
  query = Portfolio.all()
  portfolios = query.count()
  if portfolios == 0:
      # time to put the portfolios in the data store
      logging.info('Creating the Portfolios')
      foodPortfolio = Portfolio(name="Food",numberOfImages=10,startIndex=0, orderIndex=0);
      propsPortfolio = Portfolio(name="Props",numberOfImages=28,startIndex=0, orderIndex=1);
      flowersPortfolio = Portfolio(name="Flowers",numberOfImages=13,startIndex=0, orderIndex=2);
      interiorsPortfolio = Portfolio(name="Interiors",numberOfImages=3,startIndex=0, orderIndex=3);
      foodPortfolio.put()
      propsPortfolio.put()
      flowersPortfolio.put()
      interiorsPortfolio.put()
  else:
      # keep deleting the portfolios every second time the user visits the page for now.
      # completely unnecessary control flow, but it's just a handy way of clearning out the portfolios for now.
      logging.info('Deleting the Portfolios')
      db.delete(query.run())

  # check to see whether the request is trying to hit the api or not
  application = webapp.WSGIApplication([('/', MainHandler), ('/api', ApiHandler)], debug=True)
  wsgiref.handlers.CGIHandler().run(application)
 
if __name__ == '__main__':
  main()