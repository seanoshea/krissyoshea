import wsgiref.handlers

import webapp2
from google.appengine.ext.webapp import template
from google.appengine.ext import db

class MainHandler(webapp2.RequestHandler):

  def get(self):
    template_values = {
        'url': self.request.uri
    }
    self.response.out.write(template.render("index.html", template_values))

app = webapp2.WSGIApplication([('/', MainHandler)], debug=True)
