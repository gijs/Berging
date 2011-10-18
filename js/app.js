(function() {
  var AfvoerModel, AppView, DELTAMAX_167, afvoertabel;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  DELTAMAX_167 = 4.1;
  afvoertabel = {
    afvoercoefficient: [0.3, 0.5, 0.8, 1.2, 1.5, 1.8, 2.3, 3, 4, 5],
    bergingsvolume_t10: [5.1, 4.9, 4.7, 4.3, 4.1, 3.9, 3.6, 3.4, 3.2, 3.0],
    bergingsvolume_t100: [1.9, 1.7, 1.4, 1.1, 1.0, 1.0, 1.1, 1.0, 1.0, 1.0],
    time: [1, 1, 1, 1, 0.883, 0.667, 0.417, 0.333, 0.208, 0.167],
    berging_uur_1: [3.4, 3.4, 3.4, 3.3, 3.3, 3.3, 3.2, 3.2, 3.0, 2.8],
    extra_berging_uur_1: [1.6, 1.6, 1.6, 1.6, 1.5, 1.5, 1.4, 1.4, 1.2, 1.2],
    tijd_uur_1: [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.0833],
    berging_uur_2: [4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.5, 3.3, 3.1, 2.9],
    extra_berging_uur_2: [1.8, 1.7, 1.6, 1.5, 1.4, 1.4, 1.4, 1.2, 1.2, 1.1],
    tijd_uur_2: [0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.2083, 0.2083, 0.1667, 0.125]
  };
  AppView = (function() {
    __extends(AppView, Backbone.View);
    function AppView() {
      this.done = __bind(this.done, this);
      this.activeInput = __bind(this.activeInput, this);
      this.showStep3 = __bind(this.showStep3, this);
      this.showStep2 = __bind(this.showStep2, this);
      this.showStep1 = __bind(this.showStep1, this);
      this.initialize = __bind(this.initialize, this);
      AppView.__super__.constructor.apply(this, arguments);
    }
    AppView.prototype.events = {
      'click #step1_button': 'showStep2',
      'click #step2_button': 'showStep3',
      'click #done_button': 'done'
    };
    AppView.prototype.initialize = function() {
      console.log("AppView.initialize()");
      return this.showStep1();
    };
    AppView.prototype.showStep1 = function() {
      var template;
      console.log("AppView.showStep1()");
      template = _.template($("#algemene_gegevens").html(), {});
      return this.el.html(template);
    };
    AppView.prototype.showStep2 = function() {
      var template;
      console.log("AppView.showStep2()");
      template = _.template($("#stap2_kenmerken").html(), {});
      return this.el.html(template);
    };
    AppView.prototype.showStep3 = function() {
      var template;
      console.log("AppView.showStep3()");
      template = _.template($("#stap3_systeemeisen").html(), {});
      return this.el.html(template);
    };
    AppView.prototype.activeInput = function() {
      return console.log;
    };
    AppView.prototype.done = function(e) {
      var doc;
      console.log(e);
      console.log("Done!");
      doc = jsPDF();
      doc.text(20, 20, 'Rapportage');
      doc.text(20, 30, 'Dit rapport is client-side gegenereerd.');
      doc.addPage();
      doc.text(20, 20, 'Leuk he?');
      return doc.output('datauri');
    };
    return AppView;
  })();
  AfvoerModel = (function() {
    var validate;
    __extends(AfvoerModel, Backbone.Model);
    function AfvoerModel() {
      this.get_max_hoogte = __bind(this.get_max_hoogte, this);
      AfvoerModel.__super__.constructor.apply(this, arguments);
    }
    AfvoerModel.prototype.defaults = function() {
      return {
        done: false,
        bruto_opp: 0,
        bestaand_verhard: 0,
        nieuw_totaal_verhard: 0,
        netto_compensatie_opp: 0,
        infiltratie_percentage: 0,
        maaiveld: 0,
        ghg: 0,
        infiltratie_snelheid: 0,
        afvoercoef_t10: 0,
        afvoercoef_t100: 0,
        lengte: 0,
        talud: 1
      };
    };
    AfvoerModel.prototype.initialize = function() {
      var breedte, breedte_1, breedte_2, breedte_max, extra_berging_t100, extra_berging_t100_1, extra_berging_t100_2, extra_berging_t100_per_m2, extra_berging_t100_per_m2_1, extra_berging_t100_per_m2_2, hoogte_nieuw, oppervlakte_kratten, oppervlakte_kratten_1, oppervlakte_kratten_2, talud_nieuw, volume_berging_infiltratie, volume_berging_infiltratie_1, volume_berging_infiltratie_2, volume_berging_infiltratie_per_m2, volume_berging_infiltratie_per_m2_1, volume_berging_infiltratie_per_m2_2;
      console.log("Initializing AfvoerModel");
      volume_berging_infiltratie_per_m2 = (this.t10_min + (this.ac - this.ac_min) / (this.ac_max - this.ac_min) * (this.t10_max - this.t10_min)) / 100;
      volume_berging_infiltratie_per_m2_1 = (this.t10_min_1 + (this.ac - this.ac_min) / (this.ac_max - this.ac_min) * (this.t10_max_1 - this.t10_min_1)) / 100;
      volume_berging_infiltratie_per_m2_2 = (this.t10_min_2 + (this.ac - this.ac_min) / (this.ac_max - this.ac_min) * (this.t10_max_2 - this.t10_min_2)) / 100;
      volume_berging_infiltratie = volume_berging_infiltratie_per_m2 * (this.nieuw_verhard_oppervlak - this.bestaand_verhard_oppervlak);
      volume_berging_infiltratie_1 = volume_berging_infiltratie_per_m2_1 * (this.nieuw_verhard_oppervlak - this.bestaand_verhard_oppervlak);
      volume_berging_infiltratie_2 = volume_berging_infiltratie_per_m2_2 * (this.nieuw_verhard_oppervlak - this.bestaand_verhard_oppervlak);
      extra_berging_t100_per_m2 = (this.t100_min + (this.ac - this.ac_min) / (this.ac_max - this.ac_min) * (this.t100_max - this.t100_min)) / 100;
      extra_berging_t100_per_m2_1 = (this.t100_min_1 + (this.ac - this.ac_min) / (this.ac_max - this.ac_min) * (this.t100_max_1 - this.t100_min_1)) / 100;
      extra_berging_t100_per_m2_2 = (this.t100_min_2 + (this.ac - this.ac_min) / (this.ac_max - this.ac_min) * (this.t100_max_2 - this.t100_min_2)) / 100;
      extra_berging_t100 = this.extra_berging_t100_per_m2 * (this.nieuw_verhard_oppervlak - this.bestaand_verhard_oppervlak);
      extra_berging_t100_1 = this.extra_berging_t100_per_m2_1 * (this.nieuw_verhard_oppervlak - this.bestaand_verhard_oppervlak);
      extra_berging_t100_2 = this.extra_berging_t100_per_m2_2 * (this.nieuw_verhard_oppervlak - this.bestaand_verhard_oppervlak);
      if ((this.toekomstig_maaiveld_niveau - this.ghg - this.hoogte) < 1) {
        oppervlakte_kratten = -2 * this.infiltratiesnelheid2 * this.time * this.hoogte + 4 * this.infiltratiesnelheid22 * this.time2 * this.hoogte2 + 4 * this.hoogte * this.delta_max * this.porosity / 1000.5 / 2 * this.hoogte * this.porosity / 1002;
      } else {
        oppervlakte_kratten = -2 * this.infiltratiesnelheid2 * this.time * this.hoogte + 4 * this.infiltratiesnelheid22 * this.time2 * this.hoogte2 + 4 * this.hoogte * this.delta_max * this.porosity / 100 + 4 * this.infiltratiesnelheid2 * this.time * this.delta_max * 0.5 / 2 * this.hoogte * this.porosity / 100 + 2 * this.infiltratiesnelheid2 * this.time2;
      }
      if ((this.toekomstig_maaiveld_niveau - this.ghg - this.hoogte) < 1) {
        oppervlakte_kratten_1 = -2 * this.infiltratiesnelheid2 * this.time_1 * this.hoogte + 4 * this.infiltratiesnelheid22 * this.time_12 * this.hoogte2 + 4 * this.hoogte * this.delta_max_1 * this.porosity / 1000.5 / 2 * this.hoogte * this.porosity / 1002;
      } else {
        oppervlakte_kratten_1 = -2 * this.infiltratiesnelheid2 * this.time_1 * this.hoogte + 4 * this.infiltratiesnelheid22 * this.time_12 * this.hoogte2 + 4 * this.hoogte * this.delta_max_1 * this.porosity / 100 + 4 * this.infiltratiesnelheid2 * this.time_1 * this.delta_max_1 * 0.5 / 2 * this.hoogte * this.porosity / 100 + 2 * this.infiltratiesnelheid2 * this.time_12;
      }
      if ((this.toekomstig_maaiveld_niveau - this.ghg - this.hoogte) < 1) {
        oppervlakte_kratten_2 = -2 * this.infiltratiesnelheid2 * this.time_2 * this.hoogte + 4 * this.infiltratiesnelheid22 * this.time_22 * this.hoogte2 + 4 * this.hoogte * this.delta_max_2 * this.porosity / 1000.5 / 2 * this.hoogte * this.porosity / 1002;
      } else {
        oppervlakte_kratten_2 = -2 * this.infiltratiesnelheid2 * this.time_2 * this.hoogte + 4 * this.infiltratiesnelheid22 * this.time_22 * this.hoogte2 + 4 * this.hoogte * this.delta_max_2 * this.porosity / 100 + 4 * this.infiltratiesnelheid2 * this.time_2 * this.delta_max_2 * 0.5 / 2 * this.hoogte * this.porosity / 100 + 2 * this.infiltratiesnelheid2 * this.time_22;
      }
      breedte = this.delta_max / this.hoogte + this.infiltratiesnelheid2 * this.time * this.lengte + this.talud * this.hoogte;
      breedte_1 = this.delta_max_1 / this.hoogte + this.infiltratiesnelheid2 * this.time_1 * this.lengte + this.talud * this.hoogte;
      breedte_2 = this.delta_max_2 / this.hoogte + this.infiltratiesnelheid2 * this.time_2 * this.lengte + this.talud * this.hoogte;
      breedte_max = Math.max(breedte, breedte_1, breedte_2);
      if ((breedte_max - 2 * this.talud * this.hoogte) < 0) {
        talud_nieuw = ((this.breedte_max - this.talud * this.hoogte) / this.hoogte) - 0.05;
        hoogte_nieuw = ((this.breedte_max - this.talud * this.hoogte) / this.talud) - 0.05;
        return this.lengte_nieuw = (((this.breedte_max - (this.talud * this.hoogte)) / (this.talud * this.hoogte)) * this.lengte) - 0.05;
      }
    };
    validate = __bind(function(attrs) {
      console.log("Validating");
      console.log(attrs);
      if (this.ac >= this.ac_min && this.ac <= this.ac_max) {
        "false";
      }
      if (infiltratiesnelheid1 < 0.5) {
        this.infiltratiesnelheid2 = 0;
        this.delta_max = min(this.delta_max, DELTAMAX_167);
      }
      if (infiltratiesnelheid1 >= 0.5 && infiltratiesnelheid1 <= 2) {
        this.infiltratiesnelheid2 = ((infiltratiesnelheid1 - 0.5) / 1.5) * infiltratiesnelheid1;
      }
      if (infiltratiesnelheid1 > 2) {
        return this.infiltratiesnelheid2 = infiltratiesnelheid1;
      }
    }, AfvoerModel);
    AfvoerModel.prototype.toggle = function() {
      return this.save({
        done: !this.get('done')
      });
    };
    AfvoerModel.prototype.get_max_hoogte = function() {
      var max_hoogte;
      max_hoogte = this.toekomstig_maaiveld_niveau - this.ghg - 0.5;
      return max_hoogte;
    };
    return AfvoerModel;
  }).call(this);
  $(document).ready(function() {
    return window.app = new AppView({
      el: $("#app")
    });
  });
}).call(this);
