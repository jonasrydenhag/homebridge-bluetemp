"use strict";

var Service, Characteristic;

var blueTemp = require('/srv/blueTemp');

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-blue-temp", "BlueTemp", BlueTemp);
};

function BlueTemp(log, config) {
  this.log = log;
  this.name = config["name"];
}

BlueTemp.prototype = {
  getState: function (callback) {
    blueTemp.read()
      .then(function (temperature) {
        callback(null, { temperature: temperature });
      })
      .catch(function (err) {
        callback(err || new Error('Cannot get sensor data'), null)
      });
  },

  getServices: function () {
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Jonas")
      .setCharacteristic(Characteristic.Model, "BlueTemp")
      .setCharacteristic(Characteristic.SerialNumber, "BlueTemp");

    var tempService = new Service.TemperatureSensor(this.name);
    tempService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on("get", this.getState.bind(this));

    return [tempService];
  }
};
