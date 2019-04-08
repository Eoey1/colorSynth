from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/home')
def home():
    return 'Home page'

@app.route('/')
def instructions():
    return render_template('manual.html')

@app.route('/play')
def playing():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=8000)
