# VE-ARCHEO WebApp

Web app for recording archaeological sites, stratigraphic layers (US) and finds in the Venice lagoon. Built by the WPI VE16ARCHEO team at the Venice Project Center in 2016.

Stack: AngularJS 1.8 + AngularFire 2.3, Firebase 12 (compat SDK: Realtime Database and Email/Password Auth), Materialize 0.97 and Leaflet 1.9 for the site map. It is a plain static site (`public/`, entry point `public/index.html`) with no build step and no server.

## Run locally

```
npm start          # serves public/ at http://localhost:3000 (needs Node)
```

## Deploy on Vercel

Import the repo in Vercel. No settings are needed: `vercel.json` serves `public/` as a static site with no build step. Old `/angularfire.html` links redirect to `/`.

## Firebase

- Project: `ve-archeo` (config in `public/angularfire.js`; the web API key is public by design).
- Security rules: `database.rules.json`. Only users listed under `/editors/<uid>: true` can read or write. To add an editor, create the user in Firebase Auth and add their UID under `/editors` from the console.

## Rebuilding the database

The source data lives in `data/`:

- `VE16ARCHEO-Site Data.xlsx`: sites and US layers, from the VE16ARCHEO Google Sheet
- `VE16-ARCHEO-qGIS data.xlsx`: QGIS map points (772 survey features with coordinates)
- `VE16-ARCHEO-sitedata.csv`: attribute table of the QGIS layer without coordinates (reference only)
- `seed.json`: the generated database content, ready to upload

To regenerate and upload:

```
pip install openpyxl
python scripts/seed_db.py      # writes data/seed.json
firebase database:update / data/seed.json --project ve-archeo
```

Keys are deterministic, so re-running replaces records instead of duplicating them, and `/editors` is left untouched.

## Database layout

```
data/<id>/birth_certificate   type (Site | Layers | ...), recorder, dor, coordinates
data/<id>/data                the record's fields (sites: catalog, name, lat, long, epoch, type, ...)
groups/<type>/members/<id>    index of records by type
gis/features/<id>             QGIS points (sito, simboli, epoche, lat, lng, site_id when matched)
editors/<uid>                 users allowed to read and write
```
