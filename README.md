# webgis
Aplikasi webgis sederhana yang dapat menampilkan data spasial (data yang memiliki informasi keruangan) berupa titik, garis dan polygon

##Database
Ubah file.env sesuai dengan database local

Create database
```sql
create database webgis;
```

Create extension
```sql
create extension postgis;
```

Create table
```sql
CREATE TABLE point
(
    id serial primary key,
    name varchar(50),
    geom geometry(Point,4326)
)

CREATE TABLE line
(
    id serial primary key,
    name varchar(50),
    geom geometry(LineString,4326),
    description varchar(100),
    length bigint GENERATED ALWAYS AS (st_length(geom)) STORED
)

CREATE TABLE polygon
(
    id serial primary key,
    name varchar(50),
    geom geometry(Polygon,4326),
    description varchar(100),
    length bigint GENERATED ALWAYS AS (st_length(geom)) STORED
)
```

Insert Data
```sql
insert into point (name,geom) values ('Cuba', 'SRID=4326;POINT(-77.6953125 22.105998799750566)');
insert into line (name,geom,description) values ('Algeria', 'SRID=4326;LINESTRING(21.289374355860424 -11.25,31.353636941500987 3.1640625)', 'Line in Algeria');
insert into polygon (name,geom,description) values ('Mali', 'SRID=4326;POLYGON((-4.04296875 20.138470312451155,-4.04296875 15.961329081596647,-0.87890625 15.961329081596647,-0.87890625 18.979025953255267,-4.04296875 20.138470312451155))', 'Polygon in Mali');
```

## Installation

Run backend

```bash
node server.js
```

Run frontend

```bash
cd frontend
npm install
npm start
```