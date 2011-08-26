import wsgiref.handlers
from google.appengine.ext import webapp
 
from google.appengine.ext.webapp import template
 
class MainHandler(webapp.RequestHandler):
 
  def get(self):
    template_values = {
        'url': self.request.uri
    }
    self.response.out.write(template.render("index.html", template_values))
 
def main():
  application = webapp.WSGIApplication([('/.*', MainHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)
 
if __name__ == '__main__':
  main()