const mysql = require('mysql');
const dbConfig = require('../db.config');

const connection = mysql.createConnection(dbConfig);

connection.connect();

const Bar = {
  getList: (callback) => {
    connection.query('SELECT * FROM bar ba  INNER JOIN ubicacion ub ON ba.id_ubicacion = ub.id_ubicacion', callback);
  },

  get: (id, callback) => {
    connection.query('SELECT * FROM bar ba INNER JOIN ubicacion ub ON ba.id_ubicacion = ub.id_ubicacion WHERE id_bar = ?', [id], callback);
  },
  create: (newBar, callback) => {
    let idUbicacion;
    const ubicacion = [
        [newBar.nombre_bar,newBar.latitud,newBar.longitud]
    ];
    connection.query('INSERT INTO ubicacion (nombre_ubicacion, latitud, longitud) VALUES ?', [ubicacion], (error, result) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        idUbicacion = result.insertId;  
        const bar =[[          
          newBar.nombre_bar,
          idUbicacion,
          newBar.desayuno_horario,
          newBar.almuerzo_horario,
          newBar.merienda_horario,
        ]
        ];  
        connection.query('INSERT INTO bar (nombre_bar, id_ubicacion, desayuno_horario, almuerzo_horario, merienda_horario) VALUES ?', [bar], (error, result) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, result);
          }
        });
      }
   }); 
  },

  update: (id, updatedBar, callback) => {  
    const ubicacion = [
        [updatedBar.nombre_bar,updatedBar.latitud,updatedBar.longitud]
    ];
    console.log(ubicacion)
    connection.query('UPDATE ubicacion SET nombre_ubicacion = ?, latitud = ?, longitud = ? WHERE id_ubicacion = ?', [updatedBar.nombre_bar, updatedBar.latitud, updatedBar.longitud, updatedBar.id_ubicacion], (error, result) => {
      if (error) {
        callback(error, null);
        return;
      } else {
        const bar =[[          
          updatedBar.nombre_bar,
          updatedBar.id_ubicacion,
          updatedBar.desayuno_horario,
          updatedBar.almuerzo_horario,
          updatedBar.merienda_horario,
        ]
        ];  
        connection.query('UPDATE ubicacion SET nombre_bar = ?, id_ubicacion = ?, desayuno_horario = ?, almuerzo_horario = ?, merienda_horario = ? WHERE id_bar = ?', [updatedBar.nombre_bar,updatedBar.id_ubicacion, updatedBar.desayuno_horario,updatedBar.almuerzo_horario,updatedBar.merienda_horario,id], (error, result) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, result);
          }
        });
      }
    });
  },

  delete: (id, callback) => {
    connection.query('DELETE FROM bar WHERE id_bar = ?', [id], callback);
  },
};

module.exports = Bar;