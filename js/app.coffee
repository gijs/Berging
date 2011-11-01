DELTAMAX_167 = 4.1
afvoertabel = 
    afvoercoefficient: [0.3, 0.5, 0.8, 1.2, 1.5, 1.8, 2.3, 3, 4, 5]
    bergingsvolume_t10: [5.1, 4.9, 4.7, 4.3, 4.1, 3.9, 3.6, 3.4, 3.2, 3.0]
    bergingsvolume_t100: [1.9, 1.7, 1.4, 1.1, 1.0, 1.0, 1.1, 1.0, 1.0, 1.0]
    time: [1, 1, 1, 1, 0.883, 0.667, 0.417, 0.333, 0.208, 0.167]
    berging_uur_1: [3.4, 3.4, 3.4, 3.3, 3.3, 3.3, 3.2, 3.2, 3.0, 2.8]
    extra_berging_uur_1: [1.6, 1.6, 1.6, 1.6, 1.5, 1.5, 1.4, 1.4, 1.2, 1.2]
    tijd_uur_1: [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.0833]
    berging_uur_2: [4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.5, 3.3, 3.1, 2.9]
    extra_berging_uur_2: [1.8, 1.7, 1.6, 1.5, 1.4, 1.4, 1.4, 1.2, 1.2, 1.1]
    tijd_uur_2: [0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.2083, 0.2083, 0.1667, 0.125]


class AfvoerModel extends Backbone.Model
    d = new Date()
    defaults: ->
        datum: d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear()
        bruto_opp: 0
        bestaand_verhard: 0
        nieuw_totaal_verhard: 0
        netto_compensatie_opp: 0
        infiltratie_percentage: 0
        maaiveld: 0
        ghg: 0
        infiltratie_snelheid: 0
        afvoercoef_t10: 0
        afvoercoef_t100: 0
        lengte: 1
        talud: 1
        toekomstig_maaiveld_niveau: 1

    initialize: ->
        console.log "Initializing AfvoerModel"

    validate: (attrs) =>
        console.log "validate()"

    addOne: =>
        console.log "addOne()"
        toekomstig_maaiveld_niveau = @get('toekomstig_maaiveld_niveau')
        console.log toekomstig_maaiveld_niveau
        @set
            'toekomstig_maaiveld_niveau': (toekomstig_maaiveld_niveau + 1)
        
    get_max_hoogte: =>
        @get('toekomstig_maaiveld_niveau') - @get('ghg') - 0.5


class AppView extends Backbone.View
    template: "#app-form"
    events:
        'click #done_button': 'done'
        'blur input': 'recalc'
    recalc: (event) =>
        console.log "recalc()"
        # console.log $(event.target).val()
        @model.addOne()
    initialize: =>
        @template = _.template $(@template).html()
        @render()
    render: =>
        $("#name").focus()
        $(@el).html(@template(@model.toJSON()))
        @
    done: (e) =>
        console.log e
        console.log "Done!"
        doc = jsPDF()
        doc.text 20, 20, 'Rapportage'
        doc.text 20, 30, 'Dit rapport is client-side gegenereerd.'
        doc.addPage()
        doc.text 20, 20, 'Leuk he?'
        doc.output 'datauri'


$(document).ready ->
    am = new AfvoerModel
    window.app = new AppView
        el: $("#app")
        template: $("#app-form")
        model: am
