import wsgiref.handlers

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db

import logging

from models import Portfolio
 
class MainHandler(webapp.RequestHandler):
 
  def get(self):
    template_values = {
        'url': self.request.uri
    }
    self.response.out.write(template.render("index.html", template_values))
 
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

  application = webapp.WSGIApplication([('/.*', MainHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)
 
if __name__ == '__main__':
  main()