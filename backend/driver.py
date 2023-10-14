from flask import Flask, request, Response

app = Flask(__name)

def driver(next_handler):
    def drive(request):
        
        #before handling
        response = next_handler(request)

        #after handling
        return response

    return drive

# Register the middleware with the app
app.wsgi_app = drive(app.wsgi_app)

# Define your routes
@app.route('/')
def home():
    return "Hello, World!"

if __name__ == '__main__':
    app.run()