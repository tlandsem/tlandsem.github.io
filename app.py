from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/cv')
def cv():
    return render_template('cv.html')

@app.route('/photos')
def photos():
    return render_template('photos.html')

@app.route('/forever')
def forever():
    return render_template('forever_living.html')

if __name__ == '__main__':
    app.run(debug=True)
