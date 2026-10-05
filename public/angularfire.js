var config = {
    apiKey: "AIzaSyA49DOJyv4McoQ_sOcjZOLiFBeO9a8Xz-w",
    authDomain: "ve-archeo.firebaseapp.com",
    databaseURL: "https://ve-archeo-default-rtdb.firebaseio.com",
    projectId: "ve-archeo",
    storageBucket: "ve-archeo.firebasestorage.app",
    messagingSenderId: "284441726851",
    appId: "1:284441726851:web:4f894fac54631242e230b6"
};

firebase.initializeApp(config);

(function() {
    'use strict';

    // Values are the Italian terms stored in the database; labels are what the form shows.
    var EPOCHS = [
        {value: 'Paleolitico', label: 'Paleolithic', color: '#5d4037'},
        {value: 'Mesolitico', label: 'Mesolithic', color: '#795548'},
        {value: 'Neolitico', label: 'Neolithic', color: '#8d6e63'},
        {value: 'Eta Del Rame', label: 'Copper Age', color: '#bf360c'},
        {value: 'Eta Del Bronzo', label: 'Bronze Age', color: '#e65100'},
        {value: 'Eta Del Ferro', label: 'Iron Age', color: '#455a64'},
        {value: 'Eta Preromana', label: 'Pre-Roman', color: '#6d4c41'},
        {value: 'Eta Romana', label: 'Roman', color: '#c62828'},
        {value: 'Tarda Antichita', label: 'Late Antiquity', color: '#ad1457'},
        {value: 'Altomedioevo', label: 'Early Medieval', color: '#6a1b9a'},
        {value: 'Medioevo', label: 'Medieval', color: '#283593'},
        {value: 'Bassomedioevo', label: 'Late Medieval', color: '#0277bd'},
        {value: 'Eta Moderna', label: 'Modern', color: '#2e7d32'},
        {value: 'Eta Contemporanea', label: 'Contemporary', color: '#9e9d24'},
        {value: 'Indeterminata', label: 'Undetermined', color: '#757575'}
    ];
    var NO_EPOCH_COLOR = '#9e9e9e';

    var CENTURIES = [];
    for (var c = 12; c >= 1; c--) { CENTURIES.push(c + ' BC'); }
    for (c = 1; c <= 20; c++) { CENTURIES.push(c + ' AD'); }

    // Layer (US) form, following the paper "Scheda US" and the USForm sheet.
    var LAYER_SECTIONS = [
        {title: 'Layer Information', fields: [
            {key: 'sitenumber', label: 'Site Number'},
            {key: 'usnumber', label: 'Layer Number'},
            {key: 'gencatnum', label: 'Gen. Catalog Number'},
            {key: 'intcatnum', label: 'International Catalog Number'},
            {key: 'locality', label: 'Locality'},
            {key: 'year', label: 'Year'},
            {key: 'area', label: 'Area'},
            {key: 'sector', label: 'Sector'},
            {key: 'environment', label: 'Environment'},
            {key: 'quadrant', label: 'Quadrant'},
            {key: 'shares', label: 'Shares'},
            {key: 'plants', label: 'Plants'}
        ]},
        {title: 'Composition', fields: [
            {key: 'nphotos', label: 'N. Photos'},
            {key: 'tabmaterial', label: 'Tab Material'},
            {key: 'definition', label: 'Definition'},
            {key: 'descriptcriter', label: 'Distinctive Criteria'},
            {key: 'methodform', label: 'Method of Formation'},
            {key: 'geocomp', label: 'Geologic Components'},
            {key: 'orgcomp', label: 'Organic Components'},
            {key: 'articomp', label: 'Artificial Components'},
            {key: 'consistency', label: 'Consistency'},
            {key: 'measures', label: 'Measures'},
            {key: 'conservationstate', label: 'State of Conservation'}
        ]}
    ];
    var LAYER_NOTES = [
        {key: 'description', label: 'Description'},
        {key: 'observations', label: 'Observations'},
        {key: 'interpretation', label: 'Interpretation'}
    ];
    var LAYER_DATING = [
        {key: 'datingelt', label: 'Dating Elements'},
        {key: 'quantitativefinddata', label: 'Quantitative Find Data'},
        {key: 'samples', label: 'Samples'},
        {key: 'float', label: 'Floatation'},
        {key: 'sieve', label: 'Sieving'},
        {key: 'stratigraphicrel', label: 'Stratigraphic Reliability'},
        {key: 'director', label: 'Director'},
        {key: 'responsible', label: 'Responsible'}
    ];
    var LAYER_RELATIONS = [
        {key: 'equalto', label: 'Equal to'},
        {key: 'restedonby', label: 'Rested on by'},
        {key: 'coveredby', label: 'Covered by'},
        {key: 'cutby', label: 'Cut by'},
        {key: 'filledby', label: 'Filled by'},
        {key: 'boundto', label: 'Bound to'},
        {key: 'leanson', label: 'Leans on'},
        {key: 'covering', label: 'Covering'},
        {key: 'cutting', label: 'Cutting'},
        {key: 'filling', label: 'Filling'},
        {key: 'infrontof', label: 'In front of'},
        {key: 'behind', label: 'Behind'}
    ];
    var COLORS = ['Red', 'Grey', 'Green', 'Yellow', 'Black', 'Brown', 'White'];

    // Find forms. Organic/Inorganic and Structure come from the team's draft forms,
    // Pole from the PoleForm sheet.
    var COMMON_FIND_FIELDS = [
        {key: 'description', label: 'Description', type: 'textarea'},
        {key: 'observations', label: 'Observations', type: 'textarea'}
    ];
    var FIND_TYPES = [
        {value: 'OrgInorg', label: 'Organic/Inorganic find', fields: [
            {key: 'ministry', label: 'Ministry for Cultural Assets and Activities'},
            {key: 'archaeologist', label: 'Archaeologist'},
            {key: 'locality', label: 'Locality'},
            {key: 'form', label: 'Form'},
            {key: 'initials', label: 'Initials'}
        ]},
        {value: 'HandCrStone', label: 'Handcrafted stone', fields: [
            {key: 'material', label: 'Material'},
            {key: 'technique', label: 'Technique'},
            {key: 'measures', label: 'Measures'},
            {key: 'conservationstate', label: 'State of Conservation'},
            {key: 'dating', label: 'Dating'}
        ]},
        {value: 'Skeleton', label: 'Skeleton', fields: [
            {key: 'position', label: 'Position'},
            {key: 'orientation', label: 'Orientation'},
            {key: 'sex', label: 'Sex'},
            {key: 'age', label: 'Age'},
            {key: 'conservationstate', label: 'State of Conservation'}
        ]},
        {value: 'Tomb', label: 'Tomb', fields: [
            {key: 'tombtype', label: 'Tomb Type'},
            {key: 'orientation', label: 'Orientation'},
            {key: 'measures', label: 'Measures'},
            {key: 'gravegoods', label: 'Grave Goods'},
            {key: 'dating', label: 'Dating'}
        ]},
        {value: 'Struct', label: 'Structure', fields: [
            {key: 'coatingrel', label: 'Relationship between coating and architectural structure'},
            {key: 'datingelt', label: 'Dating elements'},
            {key: 'stylisticphase', label: 'Stylistic phase'},
            {key: 'period', label: 'Period'},
            {key: 'stratphase', label: 'Stratigraphic phase'}
        ]},
        {value: 'Pole', label: 'Pole', fields: [
            {key: 'polenumber', label: 'Pole Number'},
            {key: 'polelength', label: 'Pole Length'},
            {key: 'polediameter', label: 'Pole Diameter'},
            {key: 'tiplength', label: 'Length of Tip'},
            {key: 'cutby', label: 'Cut By'},
            {key: 'hasbark', label: 'Has Bark?', type: 'yesno'}
        ]}
    ];
    FIND_TYPES.forEach(function(t) {
        t.fields = t.fields.concat(COMMON_FIND_FIELDS);
    });

    var AUTH_ERRORS = {
        'auth/invalid-credential': 'Incorrect e-mail or password.',
        'auth/wrong-password': 'Incorrect e-mail or password.',
        'auth/user-not-found': 'Incorrect e-mail or password.',
        'auth/invalid-email': 'Please enter a valid e-mail address.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/network-request-failed': 'Network error. Check your connection and try again.'
    };

    function today() {
        return new Date().toISOString().slice(0, 10);
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch) {
            return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[ch];
        });
    }

    function tokens(value) {
        return value ? String(value).split(',').map(function(s) { return s.trim(); }).filter(Boolean) : [];
    }

    angular.module('app', ['firebase']);

    angular.module('app').controller('ArchCtrl', function($scope, $firebaseObject, $timeout) {
        var bc = this;
        var db = firebase.database();
        var bound = {};          // scope name -> $firebaseObject bound with $bindTo
        var sitesQuery = null;
        var layersRef = null, layerObjs = {};
        var findsRef = null, findObjs = {};
        var map = null, siteMarkers = null, gisMarkers = null, gisLoaded = false;

        bc.view = 'loading';
        bc.user = null;
        bc.credentials = {email: '', password: '', remember: true};
        bc.sites = [];
        bc.searchTxt = '';
        bc.searchResults = [];
        bc.layerList = [];
        bc.findList = [];
        bc.epochs = EPOCHS;
        bc.centuries = CENTURIES;
        bc.layerSections = LAYER_SECTIONS;
        bc.layerNotes = LAYER_NOTES;
        bc.layerDating = LAYER_DATING;
        bc.layerRelations = LAYER_RELATIONS;
        bc.colors = COLORS;
        bc.findTypes = FIND_TYPES;

        /* NAVIGATION * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        bc.go = function(view) {
            bc.view = view;
            bc.notice = null;
            window.scrollTo(0, 0);
            if (view === 'search') { bc.searchSite(); }
            if (view === 'map') { $timeout(initMap); }
            refreshLabels();
        };

        bc.index = function() {
            bc.go('choice');
        };

        // Materialize floats a field's label only when it sees a value; values bound
        // from Firebase arrive after render, so re-check after each load.
        function refreshLabels() {
            $timeout(function() {
                if (window.Materialize && Materialize.updateTextFields) {
                    Materialize.updateTextFields();
                }
                $('textarea.materialize-textarea').trigger('autoresize');
            }, 50);
        }

        function onDbError(err) {
            console.error(err);
            $scope.$evalAsync(function() {
                bc.notice = 'Database error: ' + (err && err.message ? err.message : err);
            });
        }

        /* AUTHENTICATION * * * * * * * * * * * * * * * * * * * * * * * * * * */

        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                teardown();
                $scope.$evalAsync(function() {
                    bc.user = null;
                    bc.view = 'login';
                });
                return;
            }
            db.ref('editors').child(user.uid).once('value').then(function(snap) {
                if (snap.val() !== true) {
                    $scope.$evalAsync(function() {
                        bc.loginError = 'This account is not authorised to use VE-Archeo. Ask an administrator to add it.';
                    });
                    return firebase.auth().signOut();
                }
                $scope.$evalAsync(function() {
                    bc.user = {email: user.email, name: user.email.split('@')[0]};
                    bc.credentials.password = '';
                    loadSites();
                    bc.go('choice');
                });
            }).catch(onDbError);
        });

        bc.signIn = function() {
            var auth = firebase.auth();
            var persistence = bc.credentials.remember ?
                firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
            bc.loginError = null;
            bc.loginInfo = null;
            bc.signingIn = true;
            auth.setPersistence(persistence).then(function() {
                return auth.signInWithEmailAndPassword(bc.credentials.email.trim(), bc.credentials.password);
            }).catch(function(err) {
                $scope.$evalAsync(function() {
                    bc.loginError = AUTH_ERRORS[err.code] || err.message;
                });
            }).finally(function() {
                $scope.$evalAsync(function() { bc.signingIn = false; });
            });
        };

        bc.resetPassword = function() {
            bc.loginError = null;
            bc.loginInfo = null;
            if (!bc.credentials.email) {
                bc.loginError = 'Enter your e-mail address first.';
                return;
            }
            firebase.auth().sendPasswordResetEmail(bc.credentials.email.trim()).then(function() {
                $scope.$evalAsync(function() {
                    bc.loginInfo = 'If this address has an account, a password reset e-mail is on its way.';
                });
            }).catch(function(err) {
                $scope.$evalAsync(function() { bc.loginError = AUTH_ERRORS[err.code] || err.message; });
            });
        };

        bc.signOut = function() {
            firebase.auth().signOut();
        };

        function teardown() {
            ['site', 'USlayer', 'find'].forEach(unbind);
            stopLayers();
            stopFinds();
            if (sitesQuery) { sitesQuery.off(); sitesQuery = null; }
        }

        /* THREE-WAY BINDING * * * * * * * * * * * * * * * * * * * * * * * * * */

        function bind(name, ref) {
            unbind(name);
            var obj = $firebaseObject(ref);
            bound[name] = obj;
            return obj.$bindTo($scope, name).then(function() {
                refreshLabels();
                return obj;
            }, onDbError);
        }

        function unbind(name) {
            if (bound[name]) {
                bound[name].$destroy();
                delete bound[name];
            }
            delete $scope[name];
        }

        // $firebaseObject names itself after the last path segment ("data"), so keep
        // the record key separately; $-prefixed fields are never saved by AngularFire.
        function recordData(key) {
            var obj = $firebaseObject(db.ref('data').child(key).child('data'));
            obj.$key = key;
            return obj;
        }

        /* SITES * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        function loadSites() {
            if (sitesQuery) { return; }
            sitesQuery = db.ref('data').orderByChild('birth_certificate/type').equalTo('Site');
            sitesQuery.on('value', function(snap) {
                var list = [];
                snap.forEach(function(child) {
                    var d = child.val().data || {};
                    list.push({
                        key: child.key,
                        catalog: d.catalog || '',
                        sito: d.sito || '',
                        name: d.name || d.place || '',
                        epoch: d.epoch || '',
                        type: d.type || '',
                        interp: d.interp || '',
                        lat: parseFloat(d.lat),
                        lng: parseFloat(d['long'])
                    });
                });
                list.sort(function(a, b) {
                    if (!a.catalog !== !b.catalog) { return a.catalog ? -1 : 1; }  // unnumbered sites last
                    return String(a.catalog).localeCompare(String(b.catalog), undefined, {numeric: true});
                });
                $scope.$evalAsync(function() {
                    bc.sites = list;
                    bc.searchSite();
                    drawSites();
                });
            }, onDbError);
        }

        bc.searchSite = function() {
            var q = (bc.searchTxt || '').toLowerCase().trim();
            bc.searchResults = bc.sites.filter(function(s) {
                if (!q) { return true; }
                return [s.catalog, s.sito, s.name, s.epoch, bc.epochLabel(s.epoch), s.type, s.interp]
                    .join(' ').toLowerCase().indexOf(q) >= 0;
            });
        };

        bc.newSite = function() {
            var key = db.ref('data').push().key;
            db.ref('data').child(key).set({
                birth_certificate: {
                    birthID: key, ckID: key, dor: today(),
                    recorder: bc.user.email, type: 'Site', group: 'Site'
                },
                data: {ckID: key, sopr: 'Soprintendenza Archeologica per il Veneto'}
            }).then(function() {
                return db.ref('groups/Site/members').child(key).set(key);
            }).then(function() {
                $scope.$evalAsync(function() { bc.editSite(key); });
            }).catch(onDbError);
        };

        bc.editSite = function(siteKey) {
            bc.siteKey = siteKey;
            unbind('USlayer');
            unbind('find');
            stopFinds();
            bind('site', db.ref('data').child(siteKey).child('data'));
            watchLayers(siteKey);
            bc.go('site');
        };

        bc.deleteSite = function() {
            if (!confirm('Delete this site together with all its layers and finds? This cannot be undone.')) { return; }
            var siteKey = bc.siteKey;
            var updates = {};
            bc.layerList.forEach(function(layer) { addLayerRemoval(updates, layer); });
            updates['data/' + siteKey] = null;
            updates['groups/Site/members/' + siteKey] = null;
            unbind('site');
            stopLayers();
            db.ref().update(updates).then(function() {
                $scope.$evalAsync(function() { bc.go('search'); });
            }).catch(onDbError);
        };

        bc.getLocation = function() {
            if (!navigator.geolocation) {
                bc.notice = 'Geolocation is not supported by this browser.';
                return;
            }
            navigator.geolocation.getCurrentPosition(function(position) {
                $scope.$evalAsync(function() {
                    $scope.site.lat = Number(position.coords.latitude.toFixed(6));
                    $scope.site['long'] = Number(position.coords.longitude.toFixed(6));
                    refreshLabels();
                });
            }, function(err) {
                $scope.$evalAsync(function() { bc.notice = 'Could not get location: ' + err.message; });
            });
        };

        /* Checkbox groups stored as comma-separated text, as in the original sheet. */
        bc.hasToken = function(obj, field, value) {
            return !!obj && tokens(obj[field]).indexOf(value) >= 0;
        };

        bc.toggleToken = function(obj, field, value) {
            var list = tokens(obj[field]);
            var i = list.indexOf(value);
            if (i >= 0) { list.splice(i, 1); } else { list.push(value); }
            obj[field] = list.length ? list.join(', ') : null;
        };

        bc.describe = function(site) {
            return [site.type, bc.epochLabel(site.epoch)].filter(Boolean).join(' · ');
        };

        bc.isEpoch = function(value) {
            return EPOCHS.some(function(e) { return e.value === value; });
        };

        bc.epochLabel = function(value) {
            var match = EPOCHS.filter(function(e) { return e.value === value; })[0];
            return match ? match.label : (value || '');
        };

        function epochColor(value) {
            var match = EPOCHS.filter(function(e) { return e.value === value; })[0];
            return match ? match.color : NO_EPOCH_COLOR;
        }

        /* LAYERS (US) * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        function watchLayers(siteKey) {
            stopLayers();
            layersRef = db.ref('data').child(siteKey).child('data').child('USlayers');
            layersRef.on('value', function(snap) {
                var keys = Object.keys(snap.val() || {});
                $scope.$evalAsync(function() {
                    Object.keys(layerObjs).forEach(function(k) {
                        if (keys.indexOf(k) < 0) { layerObjs[k].$destroy(); delete layerObjs[k]; }
                    });
                    keys.forEach(function(k) {
                        if (!layerObjs[k]) { layerObjs[k] = recordData(k); }
                    });
                    bc.layerList = keys.map(function(k) { return layerObjs[k]; });
                });
            }, onDbError);
        }

        function stopLayers() {
            if (layersRef) { layersRef.off(); layersRef = null; }
            Object.keys(layerObjs).forEach(function(k) { layerObjs[k].$destroy(); });
            layerObjs = {};
            bc.layerList = [];
        }

        bc.layerOrder = function(layer) {
            var n = Number(layer.usnumber || layer.us);
            return isNaN(n) ? Infinity : n;
        };

        bc.saveLayer = function(layer) {
            layer.$save().catch(onDbError);
        };

        bc.addLayer = function() {
            var siteKey = bc.siteKey;
            var numbers = bc.layerList.map(bc.layerOrder).filter(isFinite);
            var us = numbers.length ? Math.max.apply(null, numbers) + 1 : 100;
            var key = db.ref('data').push().key;
            db.ref('data').child(key).set({
                birth_certificate: {
                    birthID: key, ckID: key, dor: today(),
                    recorder: bc.user.email, type: 'Layers'
                },
                data: {
                    ckID: key, site_id: siteKey, us: us, usnumber: us,
                    sitenumber: ($scope.site && $scope.site.catalog) || ''
                }
            }).then(function() {
                var updates = {};
                updates['groups/Layers/members/' + key] = key;
                updates['data/' + siteKey + '/data/USlayers/' + key] = {site_ckId: key, name: 'US ' + us};
                return db.ref().update(updates);
            }).catch(onDbError);
        };

        function addLayerRemoval(updates, layer) {
            Object.keys(layer.finds || {}).forEach(function(findKey) {
                addFindRemoval(updates, findKey);
            });
            updates['data/' + layer.$key] = null;
            updates['groups/Layers/members/' + layer.$key] = null;
        }

        bc.removeLayer = function(layer) {
            var label = layer.usnumber || layer.us || '';
            if (!confirm('Remove US ' + label + ' and all its finds?')) { return; }
            var updates = {};
            addLayerRemoval(updates, layer);
            updates['data/' + bc.siteKey + '/data/USlayers/' + layer.$key] = null;
            db.ref().update(updates).catch(onDbError);
        };

        bc.editLayer = function(layer) {
            bc.layerKey = layer.$key;
            bind('USlayer', db.ref('data').child(layer.$key).child('data'));
            bc.go('layerInfo');
        };

        /* FINDS * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        function watchFinds(layerKey) {
            stopFinds();
            findsRef = db.ref('data').child(layerKey).child('data').child('finds');
            findsRef.on('value', function(snap) {
                var keys = Object.keys(snap.val() || {});
                $scope.$evalAsync(function() {
                    Object.keys(findObjs).forEach(function(k) {
                        if (keys.indexOf(k) < 0) { findObjs[k].$destroy(); delete findObjs[k]; }
                    });
                    keys.forEach(function(k) {
                        if (!findObjs[k]) { findObjs[k] = recordData(k); }
                    });
                    bc.findList = keys.map(function(k) { return findObjs[k]; });
                });
            }, onDbError);
        }

        function stopFinds() {
            if (findsRef) { findsRef.off(); findsRef = null; }
            Object.keys(findObjs).forEach(function(k) { findObjs[k].$destroy(); });
            findObjs = {};
            bc.findList = [];
        }

        function addFindRemoval(updates, findKey) {
            updates['data/' + findKey] = null;
            FIND_TYPES.forEach(function(t) {
                updates['groups/' + t.value + '/members/' + findKey] = null;
            });
        }

        bc.findType = function(value) {
            return FIND_TYPES.filter(function(t) { return t.value === value; })[0] || null;
        };

        bc.editFinds = function(layer) {
            bc.layerKey = layer.$key;
            bc.currentLayer = layer;
            watchFinds(layer.$key);
            bc.go('finds');
        };

        bc.chooseFindType = function() {
            bc.newFindType = null;
            bc.go('chooseFindType');
        };

        bc.addFind = function() {
            var type = bc.findType(bc.newFindType);
            if (!type) {
                bc.notice = 'Choose the type of find first.';
                return;
            }
            var layerKey = bc.layerKey;
            var key = db.ref('data').push().key;
            db.ref('data').child(key).set({
                birth_certificate: {
                    birthID: key, ckID: key, dor: today(),
                    recorder: bc.user.email, type: type.value
                },
                data: {ckID: key, layer_id: layerKey, findtype: type.value}
            }).then(function() {
                var updates = {};
                updates['groups/' + type.value + '/members/' + key] = key;
                updates['data/' + layerKey + '/data/finds/' + key] = {find_ckId: key, name: type.label};
                return db.ref().update(updates);
            }).then(function() {
                $scope.$evalAsync(function() { bc.editFind(key); });
            }).catch(onDbError);
        };

        bc.editFind = function(findKey) {
            bc.findKey = findKey;
            bind('find', db.ref('data').child(findKey).child('data'));
            bc.go('findForm');
        };

        bc.removeFind = function(find) {
            var type = bc.findType(find.findtype);
            if (!confirm('Remove this ' + (type ? type.label.toLowerCase() : 'find') + '?')) { return; }
            var updates = {};
            addFindRemoval(updates, find.$key);
            updates['data/' + bc.layerKey + '/data/finds/' + find.$key] = null;
            db.ref().update(updates).catch(onDbError);
        };

        /* MAP * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        function initMap() {
            if (!map) {
                map = L.map('siteMap').setView([45.43, 12.33], 11);
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                siteMarkers = L.layerGroup().addTo(map);
                gisMarkers = L.layerGroup();
                L.control.layers(null, {
                    'Sites (database)': siteMarkers,
                    'QGIS survey points': gisMarkers
                }, {collapsed: false}).addTo(map);
                addLegend();
                $('#siteMap').on('click', '[data-site]', function() {
                    var key = $(this).attr('data-site');
                    $scope.$apply(function() { bc.editSite(key); });
                });
                drawSites();
                loadGis();
            }
            map.invalidateSize();
        }

        function addLegend() {
            var legend = L.control({position: 'bottomright'});
            legend.onAdd = function() {
                var div = L.DomUtil.create('div', 'map-legend');
                var used = EPOCHS.filter(function(e) {
                    return bc.sites.some(function(s) { return s.epoch === e.value; });
                });
                div.innerHTML = '<b>Epoch</b>' + used.map(function(e) {
                    return '<div><span style="background:' + e.color + '"></span>' + escapeHtml(e.label) + '</div>';
                }).join('') + '<div><span style="background:' + NO_EPOCH_COLOR + '"></span>Not recorded</div>';
                return div;
            };
            legend.addTo(map);
        }

        function marker(lat, lng, color, radius) {
            return L.circleMarker([lat, lng], {
                radius: radius, color: '#fff', weight: 1, fillColor: color, fillOpacity: 0.9
            });
        }

        function drawSites() {
            if (!map) { return; }
            siteMarkers.clearLayers();
            bc.sites.forEach(function(s) {
                if (isNaN(s.lat) || isNaN(s.lng)) { return; }
                marker(s.lat, s.lng, epochColor(s.epoch), 6).bindPopup(
                    '<b>' + escapeHtml(s.name || s.catalog) + '</b><br>' +
                    (s.catalog ? 'Catalogue: ' + escapeHtml(s.catalog) + '<br>' : '') +
                    escapeHtml([s.type, bc.epochLabel(s.epoch)].filter(Boolean).join(' - ')) + '<br>' +
                    '<button class="tablebutton map-edit" data-site="' + escapeHtml(s.key) + '">Edit</button>'
                ).addTo(siteMarkers);
            });
        }

        function loadGis() {
            if (gisLoaded) { return; }
            gisLoaded = true;
            db.ref('gis/features').once('value').then(function(snap) {
                snap.forEach(function(child) {
                    var f = child.val();
                    var popup = '<b>Sito ' + escapeHtml(f.sito || '?') + '</b><br>' +
                        escapeHtml([f.simboli, f.epoche].filter(Boolean).join(' - ')) +
                        (f.name ? '<br>' + escapeHtml(f.name) : '') +
                        (f.site_id ? '<br><button class="tablebutton map-edit" data-site="' + escapeHtml(f.site_id) + '">Open site</button>' : '');
                    marker(f.lat, f.lng, epochColor(f.epoche), 4).bindPopup(popup).addTo(gisMarkers);
                });
            }).catch(function(err) {
                gisLoaded = false;
                onDbError(err);
            });
        }
    });
})();
