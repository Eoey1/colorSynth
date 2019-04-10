from flask import Flask
from flask import render_template
from flask_assets import Environment, Bundle

app = Flask(__name__)
assets = Environment(app)

js = Bundle('js/sketch.js', 'js/keyboard.js', 'js/note.js', 'js/buttons.js',
            'js/controls.js', 'js/noisegen.js', 'js/oscilloscope.js', 'js/elektron.js',
            'js/neutron.js', 'js/sh101.js', 'js/highpass.js', 'js/circledial.js', 'js/sines.js',
            'js/squares.js', 'js/saws.js', 'js/triangles.js', 'js/onepoles.js', 'js/sequencer.js',
            filters='jsmin', output='gen/packed.js')

#assets.register('js_all', js)


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
