const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const pool = require('./configuration/config')
const cors = require('cors')
const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//get all points
const getPoints = (req,res) => {
    pool.query(`SELECT row_to_json(fc) AS geojson FROM 
    (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f))
    As features FROM 
    (SELECT 
    'Feature' As type, 
    ST_AsGeoJSON(ST_Transform(ST_FlipCoordinates(lg.geom), 4326),15,0)::json As geometry,
    row_to_json((id, name)) As properties
    FROM POINT As lg) As f ) As fc`, (error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json({
            points: results.rows[0].geojson,
        });
    });
};

//get point by id
const getPointsById = (req,res) => {
    const reqId = parseInt(req.params.id);
    pool.query("SELECT * FROM POINT WHERE id = $1", [reqId], (error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json({
            status:"success",
            requestTime: req.requestTime,
            data: results.rows,
        });
    });
};

//create point
const newPoint = (req,res) => {
    const {properties, geometry} = req.body;
    const geom = JSON.stringify(geometry)
    pool.query(
        `INSERT INTO POINT (name, geom) VALUES ('${properties.name}', ST_GeomFromGeoJSON('${geom}'))`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(201).send('New point added');
        }
    );
};

//update point
const updatePoint = (req,res) => {
    const reqId = parseInt(req.params.id);
    const {properties, geometry} = req.body;
    const geom = JSON.stringify(geometry)
    pool.query(
        `UPDATE POINT SET name='${properties.name}', geom = ST_GeomFromGeoJSON('${geom}') WHERE id=${reqId}`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(200).send(`Point modified with ID: ${reqId}`);
        }
    );
};

//delete point
const deletePoint = (req,res) => {
    const reqId = parseInt(req.params.id);
    pool.query(
        `DELETE FROM POINT WHERE id=${reqId}`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(200).send(`Point deleted with ID: ${reqId}`);
        }
    );
};

//get all lines
const getLines = (req,res) => {
    pool.query(`SELECT row_to_json(fc) AS geojson FROM 
    (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f))
    As features FROM 
    (SELECT 
    'Feature' As type, 
    ST_AsGeoJSON(ST_Transform(ST_FlipCoordinates(lg.geom), 4326),15,0)::json As geometry,
    row_to_json((id, name, length, description)) As properties
    FROM LINE As lg) As f ) As fc`, (error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json({
            lines: results.rows[0].geojson,
        });
    });
};

//get line by id
const getLinesById = (req,res) => {
    const reqId = parseInt(req.params.id);
    pool.query("SELECT * FROM LINE WHERE id = $1", [reqId], (error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json({
            data: results.rows,
        });
    });
};

//create line
const newLine = (req,res) => {
    const {properties, geometry} = req.body;
    const geom = JSON.stringify(geometry)
    pool.query(
        `INSERT INTO LINE (name, geom, description) VALUES ('${properties.name}', ST_GeomFromGeoJSON('${geom}'), '${properties.description}')`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(201).send('New line added');
        }
    );
};

//update line
const updateLine = (req,res) => {
    const reqId = parseInt(req.params.id);
    const {properties, geometry} = req.body;
    const geom = JSON.stringify(geometry);
    pool.query(
        `UPDATE LINE SET name='${properties.name}', geom = ST_GeomFromGeoJSON('${geom}'), description='${properties.description}' WHERE id=${reqId}`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(200).send(`Line modified with ID: ${reqId}`);
        }
    );
};

//delete line
const deleteLine = (req,res) => {
    const reqId = parseInt(req.params.id);
    pool.query(
        `DELETE FROM LINE WHERE id=${reqId}`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(200).send(`Line deleted with ID: ${reqId}`);
        }
    );
};

//get all polygons
const getPolygons = (req,res) => {
    pool.query(`SELECT row_to_json(fc) AS geojson FROM 
    (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f))
    As features FROM 
    (SELECT 
    'Feature' As type, 
    ST_AsGeoJSON(ST_Transform(ST_FlipCoordinates(lg.geom), 4326),15,0)::json As geometry,
    row_to_json((id, name, area, description)) As properties
    FROM POLYGON As lg) As f ) As fc`, (error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json({
            polygons: results.rows[0].geojson,
        });
    });
};

//get polygon by id
const getPolygonById = (req,res) => {
    const reqId = parseInt(req.params.id);
    pool.query("SELECT * FROM POLYGON WHERE id = $1", [reqId], (error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json({
            data: results.rows,
        });
    });
};

//create polygon
const newPolygon = (req,res) => {
    const {properties, geometry} = req.body;
    const geom = JSON.stringify(geometry)
    pool.query(
        `INSERT INTO POLYGON (name, geom, description) VALUES ('${properties.name}', ST_GeomFromGeoJSON('${geom}'), '${properties.description}')`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(201).send('New polygon added');
        }
    );
};

//update polygon
const updatePolygon = (req,res) => {
    const reqId = parseInt(req.params.id);
    const {properties, geometry} = req.body;
    const geom = JSON.stringify(geometry)
    pool.query(
        `UPDATE POLYGON SET name='${properties.name}', geom = ST_GeomFromGeoJSON('${geom}'), description='${properties.description}' WHERE id=${reqId}`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(200).send(`Polygon modified with ID: ${reqId}`);
        }
    );
};

//delete polygon
const deletePolygon = (req,res) => {
    const reqId = parseInt(req.params.id);
    pool.query(
        `DELETE FROM POLYGON WHERE id=${reqId}`,
        (error, results) => {
            if(error) {
                throw error;
            }
            res.status(200).send(`Polygon deleted with ID: ${reqId}`);
        }
    );
};


app.route("/points").get(getPoints).post(newPoint);
app.route("/points/:id").get(getPointsById).put(updatePoint).delete(deletePoint);
app.route("/lines").get(getLines).post(newLine);
app.route("/lines/:id").get(getLinesById).put(updateLine).delete(deleteLine);
app.route("/polygons").get(getPolygons).post(newPolygon);
app.route("/polygons/:id").get(getPolygonById).put(updatePolygon).delete(deletePolygon);

module.exports = app;