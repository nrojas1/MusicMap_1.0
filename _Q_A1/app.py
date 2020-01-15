import os
from flask import Flask, render_template, jsonify, request, send_from_directory
import psycopg2 as psql
from datetime import date

app = Flask(__name__)
db = psql.connect("dbname=geovis2 user=postgres password=uuuu")

@app.route('/')
def index():
    return render_template('start.html')

@app.route('/srch')
def dashboard():
    return render_template('child.html')

@app.route('/concert')
def concert():
    return render_template('frm_concert.html')

@app.route('/rec')
def rec():
    return render_template('frm_rec.html')

@app.route('/event')
def event():
    return render_template('frm_event.html')

@app.route('/project')
def project():
    return render_template('frm_project.html')

@app.route('/form', methods = ['POST', 'GET'])
def db_update():
    results = request.form.to_dict(flat=False)
    point = results['latitude'], results['longitude']
    pt = 'POINT'+str(point)
    pt = pt.replace(',','')
    d = '%s,%s,%s'%(results['Name'] , results['date'], pt)
    d = d.replace('[','')
    d = d.replace(']','')
    d = d.replace('"','')
    d = d.replace("'",'')
    d = d.split(',')
    c = db.cursor()

    c.execute("""
        INSERT INTO evenements
        (nom, date, pt)
        VALUES
        (%s, %s, %s);
    """, (d[0], d[1], d[2],))

    c.close()
    db.commit()
    #return render_template('form.html', results = results, d=d)
    return render_template('child_list.html')

@app.route('/liste')
def evenements():
    c = db.cursor()
    c.execute("""
        SELECT *
        FROM evenements
    """)
    rows = [{
        'nom': l[0], 'x': l[1], 'y': l[2], 'pt':l[3]
    } for l in c]
    c.close()
    return render_template('child_list.html',
        evenements=rows)

@app.route('/cabanes.json')
def cabanes_json():
    c = db.cursor()
    c.execute("""
        SELECT
         nom,
         ST_X(ST_Transform(pt,4326))::integer,
         ST_Y(ST_Transform(pt,4326))::integer
        FROM cabanes
    """)
    rows = [{
        'nom': l[0], 'x': l[1], 'y': l[2]
    } for l in c]
    c.close()
    return jsonify(rows)

@app.route('/evenements.json')
def evenements_json():
    c = db.cursor()
    c.execute("""
        SELECT
         id,
         nom,
         date,
         ST_X(st_pointfromtext(pt, 3857)),
         ST_Y(st_pointfromtext(pt, 3857))
        FROM evenements
        ORDER BY id DESC;

    """)
    rows = [{
        'id': l[0], 'nom': l[1], 'date': l[2], 'x': l[4], 'y': l[3]
    } for l in c]
    c.close()
    return jsonify(rows)

# @app.route('/favicon.ico')
# def favicon():
#     return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


if __name__ == '__main__':
    app.run(debug=True)
