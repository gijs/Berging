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
  AfvoerModel = (function() {
    var d;
    __extends(AfvoerModel, Backbone.Model);
    function AfvoerModel() {
      this.get_max_hoogte = __bind(this.get_max_hoogte, this);
      this.addOne = __bind(this.addOne, this);
      this.validate = __bind(this.validate, this);
      AfvoerModel.__super__.constructor.apply(this, arguments);
    }
    d = new Date();
    AfvoerModel.prototype.defaults = function() {
      return {
        datum: d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear(),
        naam_waterschap: "",
        naam_initiatiefnemer: "",
        naam_project: "",
        bruto_opp: 0,
        bestaand_verhard: 0,
        nieuw_totaal_verhard: 0,
        netto_compensatie_opp: 0,
        infiltratie_percentage: 0,
        toekomstig_verhard_opp: 0,
        afvoercoefficient: 0,
        maaiveld: 0,
        ghg: 0,
        infiltratie_snelheid: 0,
        afvoercoef_t10: 0,
        afvoercoef_t100: 0,
        lengte: 1,
        talud: 1,
        toekomstig_maaiveld_niveau: 1
      };
    };
    AfvoerModel.prototype.initialize = function() {
      return console.log("Initializing AfvoerModel");
    };
    AfvoerModel.prototype.validate = function(attrs) {
      return console.log("validate()");
    };
    AfvoerModel.prototype.addOne = function() {
      var toekomstig_maaiveld_niveau;
      console.log("addOne()");
      toekomstig_maaiveld_niveau = this.get('toekomstig_maaiveld_niveau');
      console.log(toekomstig_maaiveld_niveau);
      return this.set({
        'toekomstig_maaiveld_niveau': toekomstig_maaiveld_niveau + 1
      });
    };
    AfvoerModel.prototype.get_max_hoogte = function() {
      return this.get('toekomstig_maaiveld_niveau') - this.get('ghg') - 0.5;
    };
    return AfvoerModel;
  })();
  AppView = (function() {
    __extends(AppView, Backbone.View);
    function AppView() {
      this.done = __bind(this.done, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);
      this.recalc = __bind(this.recalc, this);
      AppView.__super__.constructor.apply(this, arguments);
    }
    AppView.prototype.template = "#app-form";
    AppView.prototype.events = {
      'click #done_button': 'done',
      'blur input': 'recalc'
    };
    AppView.prototype.recalc = function(event) {
      console.log("recalc()");
      console.log($(event.target).val());
      console.log($(event.target)[0].id);
      this.model.addOne();
      return $('span#toekomstig_maaiveld_niveau').html(this.model.get('toekomstig_maaiveld_niveau'));
    };
    AppView.prototype.initialize = function() {
      this.template = _.template($(this.template).html());
      return this.render();
    };
    AppView.prototype.render = function() {
      $("#name").focus();
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    };
    AppView.prototype.done = function(e) {
      var doc;
      console.log(e);
      console.log("Done!");
      doc = jsPDF();
      doc.text(20, 20, 'Rapportage');
      doc.text(20, 30, this.model.get('naam_waterschap'));
      doc.addPage();
      doc.text(20, 20, 'Leuk he?');
      return doc.output('datauri');
    };
    return AppView;
  })();
  $(document).ready(function() {
    var am;
    am = new AfvoerModel;
    return window.app = new AppView({
      el: $("#app"),
      template: $("#app-form"),
      model: am
    });
  });
}).call(this);
