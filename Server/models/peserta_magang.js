'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Peserta_Magang extends Model {
    static associate(models) {
      Peserta_Magang.hasMany(models.Presensi, {
        foreignKey: 'p_id', 
        as: 'presensimagang', 
      });
      Peserta_Magang.hasMany(models.Status_tugas, {
        foreignKey: 'p_id', 
        as: 'status_tugas', 
      });
    }
  }
  Peserta_Magang.init({
    nama: DataTypes.STRING,
    asal_univ: DataTypes.STRING,
    asal_jurusan: DataTypes.STRING,
    tanggal_mulai: DataTypes.DATEONLY,
    tanggal_selesai: DataTypes.DATEONLY,
    status_aktif: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshTokens: DataTypes.STRING    
  }, {
    sequelize,
    modelName: 'Peserta_Magang',
  });
  return Peserta_Magang;
};